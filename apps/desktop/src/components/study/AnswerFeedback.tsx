import type { Question, ReviewRating } from "@comptia-study/shared/types";
import { useStudyStore } from "../../stores/study-store";
import { VIDEOS_220_1201 } from "@comptia-study/shared/data";

interface Props {
  question: Question;
}

const RATING_BUTTONS: { rating: ReviewRating; label: string; color: string }[] = [
  { rating: 1, label: "Wrong", color: "bg-red-600 hover:bg-red-500" },
  { rating: 3, label: "Hard", color: "bg-slate-700 hover:bg-slate-600" },
  { rating: 4, label: "Good", color: "bg-green-600 hover:bg-green-500" },
  { rating: 5, label: "Easy", color: "bg-indigo-600 hover:bg-indigo-500 text-accent-fg" },
];

export function AnswerFeedback({ question }: Props) {
  const selectedChoice = useStudyStore((s) => s.selectedChoice);
  const rateAndNext = useStudyStore((s) => s.rateAndNext);
  const wasCorrect = selectedChoice === question.correctChoiceId;
  const video = VIDEOS_220_1201.find((v) => v.id === question.videoId);

  return (
    <div className="mt-4 space-y-4">
      {/* Result banner */}
      <div
        className={`rounded-lg p-4 ${
          wasCorrect
            ? "bg-green-900/30 border border-green-700"
            : "bg-red-900/30 border border-red-700"
        }`}
      >
        <p className="font-bold text-lg">
          {wasCorrect ? "✓ Correct!" : "✗ Incorrect"}
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Explanation</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          {question.explanation}
        </p>
        {video && (
          <p className="mt-3 text-xs text-slate-500">
            📹 Review:{" "}
            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              {video.title} — Professor Messer ({video.objectiveId})
            </a>
          </p>
        )}
      </div>

      {/* Rating buttons */}
      <div>
        <p className="text-sm text-slate-400 mb-2">How well did you know this?</p>
        <div className="grid grid-cols-4 gap-2">
          {RATING_BUTTONS.map(({ rating, label, color }) => (
            <button
              key={rating}
              onClick={() => rateAndNext(rating)}
              className={`py-2 rounded-lg font-medium text-sm transition-colors ${color}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
