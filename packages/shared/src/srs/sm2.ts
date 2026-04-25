import type { SRSCard, ReviewRating } from "../types/srs.js";

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function createCard(questionId: string, now: number): SRSCard {
  return {
    questionId,
    easeFactor: DEFAULT_EASE_FACTOR,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: now,
    lastReviewAt: null,
    lapses: 0,
  };
}

export function reviewCard(
  card: SRSCard,
  rating: ReviewRating,
  now: number
): SRSCard {
  const updated = { ...card, lastReviewAt: now };

  if (rating < 3) {
    // Failed: reset to learning
    updated.repetitions = 0;
    updated.intervalDays = 0;
    updated.lapses = card.lapses + 1;
    // Review again in 10 minutes (stored as fraction of a day)
    updated.nextReviewAt = now + 10 * 60 * 1000;
  } else {
    // Passed: advance interval
    if (card.repetitions === 0) {
      updated.intervalDays = 1;
    } else if (card.repetitions === 1) {
      updated.intervalDays = 6;
    } else {
      updated.intervalDays = Math.round(card.intervalDays * card.easeFactor);
    }
    updated.repetitions = card.repetitions + 1;
    updated.nextReviewAt = now + updated.intervalDays * 24 * 60 * 60 * 1000;
  }

  // Update ease factor based on rating
  updated.easeFactor = Math.max(
    MIN_EASE_FACTOR,
    card.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
  );

  return updated;
}

export function isDue(card: SRSCard, now: number): boolean {
  return card.nextReviewAt <= now;
}
