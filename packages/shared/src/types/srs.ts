export interface SRSCard {
  questionId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: number;
  lastReviewAt: number | null;
  lapses: number;
}

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  questionId: string;
  rating: ReviewRating;
  answeredAt: number;
  responseTimeMs: number;
  selectedChoiceId: string;
  wasCorrect: boolean;
}
