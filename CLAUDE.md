# CompTIA A+ Study App

Gamified study app for CompTIA A+ certification, built around Professor Messer's 220-1201 (Core 1) training course.

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Desktop**: Tauri v2 (Rust backend + React 19 frontend)
- **Web**: React 19 + Vite (not yet created)
- **Shared**: TypeScript library with types, SM-2 algorithm, gamification logic, AI generation
- **State**: Zustand
- **Styling**: Tailwind CSS v4
- **DB**: SQLite (desktop via tauri-plugin-sql), not yet wired to frontend
- **AI**: `@anthropic-ai/sdk` → Claude Sonnet for question generation
- **Testing**: Vitest

## Project Layout

```
comptia-study/
├── packages/shared/src/
│   ├── types/              # Question, SRSCard, UserStats, Achievement, Course types
│   ├── srs/                # SM-2 algorithm (sm2.ts) + scheduler (scheduler.ts)
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
└── apps/web/               # Scaffold only, not yet implemented
```

## Commands

```bash
pnpm install                 # Install all dependencies
pnpm run test                # Run all tests (vitest, from root)

# Shared package (from packages/shared/)
pnpm run test                # 43 tests: SM-2, XP, streaks, achievements, AI parsing

# Desktop (from apps/desktop/)
npx vite                     # Run frontend in browser at http://localhost:1420
npx tauri dev                # Run as Tauri desktop app (requires disk space for Rust build)
```

## Current Status

**What's built (Phase 1 MVP):**
- All shared logic: types, SM-2 spaced repetition, XP/levels (30 levels), streaks, 30 achievements
- Professor Messer 220-1201 course data: all 62 videos mapped to 5 domains and objectives
- AI question generation via Claude Sonnet with Zod validation
- Full React UI: course overview, study session with SRS, dashboard, achievements, settings
- Zustand stores wiring everything together
- SQLite schema in Rust backend (7 tables with migrations)
- 43 passing unit tests

**What's NOT working yet:**
1. **No data persistence** — Zustand stores are in-memory only. Page refresh loses everything.
   - Option A: Wire Zustand stores to SQLite via tauri-plugin-sql (requires Tauri running)
   - Option B: Add Zustand `persist` middleware with localStorage (works in browser)
2. **Tauri build failed** — ran out of disk space during Rust compilation (~2-3 GB needed for debug build). Need to free space on C: drive, then `rm -rf apps/desktop/src-tauri/target` and retry `npx tauri dev`.
3. **No git repo yet** — project has not been committed.

**Next steps (pick up here):**
1. Resolve disk space issue OR add localStorage persistence as interim solution
2. Get the app running (either Tauri or browser)
3. Test the full flow: mark videos watched → generate questions → study with SRS
4. Initialize git repo and commit
5. Phase 2: streak tracking polish, achievement toast integration, quick quiz mode, dashboard charts

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
