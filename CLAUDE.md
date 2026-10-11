# StudyGuide (CompTIA A+ study app)

Gamified study app for CompTIA A+ certification, built around Professor Messer's 220-1201 (Core 1) training course.

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Desktop**: Tauri v2 (Rust backend + React 19 + Vite frontend). This is the only app; the former `apps/web` copy was removed 2026-10-10.
- **Shared**: TypeScript library with types, SM-2 algorithm, gamification logic, AI generation
- **State**: Zustand
- **Styling**: Tailwind CSS v4. Monochrome theme (black surfaces, white accents): `src/index.css` remaps the slate/indigo/amber palettes in `@theme`, so components keep their original utility classes. Green/red are reserved for correct/wrong feedback. Icons come from `lucide-react`, re-exported by name in `src/components/icons.tsx`; no emoji. Font is Inter Variable bundled via `@fontsource-variable/inter` (imported in main.tsx).
- **Study plan + reminders**: pacing math in `packages/shared/src/plan/` (computePlan, isReminderDue; 11 tests). Settings > Study Plan: finish-by-date or videos-per-week, shows needed pace / expected-by-today / ahead-behind / today's goal; Dashboard shows a PlanCard. Reminders: `src/components/ReminderAgent.tsx` ticks every 60s and sends a Windows toast via tauri-plugin-notification when `isReminderDue` (daily at HH:MM or every N hours); `lastReminderAt` lives in settings. Reminders only fire while the app runs, so Rust adds a tray icon (Open/Quit) and a `set_background_mode` command: when on, closing the main window hides it to the tray instead of quitting.
- **Appearance settings**: background colour, accent colour + wallpaper (dim/blur) in Settings. The whole gray scale is derived in CSS from `--bg`/`--fg` via color-mix (slate-*, white, black tokens), so light backgrounds work too; an accent with contrast < 1.8 against the background falls back to `--fg`. `src/theme.ts` writes `--accent`, `--accent-fg`, `--wallpaper-*` CSS vars and toggles `.has-wallpaper`; `AppearanceLayer` renders the wallpaper div. The wallpaper is a JPEG data URL (resized to <=2560px, <=6 MB) kept in the `appearance` table (migration 3) via `appearance-store.ts`. New `UserSettings` keys are merged with `DEFAULT_SETTINGS` on load so old profiles keep working.
- **DB**: SQLite via tauri-plugin-sql. Stores are hydrated from it before first render and every change is written through (see `apps/desktop/src/db/`)
- **AI**: `@anthropic-ai/sdk` → Claude Sonnet for question generation
- **Testing**: Vitest

## Project Layout

```
comptia-study/
├── packages/shared/src/
│   ├── types/              # Question, SRSCard, UserStats, Achievement, Course types
│   ├── srs/                # SM-2 algorithm (sm2.ts) + scheduler (scheduler.ts)
│   ├── plan/               # study-plan pacing + reminder due-check (plan.ts)
│   ├── gamification/       # XP (xp.ts), streaks (streaks.ts), achievements (achievements.ts)
│   ├── ai/                 # Prompt builders, Claude API wrapper, Zod response parser
│   ├── data/               # Professor Messer 220-1201 course data (62 videos, 5 domains)
│   └── __tests__/          # 43 passing tests for SM-2, XP, streaks, achievements, parsing
├── apps/desktop/
│   ├── src-tauri/src/      # Rust: lib.rs (Tauri setup + SQLite migrations)
│   └── src/
│       ├── App.tsx          # Tab-based nav: Course, Study, Stats, Badges, Settings
│       ├── components/
│       │   ├── course/      # CourseOverview, DomainSection, VideoCard
│       │   ├── study/       # StudySession, QuestionCard, AnswerFeedback
│       │   ├── dashboard/   # Dashboard, XPBar, StreakDisplay, DomainProgress
│       │   ├── achievements/# AchievementList, AchievementToast
│       │   └── settings/    # Settings (API key, daily goal, preferences)
│       └── stores/          # Zustand: study-store.ts, user-store.ts
```

## Commands

```bash
pnpm install                 # Install all dependencies
pnpm run test                # Run all tests (vitest, from root)

# Shared package (from packages/shared/)
pnpm run test                # 54 tests: SM-2, XP, streaks, achievements, AI parsing

# Desktop
pnpm run dev                 # from root: Tauri dev window (Vite on http://localhost:3000)
pnpm run build:app           # from root: release exe + NSIS installer
# Release: git tag vX.Y.Z && git push --tags  -> .github/workflows/release.yml publishes the installer
# or from apps/desktop/: npx vite (browser only), npx tauri dev, npx tauri build
# Outputs: apps/desktop/src-tauri/target/release/comptia-study.exe
#          apps/desktop/src-tauri/target/release/bundle/nsis/*.exe
```

## Current Status

**What's built (Phase 1 MVP):**
- All shared logic: types, SM-2 spaced repetition, XP/levels (30 levels), streaks, 30 achievements
- Professor Messer 220-1201 course data: all 62 videos mapped to 5 domains and objectives
- AI question generation via Claude Sonnet with Zod validation
- Full React UI: course overview, study session with SRS, dashboard, achievements, settings
- Zustand stores wiring everything together
- SQLite schema in Rust backend (7 tables with migrations)
- 54 passing unit tests

**Desktop packaging (2026-10-10):** icons generated from `src-tauri/app-icon.svg` via `npx tauri icon`;
`tauri.conf.json` devUrl fixed to port 3000 (matches vite.config.ts); bundle target is NSIS only
(per-user install). Rust target dir lives on F: so C: disk space is no longer the blocker.

**Persistence (2026-10-10):** wired to SQLite. `main.tsx` renders a Boot gate that awaits
`initPersistence()` (loads questions, srs_cards, video_progress, user_profile, achievements into the
stores), then subscribes to both stores and diffs slices by reference to write only what changed,
through one serialized promise queue. `rateAndNext` also appends a `reviews` row and bumps
`daily_activity`. Migration 2 (lib.rs) added the gamification counters to `user_profile`.
First run with an empty DB imports any data left by the old zustand/persist localStorage keys.
Under plain `vite` (no Tauri) it falls back to a single localStorage JSON snapshot.
The DB lives at `%APPDATA%\com.studyguide.app\comptia-study.db` (WAL mode). Product name is StudyGuide (renamed 2026-10-11); the exe is StudyGuide.exe, installed per-user under %LOCALAPPDATA%/StudyGuide.
GOTCHA: `sql:default` grants load/select only; `sql:allow-execute` in capabilities/default.json is
required for writes, otherwise every write fails silently in the console.

**Next steps:**
1. Test the full flow in the desktop window: generate questions → study with SRS → check reviews table
2. Phase 2: quick quiz mode, dashboard charts (daily_activity now has data), streak polish

## Architecture Notes

### Data Flow: Study Session
```
User marks video watched in CourseOverview
  → toggleVideoWatched() in study-store
  → Navigate to Study tab → "Generate Questions" button
  → generateQuestions() calls Claude Sonnet API with domain/objective context
  → Questions stored in study-store, SRS cards created via createCard()
  → startSession() builds queue from due cards
  → QuestionCard renders question → user selects choice → revealAnswer()
  → AnswerFeedback shows explanation + Professor Messer video link
  → User rates (Wrong/Hard/Good/Easy) → rateAndNext()
  → SM-2 reviewCard() updates ease factor, interval, next review date
  → XP awarded via calculateXP() with streak multiplier
```

### Key Design Decisions
- **SM-2 algorithm**: Simple, proven spaced repetition. Ease factor >= 1.3, intervals: 1d → 6d → scaled
- **Professor Messer course as backbone**: Videos are "lessons", questions map to specific videos
- **API key stored locally**: User provides their own Anthropic key in Settings
- **Subpath exports**: `@comptia-study/shared/types`, `/srs`, `/gamification`, `/ai`, `/data`
- **No React Router**: Tab-based navigation via Zustand state enum
