import { useStudyStore } from "../stores/study-store";
import { useUserStore } from "../stores/user-store";
import { useAppearanceStore } from "../stores/appearance-store";
import { DEFAULT_SETTINGS } from "../theme";
import { isTauri } from "./client";
import * as repo from "./repo";
import type { Profile } from "./repo";

const PROFILE_KEYS = [
  "displayName", "totalXP", "level", "levelTitle", "currentStreak", "longestStreak",
  "lastStudyDate", "totalCardsReviewed", "totalCorrect", "perfectQuizzes",
  "videosWatched", "domainCorrectCounts", "settings",
] as const;

type ProfileSource = Pick<ReturnType<typeof useUserStore.getState>, (typeof PROFILE_KEYS)[number]>;

function pickProfile(s: ProfileSource): Profile {
  const out = {} as Record<string, unknown>;
  for (const k of PROFILE_KEYS) out[k] = s[k];
  return out as unknown as Profile;
}

// All writes go through one promise chain so they reach SQLite in order.
let queue: Promise<void> = Promise.resolve();
function enqueue(label: string, op: () => Promise<void>): void {
  queue = queue
    .then(op)
    .catch((err) => console.error(`[persistence] ${label} failed:`, err));
}

/** Resolves once every write issued so far has reached the database. */
export function flushPersistence(): Promise<void> {
  return queue;
}

/**
 * Loads saved state into the stores and starts writing changes through.
 * Must complete before the UI renders, otherwise early mutations would be lost.
 */
export async function initPersistence(): Promise<void> {
  if (!isTauri) {
    initBrowserFallback();
    return;
  }
  const [questions, srsCards, watchedVideos, profile, unlockedAchievements, wallpaper] =
    await Promise.all([
      repo.loadQuestions(),
      repo.loadCards(),
      repo.loadWatchedVideos(),
      repo.loadProfile(),
      repo.loadAchievements(),
      repo.loadWallpaper(),
    ]);

  useStudyStore.setState({ questions, srsCards, watchedVideos });
  useUserStore.setState({
    ...(profile ?? {}),
    // settings saved by an older build may lack newer keys
    settings: { ...DEFAULT_SETTINGS, ...(profile?.settings ?? {}) },
    unlockedAchievements,
  });
  useAppearanceStore.setState({ wallpaper });

  subscribeStores();

  if (profile === null && questions.length === 0) importLegacyLocalStorage();
}

function subscribeStores(): void {
  useStudyStore.subscribe((s, prev) => {
    if (s.questions !== prev.questions) {
      const known = new Set(prev.questions.map((q) => q.id));
      const added = s.questions.filter((q) => !known.has(q.id));
      enqueue("insert questions", () => repo.insertQuestions(added));
    }
    if (s.srsCards !== prev.srsCards) {
      const changed = Object.values(s.srsCards).filter(
        (c) => prev.srsCards[c.questionId] !== c,
      );
      enqueue("upsert cards", async () => {
        for (const c of changed) await repo.upsertCard(c);
      });
    }
    if (s.watchedVideos !== prev.watchedVideos) {
      const before = new Set(prev.watchedVideos);
      const after = new Set(s.watchedVideos);
      const now = Date.now();
      const added = s.watchedVideos.filter((id) => !before.has(id));
      const removed = prev.watchedVideos.filter((id) => !after.has(id));
      enqueue("video progress", async () => {
        for (const id of added) await repo.setVideoWatched(id, true, now);
        for (const id of removed) await repo.setVideoWatched(id, false, now);
      });
    }
  });

  useUserStore.subscribe((s, prev) => {
    if (PROFILE_KEYS.some((k) => s[k] !== prev[k])) {
      const snapshot = pickProfile(s);
      enqueue("upsert profile", () => repo.upsertProfile(snapshot, Date.now()));
    }
    if (s.unlockedAchievements !== prev.unlockedAchievements) {
      const known = new Set(prev.unlockedAchievements);
      const added = s.unlockedAchievements.filter((id) => !known.has(id));
      enqueue("insert achievements", () => repo.insertAchievements(added, Date.now()));
    }
  });

  useAppearanceStore.subscribe((s, prev) => {
    if (s.wallpaper !== prev.wallpaper) {
      const next = s.wallpaper;
      enqueue("save wallpaper", () => repo.saveWallpaper(next));
    }
  });
}

// ---- one-time import of data saved by the old zustand/persist localStorage setup ----

const LEGACY_STUDY_KEY = "comptia-study";
const LEGACY_USER_KEY = "comptia-user";
const LEGACY_DONE_KEY = "comptia-legacy-imported";

function readLegacy<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (parsed?.state ?? null) as T | null;
  } catch {
    return null;
  }
}

function importLegacyLocalStorage(): void {
  try {
    if (localStorage.getItem(LEGACY_DONE_KEY)) return;
  } catch {
    return;
  }
  const study = readLegacy<Partial<ReturnType<typeof useStudyStore.getState>>>(LEGACY_STUDY_KEY);
  const user = readLegacy<Partial<ReturnType<typeof useUserStore.getState>>>(LEGACY_USER_KEY);
  if (!study && !user) return;

  // setState after subscribing, so the diffs above write everything to SQLite.
  if (study) {
    useStudyStore.setState({
      questions: study.questions ?? [],
      srsCards: study.srsCards ?? {},
      watchedVideos: study.watchedVideos ?? [],
    });
  }
  if (user) {
    const { pendingAchievementToasts: _omit, ...rest } = user;
    useUserStore.setState({
      ...rest,
      settings: { ...DEFAULT_SETTINGS, ...(rest.settings ?? {}) },
    });
  }
  console.info("[persistence] imported legacy localStorage data into SQLite");
  try {
    localStorage.setItem(LEGACY_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

// ---- plain-browser fallback (`npx vite` without Tauri): one JSON snapshot ----

const SNAPSHOT_KEY = "comptia-study-snapshot";

function initBrowserFallback(): void {
  console.warn("[persistence] not running in Tauri; using localStorage snapshot");
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (raw) {
      const snap = JSON.parse(raw);
      if (snap.study) useStudyStore.setState(snap.study);
      if (snap.user) {
        useUserStore.setState({
          ...snap.user,
          settings: { ...DEFAULT_SETTINGS, ...(snap.user.settings ?? {}) },
        });
      }
    }
  } catch (err) {
    console.error("[persistence] snapshot load failed", err);
  }
  const save = () => {
    const st = useStudyStore.getState();
    const u = useUserStore.getState();
    const snap = {
      study: { questions: st.questions, srsCards: st.srsCards, watchedVideos: st.watchedVideos },
      user: { ...pickProfile(u), unlockedAchievements: u.unlockedAchievements },
    };
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snap));
    } catch (err) {
      console.error("[persistence] snapshot save failed", err);
    }
  };
  useStudyStore.subscribe(save);
  useUserStore.subscribe(save);
}
