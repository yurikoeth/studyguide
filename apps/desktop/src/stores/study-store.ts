import { create } from "zustand";
import type { Question, SRSCard, ReviewRating } from "@comptia-study/shared/types";
import { createCard, reviewCard } from "@comptia-study/shared/srs";
import { calculateXP } from "@comptia-study/shared/gamification";
import { useUserStore } from "./user-store";
import { logReview } from "../db/reviews";

type Tab = "course" | "study" | "quiz" | "dashboard" | "achievements" | "settings";

interface SRSCardMap {
  [questionId: string]: SRSCard;
}

interface StudyState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  // Question bank (persisted to SQLite via src/db/persistence.ts)
  questions: Question[];
  srsCards: SRSCardMap;
  addQuestions: (questions: Question[]) => void;

  // Study session (not persisted — ephemeral)
  sessionQueue: Question[];
  currentIndex: number;
  selectedChoice: string | null;
  showAnswer: boolean;
  sessionComplete: boolean;

  startSession: (dueQuestionIds: string[]) => void;
  selectChoice: (choiceId: string) => void;
  revealAnswer: () => void;
  rateAndNext: (rating: ReviewRating) => void;
  retryCurrentCard: () => void;

  // Video progress (persisted to SQLite)
  watchedVideos: string[];
  toggleVideoWatched: (videoId: string) => void;
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  activeTab: "course",
  setActiveTab: (tab) => set({ activeTab: tab }),

  questions: [],
  srsCards: {},
  addQuestions: (newQuestions) =>
    set((state) => {
      const now = Date.now();
      const newCards = { ...state.srsCards };
      for (const q of newQuestions) {
        if (!newCards[q.id]) {
          newCards[q.id] = createCard(q.id, now);
        }
      }
      return {
        questions: [...state.questions, ...newQuestions],
        srsCards: newCards,
      };
    }),

  sessionQueue: [],
  currentIndex: 0,
  selectedChoice: null,
  showAnswer: false,
  sessionComplete: false,

  startSession: (dueQuestionIds) => {
    const { questions } = get();
    const queue = dueQuestionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined);
    set({
      sessionQueue: queue,
      currentIndex: 0,
      selectedChoice: null,
      showAnswer: false,
      sessionComplete: false,
    });
  },

  selectChoice: (choiceId) => set({ selectedChoice: choiceId }),

  revealAnswer: () => set({ showAnswer: true }),

  retryCurrentCard: () =>
    set({ selectedChoice: null, showAnswer: false }),

  rateAndNext: (rating) => {
    const { sessionQueue, currentIndex, selectedChoice, srsCards } = get();
    const question = sessionQueue[currentIndex];
    if (!question || !selectedChoice) return;

    const now = Date.now();
    const card = srsCards[question.id];
    if (!card) return;

    const wasCorrect = selectedChoice === question.correctChoiceId;
    const updatedCard = reviewCard(card, rating, now);

    // Calculate and award XP
    const userStore = useUserStore.getState();
    const xp = calculateXP(question.difficulty, userStore.currentStreak, wasCorrect);
    if (xp > 0) userStore.addXP(xp);
    userStore.recordAnswer(question.domainId, wasCorrect);
    userStore.recordStudyDay();
    logReview({
      questionId: question.id,
      rating,
      selectedChoiceId: selectedChoice,
      wasCorrect,
      xpEarned: xp,
    });

    const newCards = { ...srsCards, [question.id]: updatedCard };
    const nextIndex = currentIndex + 1;
    const isComplete = nextIndex >= sessionQueue.length;

    set({
      srsCards: newCards,
      currentIndex: nextIndex,
      selectedChoice: null,
      showAnswer: false,
      sessionComplete: isComplete,
    });
  },

  watchedVideos: [],
  toggleVideoWatched: (videoId) =>
    set((state) => {
      const has = state.watchedVideos.includes(videoId);
      if (has) {
        return { watchedVideos: state.watchedVideos.filter((id) => id !== videoId) };
      } else {
        useUserStore.getState().markVideoWatched();
        return { watchedVideos: [...state.watchedVideos, videoId] };
      }
    }),
}));
