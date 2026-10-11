import type { Question } from "@comptia-study/shared/types";
import { useStudyStore } from "../../stores/study-store";

interface Props {
  question: Question;
}

export function QuestionCard({ question }: Props) {
  const selectedChoice = useStudyStore((s) => s.selectedChoice);
  const showAnswer = useStudyStore((s) => s.showAnswer);
  const selectChoice = useStudyStore((s) => s.selectChoice);
  const revealAnswer = useStudyStore((s) => s.revealAnswer);

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
      {/* Difficulty + tags */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            question.difficulty === "easy"
              ? "bg-green-900/50 text-green-400"
              : question.difficulty === "medium"
              ? "bg-amber-900/50 text-amber-400"
              : "bg-red-900/50 text-red-400"
          }`}
        >
          {question.difficulty}
        </span>
        <span className="text-xs text-slate-500">
          Objective {question.objectiveId}
        </span>
      </div>

      {/* Question stem */}
      <p className="text-lg leading-relaxed">{question.stem}</p>

      {/* Choices */}
      <div className="space-y-2">
        {question.choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          const isCorrect = choice.id === question.correctChoiceId;

          let style = "border-slate-600 hover:border-slate-400";
          if (showAnswer) {
            if (isCorrect) style = "border-green-500 bg-green-900/20";
            else if (isSelected && !isCorrect)
              style = "border-red-500 bg-red-900/20";
            else style = "border-slate-700 opacity-50";
          } else if (isSelected) {
            style = "border-indigo-500 bg-indigo-900/20";
          }

          return (
            <button
              key={choice.id}
              onClick={() => !showAnswer && selectChoice(choice.id)}
              disabled={showAnswer}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${style}`}
            >
              <span className="font-bold text-slate-400 mr-2">{choice.id}.</span>
              {choice.text}
              {showAnswer && isCorrect && (
                <span className="ml-2 text-green-400">✓</span>
              )}
              {showAnswer && isSelected && !isCorrect && (
                <span className="ml-2 text-red-400">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      {!showAnswer && (
        <button
          onClick={revealAnswer}
          disabled={!selectedChoice}
          className="w-full py-3 bg-indigo-600 text-accent-fg rounded-lg font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
