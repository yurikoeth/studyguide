import { isTauri } from "./client";
import { insertReview, type ReviewRecord } from "./repo";

/**
 * Appends one review row and bumps today's daily_activity counters.
 * Fire-and-forget: a failure is logged, never thrown into the UI.
 */
export function logReview(r: Omit<ReviewRecord, "id" | "reviewedAt" | "responseTimeMs"> & {
  responseTimeMs?: number;
}): void {
  if (!isTauri) return;
  const record: ReviewRecord = {
    id: crypto.randomUUID(),
    reviewedAt: Date.now(),
    responseTimeMs: r.responseTimeMs ?? 0,
    questionId: r.questionId,
    rating: r.rating,
    selectedChoiceId: r.selectedChoiceId,
    wasCorrect: r.wasCorrect,
    xpEarned: r.xpEarned,
  };
  insertReview(record).catch((err) =>
    console.error("[persistence] review insert failed", err),
  );
}
