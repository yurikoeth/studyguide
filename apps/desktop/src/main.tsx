import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initPersistence } from "./db/persistence";
import "@fontsource-variable/inter";
import "./index.css";

type BootState = { phase: "loading" } | { phase: "ready" } | { phase: "error"; message: string };

function Boot() {
  const [state, setState] = useState<BootState>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;
    initPersistence()
      .then(() => !cancelled && setState({ phase: "ready" }))
      .catch((err: unknown) => {
        console.error("[persistence] init failed", err);
        if (!cancelled) {
          setState({
            phase: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.phase === "ready") return <App />;

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-200">
      {state.phase === "loading" ? (
        <p className="text-sm text-slate-400">Loading your progress…</p>
      ) : (
        <div className="max-w-md space-y-3 rounded-lg border border-red-500/40 bg-slate-800 p-6">
          <h1 className="text-lg font-semibold text-red-400">Could not open the database</h1>
          <p className="text-sm text-slate-300">
            Your progress cannot be loaded or saved until this is fixed.
          </p>
          <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-red-300">{state.message}</pre>
          <button
            onClick={() => setState({ phase: "ready" })}
            className="rounded bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
          >
            Continue without saving
          </button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Boot />
  </React.StrictMode>
);
