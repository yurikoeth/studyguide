import type {
  DifficultyLevel,
  Question,
  SRSCard,
  UserSettings,
} from "@comptia-study/shared/types";
import { getDb } from "./client";

// ---------- questions ----------

interface QuestionRow {
  id: string;
  video_id: string;
  domain_id: string;
  objective_id: string;
  difficulty: string;
  stem: string;
  choices: string;
  correct_id: string;
  explanation: string;
  tags: string;
  created_at: number;
}

export async function loadQuestions(): Promise<Question[]> {
  const db = await getDb();
  const rows = await db.select<QuestionRow[]>(
    "SELECT * FROM questions ORDER BY created_at, id",
  );
  return rows.map((r) => ({
    id: r.id,
    videoId: r.video_id,
    domainId: r.domain_id,
    objectiveId: r.objective_id,
    difficulty: r.difficulty as DifficultyLevel,
    stem: r.stem,
    choices: JSON.parse(r.choices),
    correctChoiceId: r.correct_id,
    explanation: r.explanation,
    tags: JSON.parse(r.tags),
    createdAt: r.created_at,
  }));
}

export async function insertQuestions(questions: Question[]): Promise<void> {
  if (questions.length === 0) return;
  const db = await getDb();
  for (const q of questions) {
    await db.execute(
      `INSERT OR IGNORE INTO questions
         (id, video_id, domain_id, objective_id, difficulty, stem, choices,
          correct_id, explanation, tags, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        q.id,
        q.videoId,
        q.domainId,
        q.objectiveId,
        q.difficulty,
        q.stem,
        JSON.stringify(q.choices),
        q.correctChoiceId,
        q.explanation,
        JSON.stringify(q.tags),
        q.createdAt,
      ],
    );
  }
}

// ---------- srs cards ----------

interface CardRow {
  question_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: number;
  last_review_at: number | null;
  lapses: number;
}

export async function loadCards(): Promise<Record<string, SRSCard>> {
  const db = await getDb();
  const rows = await db.select<CardRow[]>("SELECT * FROM srs_cards");
  const out: Record<string, SRSCard> = {};
  for (const r of rows) {
    out[r.question_id] = {
      questionId: r.question_id,
      easeFactor: r.ease_factor,
      intervalDays: r.interval_days,
      repetitions: r.repetitions,
      nextReviewAt: r.next_review_at,
      lastReviewAt: r.last_review_at,
      lapses: r.lapses,
    };
  }
  return out;
}

export async function upsertCard(c: SRSCard): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO srs_cards
       (question_id, ease_factor, interval_days, repetitions, next_review_at, last_review_at, lapses)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT(question_id) DO UPDATE SET
       ease_factor = excluded.ease_factor,
       interval_days = excluded.interval_days,
       repetitions = excluded.repetitions,
       next_review_at = excluded.next_review_at,
       last_review_at = excluded.last_review_at,
       lapses = excluded.lapses`,
    [
      c.questionId,
      c.easeFactor,
      c.intervalDays,
      c.repetitions,
      c.nextReviewAt,
      c.lastReviewAt,
      c.lapses,
    ],
  );
}

// ---------- video progress ----------

export async function loadWatchedVideos(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.select<Array<{ video_id: string }>>(
    "SELECT video_id FROM video_progress WHERE watched = 1 ORDER BY watched_at",
  );
  return rows.map((r) => r.video_id);
}

export async function setVideoWatched(
  videoId: string,
  watched: boolean,
  at: number,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO video_progress (video_id, watched, watched_at)
     VALUES ($1, $2, $3)
     ON CONFLICT(video_id) DO UPDATE SET
       watched = excluded.watched,
       watched_at = excluded.watched_at`,
    [videoId, watched ? 1 : 0, watched ? at : null],
  );
}

// ---------- achievements ----------

export async function loadAchievements(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.select<Array<{ id: string }>>(
    "SELECT id FROM achievements ORDER BY unlocked_at",
  );
  return rows.map((r) => r.id);
}

export async function insertAchievements(ids: string[], at: number): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDb();
  for (const id of ids) {
    await db.execute(
      "INSERT OR IGNORE INTO achievements (id, unlocked_at) VALUES ($1, $2)",
      [id, at],
    );
  }
}

// ---------- reviews + daily activity ----------

export interface ReviewRecord {
  id: string;
  questionId: string;
  rating: number;
  selectedChoiceId: string;
  wasCorrect: boolean;
  responseTimeMs: number;
  xpEarned: number;
  reviewedAt: number;
}

export async function insertReview(r: ReviewRecord): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO reviews
       (id, question_id, rating, selected_choice, was_correct, response_time_ms, xp_earned, reviewed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      r.id,
      r.questionId,
      r.rating,
      r.selectedChoiceId,
      r.wasCorrect ? 1 : 0,
      r.responseTimeMs,
      r.xpEarned,
      r.reviewedAt,
    ],
  );
  await db.execute(
    `INSERT INTO daily_activity (date, cards_reviewed, correct_count, xp_earned, time_spent_ms)
     VALUES ($1, 1, $2, $3, $4)
     ON CONFLICT(date) DO UPDATE SET
       cards_reviewed = cards_reviewed + 1,
       correct_count = correct_count + excluded.correct_count,
       xp_earned = xp_earned + excluded.xp_earned,
       time_spent_ms = time_spent_ms + excluded.time_spent_ms`,
    [localDateKey(r.reviewedAt), r.wasCorrect ? 1 : 0, r.xpEarned, r.responseTimeMs],
  );
}

export function localDateKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// ---------- profile ----------

export interface Profile {
  displayName: string;
  totalXP: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalCardsReviewed: number;
  totalCorrect: number;
  perfectQuizzes: number;
  videosWatched: number;
  domainCorrectCounts: Record<string, number>;
  settings: UserSettings;
}

interface ProfileRow {
  display_name: string;
  total_xp: number;
  level: number;
  level_title: string;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  total_cards_reviewed: number;
  total_correct: number;
  perfect_quizzes: number;
  videos_watched: number;
  domain_correct_counts: string;
  settings: string;
}

export async function loadProfile(): Promise<Profile | null> {
  const db = await getDb();
  const rows = await db.select<ProfileRow[]>(
    "SELECT * FROM user_profile WHERE id = 'default'",
  );
  const r = rows[0];
  if (!r) return null;
  return {
    displayName: r.display_name,
    totalXP: r.total_xp,
    level: r.level,
    levelTitle: r.level_title,
    currentStreak: r.current_streak,
    longestStreak: r.longest_streak,
    lastStudyDate: r.last_study_date,
    totalCardsReviewed: r.total_cards_reviewed,
    totalCorrect: r.total_correct,
    perfectQuizzes: r.perfect_quizzes,
    videosWatched: r.videos_watched,
    domainCorrectCounts: JSON.parse(r.domain_correct_counts),
    settings: JSON.parse(r.settings),
  };
}

export async function upsertProfile(p: Profile, now: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO user_profile
       (id, display_name, total_xp, level, level_title, current_streak, longest_streak,
        last_study_date, total_cards_reviewed, total_correct, perfect_quizzes,
        videos_watched, domain_correct_counts, settings, created_at)
     VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT(id) DO UPDATE SET
       display_name = excluded.display_name,
       total_xp = excluded.total_xp,
       level = excluded.level,
       level_title = excluded.level_title,
       current_streak = excluded.current_streak,
       longest_streak = excluded.longest_streak,
       last_study_date = excluded.last_study_date,
       total_cards_reviewed = excluded.total_cards_reviewed,
       total_correct = excluded.total_correct,
       perfect_quizzes = excluded.perfect_quizzes,
       videos_watched = excluded.videos_watched,
       domain_correct_counts = excluded.domain_correct_counts,
       settings = excluded.settings`,
    [
      p.displayName,
      p.totalXP,
      p.level,
      p.levelTitle,
      p.currentStreak,
      p.longestStreak,
      p.lastStudyDate,
      p.totalCardsReviewed,
      p.totalCorrect,
      p.perfectQuizzes,
      p.videosWatched,
      JSON.stringify(p.domainCorrectCounts),
      JSON.stringify(p.settings),
      now,
    ],
  );
}

// ---------- appearance (key/value, holds the wallpaper data URL) ----------

export async function loadWallpaper(): Promise<string | null> {
  const db = await getDb();
  const rows = await db.select<Array<{ value: string }>>(
    "SELECT value FROM appearance WHERE key = 'wallpaper'",
  );
  return rows[0]?.value ?? null;
}

export async function saveWallpaper(dataUrl: string | null): Promise<void> {
  const db = await getDb();
  if (dataUrl === null) {
    await db.execute("DELETE FROM appearance WHERE key = 'wallpaper'");
    return;
  }
  await db.execute(
    `INSERT INTO appearance (key, value) VALUES ('wallpaper', $1)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [dataUrl],
  );
}
