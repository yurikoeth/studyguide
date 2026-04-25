use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create initial tables",
        sql: r#"
            CREATE TABLE IF NOT EXISTS video_progress (
                video_id    TEXT PRIMARY KEY,
                watched     INTEGER NOT NULL DEFAULT 0,
                watched_at  INTEGER,
                notes       TEXT
            );

            CREATE TABLE IF NOT EXISTS questions (
                id            TEXT PRIMARY KEY,
                video_id      TEXT NOT NULL,
                domain_id     TEXT NOT NULL,
                objective_id  TEXT NOT NULL,
                difficulty    TEXT NOT NULL,
                stem          TEXT NOT NULL,
                choices       TEXT NOT NULL,
                correct_id    TEXT NOT NULL,
                explanation   TEXT NOT NULL,
                tags          TEXT NOT NULL,
                created_at    INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS srs_cards (
                question_id    TEXT PRIMARY KEY,
                ease_factor    REAL NOT NULL DEFAULT 2.5,
                interval_days  REAL NOT NULL DEFAULT 0,
                repetitions    INTEGER NOT NULL DEFAULT 0,
                next_review_at INTEGER NOT NULL,
                last_review_at INTEGER,
                lapses         INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS reviews (
                id               TEXT PRIMARY KEY,
                question_id      TEXT NOT NULL,
                rating           INTEGER NOT NULL,
                selected_choice  TEXT NOT NULL,
                was_correct      INTEGER NOT NULL,
                response_time_ms INTEGER NOT NULL,
                xp_earned        INTEGER NOT NULL DEFAULT 0,
                reviewed_at      INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS daily_activity (
                date            TEXT PRIMARY KEY,
                cards_reviewed  INTEGER NOT NULL DEFAULT 0,
                correct_count   INTEGER NOT NULL DEFAULT 0,
                xp_earned       INTEGER NOT NULL DEFAULT 0,
                time_spent_ms   INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS user_profile (
                id              TEXT PRIMARY KEY DEFAULT 'default',
                display_name    TEXT NOT NULL DEFAULT 'Student',
                total_xp        INTEGER NOT NULL DEFAULT 0,
                level           INTEGER NOT NULL DEFAULT 1,
                current_streak  INTEGER NOT NULL DEFAULT 0,
                longest_streak  INTEGER NOT NULL DEFAULT 0,
                last_study_date TEXT,
                settings        TEXT NOT NULL DEFAULT '{}',
                created_at      INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS achievements (
                id          TEXT PRIMARY KEY,
                unlocked_at INTEGER NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_srs_next_review ON srs_cards(next_review_at);
            CREATE INDEX IF NOT EXISTS idx_reviews_question ON reviews(question_id);
            CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain_id);
            CREATE INDEX IF NOT EXISTS idx_questions_video ON questions(video_id);
        "#,
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:comptia-study.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
