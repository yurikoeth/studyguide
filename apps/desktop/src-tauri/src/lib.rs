use std::sync::atomic::{AtomicBool, Ordering};

use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, WindowEvent};
use tauri_plugin_sql::{Migration, MigrationKind};

/// When true, closing the main window hides it to the tray instead of quitting,
/// so reminder notifications keep firing. Toggled from the frontend settings.
static BACKGROUND_MODE: AtomicBool = AtomicBool::new(false);

#[tauri::command]
fn set_background_mode(enabled: bool) {
    BACKGROUND_MODE.store(enabled, Ordering::Relaxed);
}

fn show_main(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
    Migration {
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
    },
    Migration {
        version: 2,
        description: "extend user_profile with gamification counters",
        sql: r#"
            ALTER TABLE user_profile ADD COLUMN level_title TEXT NOT NULL DEFAULT 'Novice';
            ALTER TABLE user_profile ADD COLUMN total_cards_reviewed INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE user_profile ADD COLUMN total_correct INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE user_profile ADD COLUMN perfect_quizzes INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE user_profile ADD COLUMN videos_watched INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE user_profile ADD COLUMN domain_correct_counts TEXT NOT NULL DEFAULT '{}';
        "#,
        kind: MigrationKind::Up,
    },
    Migration {
        version: 3,
        description: "appearance key/value store (wallpaper blob)",
        sql: r#"
            CREATE TABLE IF NOT EXISTS appearance (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
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
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![set_background_mode])
        .setup(|app| {
            let open = MenuItem::with_id(app, "open", "Open StudyGuide", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open, &quit])?;
            TrayIconBuilder::new()
                .icon(app.default_window_icon().cloned().expect("window icon"))
                .tooltip("StudyGuide")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => show_main(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main(tray.app_handle());
                    }
                })
                .build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" && BACKGROUND_MODE.load(Ordering::Relaxed) {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
