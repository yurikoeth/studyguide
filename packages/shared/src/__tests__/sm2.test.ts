import { describe, it, expect } from "vitest";
import { createCard, reviewCard, isDue } from "../srs/sm2.js";

describe("SM-2 Algorithm", () => {
  const NOW = 1700000000000;

  it("creates a card with default values", () => {
    const card = createCard("q1", NOW);
    expect(card.easeFactor).toBe(2.5);
    expect(card.intervalDays).toBe(0);
    expect(card.repetitions).toBe(0);
    expect(card.nextReviewAt).toBe(NOW);
    expect(card.lapses).toBe(0);
  });

  it("new card is immediately due", () => {
    const card = createCard("q1", NOW);
    expect(isDue(card, NOW)).toBe(true);
  });

  it("rating 5 (easy) increases interval: 0 -> 1 -> 6 -> scaled", () => {
    let card = createCard("q1", NOW);

    // First review: interval becomes 1 day
    card = reviewCard(card, 5, NOW);
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(1);

    // Second review: interval becomes 6 days
    card = reviewCard(card, 5, NOW + 86400000);
    expect(card.intervalDays).toBe(6);
    expect(card.repetitions).toBe(2);

    // Third review: interval scales by ease factor
    card = reviewCard(card, 5, NOW + 7 * 86400000);
    expect(card.intervalDays).toBeGreaterThan(6);
    expect(card.repetitions).toBe(3);
  });

  it("rating 0-2 (fail) resets repetitions and schedules soon", () => {
    let card = createCard("q1", NOW);
    card = reviewCard(card, 5, NOW); // pass once
    card = reviewCard(card, 5, NOW + 86400000); // pass twice

    expect(card.repetitions).toBe(2);

    // Fail
    card = reviewCard(card, 1, NOW + 7 * 86400000);
    expect(card.repetitions).toBe(0);
    expect(card.intervalDays).toBe(0);
    expect(card.lapses).toBe(1);
    // Next review should be ~10 minutes later
    expect(card.nextReviewAt - (NOW + 7 * 86400000)).toBe(10 * 60 * 1000);
  });

  it("ease factor never drops below 1.3", () => {
    let card = createCard("q1", NOW);
    // Repeatedly fail
    for (let i = 0; i < 20; i++) {
      card = reviewCard(card, 0, NOW + i * 60000);
    }
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("rating 5 increases ease factor", () => {
    const card = createCard("q1", NOW);
    const updated = reviewCard(card, 5, NOW);
    expect(updated.easeFactor).toBeGreaterThan(2.5);
  });

  it("rating 3 decreases ease factor slightly", () => {
    const card = createCard("q1", NOW);
    const updated = reviewCard(card, 3, NOW);
    expect(updated.easeFactor).toBeLessThan(2.5);
  });

  it("card is not due before next review time", () => {
    let card = createCard("q1", NOW);
    card = reviewCard(card, 4, NOW);
    // 1 day interval, so not due at NOW + 12 hours
    expect(isDue(card, NOW + 12 * 60 * 60 * 1000)).toBe(false);
    // Due at NOW + 25 hours
    expect(isDue(card, NOW + 25 * 60 * 60 * 1000)).toBe(true);
  });
});
