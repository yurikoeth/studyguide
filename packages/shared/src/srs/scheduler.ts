import type { SRSCard } from "../types/srs.js";
import { isDue } from "./sm2.js";

export function getDueCards(cards: SRSCard[], now: number): SRSCard[] {
  return cards
    .filter((card) => isDue(card, now))
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

export function getNewCards(cards: SRSCard[], limit: number): SRSCard[] {
  return cards
    .filter((card) => card.repetitions === 0 && card.lastReviewAt === null)
    .slice(0, limit);
}

export function buildStudyQueue(
  allCards: SRSCard[],
  now: number,
  newCardLimit: number
): SRSCard[] {
  const due = getDueCards(allCards, now);
  const newCards = getNewCards(
    allCards.filter((c) => !due.includes(c)),
    newCardLimit
  );
  return [...due, ...newCards];
}
