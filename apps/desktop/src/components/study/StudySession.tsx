import { useState } from "react";
import { useStudyStore } from "../../stores/study-store";
import { useUserStore } from "../../stores/user-store";
import { isDue } from "@comptia-study/shared/srs";
import { DOMAINS_220_1201, VIDEOS_220_1201 } from "@comptia-study/shared/data";
import { generateQuestions } from "@comptia-study/shared/ai";
import { QuestionCard } from "./QuestionCard";
import { AnswerFeedback } from "./AnswerFeedback";

export function StudySession() {
  const {
    questions, srsCards, sessionQueue, currentIndex,
    selectedChoice, showAnswer, sessionComplete,
    startSession, addQuestions,
  } = useStudyStore();
  const apiKey = useUserStore((s) => s.settings.apiKey);
  const watchedVideos = useStudyStore((s) => s.watchedVideos);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = sessionQueue[currentIndex];
  const now = Date.now();

  // Find due cards
  const dueCardIds = Object.values(srsCards)
    .filter((c) => isDue(c, now))
    .map((c) => c.questionId);

  const hasQuestions = questions.length > 0;
  const hasDueCards = dueCardIds.length > 0;
  const inSession = sessionQueue.length > 0 && !sessionComplete;

  // Find watched videos that don't have any questions yet
  const videosWithoutQuestions = Array.from(watchedVideos).filter(
    (videoId) => !questions.some((q) => q.videoId === videoId)
  );

  async function handleGenerate() {
    if (!apiKey) {
      setError("Please set your Anthropic API key in Settings first.");
      return;
    }

    const watchedList = Array.from(watchedVideos);
    if (watchedList.length === 0) {
      setError("Mark some videos as watched in the Course tab first.");
      return;
    }

    // Generate for watched videos that don't have questions yet
    const toGenerate = videosWithoutQuestions.length > 0
      ? videosWithoutQuestions
      : watchedList; // If all have questions, regenerate for all

    setGenerating(true);
    setError(null);

    try {
      for (const videoId of toGenerate) {
        const video = VIDEOS_220_1201.find((v) => v.id === videoId);
        if (!video) continue;

        const domain = DOMAINS_220_1201.find((d) => d.id === video.domainId);
        if (!domain) continue;

        const objective = domain.objectives.find((o) => o.id === video.objectiveId);
        if (!objective) continue;

        const newQuestions = await generateQuestions(
          apiKey, domain, objective, video, "medium", 5
        );
        addQuestions(newQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  }

  // Session complete screen
  if (sessionComplete) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
        <p className="text-slate-400 mb-6">
          You reviewed {sessionQueue.length} card{sessionQueue.length !== 1 ? "s" : ""}.
        </p>
        <button
          onClick={() => startSession(dueCardIds)}
          disabled={!hasDueCards}
          className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {hasDueCards ? `Review ${dueCardIds.length} More` : "All Caught Up!"}
        </button>
      </div>
    );
  }

  // Active study
  if (inSession && currentQuestion) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">
            Card {currentIndex + 1} of {sessionQueue.length}
          </span>
          <div className="flex-1 mx-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / sessionQueue.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard question={currentQuestion} />
        {showAnswer && <AnswerFeedback question={currentQuestion} />}
      </div>
    );
  }

  // Start screen
  return (
    <div className="max-w-lg mx-auto text-center py-12 space-y-6">
      <h2 className="text-2xl font-bold">Study Mode</h2>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {hasQuestions && hasDueCards ? (
        <div>
          <p className="text-slate-400 mb-4">
            You have <strong className="text-white">{dueCardIds.length}</strong> cards due for review.
          </p>
          <button
            onClick={() => startSession(dueCardIds)}
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-semibold transition-colors"
          >
            Start Review ({dueCardIds.length} cards)
          </button>
        </div>
      ) : hasQuestions ? (
        <p className="text-slate-400">
          No cards due for review right now. Come back later or generate more questions!
        </p>
      ) : (
        <p className="text-slate-400">
          No questions yet. Generate some to start studying!
        </p>
      )}

      <div className="flex justify-center gap-3">
        {videosWithoutQuestions.length > 0 && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 font-semibold"
          >
            {generating
              ? "Generating..."
              : `Generate for ${videosWithoutQuestions.length} Video${videosWithoutQuestions.length !== 1 ? "s" : ""}`}
          </button>
        )}
        {hasQuestions && videosWithoutQuestions.length === 0 && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {generating ? "Generating..." : "Regenerate All"}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Questions are generated per video using the Claude API. You can also generate from each video in the Course tab.
      </p>
    </div>
  );
}
