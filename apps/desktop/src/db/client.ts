import type Database from "@tauri-apps/plugin-sql";

/** Must match the key used for migrations in src-tauri/src/lib.rs. */
export const DB_URL = "sqlite:comptia-study.db";

/** True when running inside the Tauri shell (false under plain `vite` in a browser). */
export const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

let dbPromise: Promise<Database> | null = null;

/** Opens (and migrates) the SQLite database once; later calls share the handle. */
export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = import("@tauri-apps/plugin-sql").then((m) => m.default.load(DB_URL));
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}
