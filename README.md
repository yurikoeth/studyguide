# StudyGuide

A simple, slightly gamified desktop app for studying toward your IT certifications. Watch the course, let the app quiz you on what you just learned, and keep coming back until it sticks. Levels, streaks, and badges keep it from feeling like homework.

Right now it covers **CompTIA A+ Core 1 (220-1201)** using Professor Messer's free video course as the backbone.

## What it does

- **Follow the course.** All 62 videos, grouped by exam domain and objective. Tick them off as you watch and see your progress fill in.
- **Get quizzed on what you watched.** Mark a video done and generate multiple-choice questions for it, written by Claude from that video's objective. Every answer comes with an explanation.
- **Remember it with spaced repetition.** Questions become flashcards scheduled with the SM-2 algorithm. Rate each answer Wrong, Hard, Good, or Easy and the app decides when you see it again.
- **Earn XP and level up.** Correct answers award XP, harder questions pay more, and streaks multiply it. Thirty levels from Novice to the top.
- **Keep a streak.** Study on consecutive days to build it. Miss a day and it resets.
- **Unlock badges.** Thirty achievements for milestones like your first hundred cards, a long streak, or mastering a whole domain.
- **Set a pace and get reminded.** Pick a target date or a videos-per-week pace. The app shows the math: videos left, how many per day, whether you are ahead or behind, and today's goal. Optional Windows notifications nudge you daily or every few hours, and the app can sit in the tray so they keep firing.
- **Make it yours.** Accent color, background color, or a wallpaper with dim and blur controls.

Everything is stored locally in a SQLite database. Nothing is uploaded except the question-generation requests you send to the Anthropic API with your own key.

## Getting started

**Requirements:** Windows 10 or 11, and an [Anthropic API key](https://console.anthropic.com) if you want generated questions. Everything else works without one.

1. Install the latest `StudyGuide_x64-setup.exe` (per-user install, no admin prompt), or build it yourself as below.
2. Open Settings and paste your API key.
3. On the Course tab, mark a video watched and press **Generate questions**.
4. Go to the Study tab and start reviewing.

Optional: set a study plan and turn on reminders in Settings.

## Building from source

```powershell
pnpm install
pnpm run test          # shared logic: SRS, XP, streaks, achievements, plan math
pnpm run dev           # Tauri dev window with hot reload
pnpm run build:app     # release exe + NSIS installer
```

Outputs land in `apps/desktop/src-tauri/target/release/` (exe) and `.../bundle/nsis/` (installer). You need Node 20+, pnpm 9, and a Rust toolchain.

## How it is put together

| Piece | Where | Notes |
| --- | --- | --- |
| Desktop app | `apps/desktop` | Tauri 2 shell, React 19 + Vite frontend, Tailwind v4 |
| Shared logic | `packages/shared` | Types, SM-2 scheduler, XP and levels, streaks, achievements, study-plan math, Claude question generation. Fully unit tested |
| Course data | `packages/shared/src/data` | Professor Messer 220-1201 videos mapped to domains and objectives |
| Storage | `apps/desktop/src/db` | SQLite via `tauri-plugin-sql`; stores are hydrated at launch and every change is written through |
| Native bits | `apps/desktop/src-tauri` | Database migrations, tray icon, close-to-tray, notifications |

State lives in Zustand stores. There is no server and no account.

## Roadmap

- Core 2 (220-1202) course data
- Quick quiz mode outside the spaced-repetition queue
- Charts on the dashboard from daily activity
- Other certifications once the A+ flow is solid

## Credits

Course structure follows [Professor Messer's](https://www.professormesser.com/) free CompTIA A+ training. This project is not affiliated with Professor Messer or CompTIA.
