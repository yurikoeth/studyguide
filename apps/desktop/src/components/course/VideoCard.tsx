import { useState } from "react";
import type { Video } from "@comptia-study/shared/types";
import { DOMAINS_220_1201 } from "@comptia-study/shared/data";
import { generateQuestions } from "@comptia-study/shared/ai";
import { useStudyStore } from "../../stores/study-store";
import { useUserStore } from "../../stores/user-store";
import { ArrowRightIcon, CloseIcon, PlayIcon, SparklesIcon } from "../icons";

interface Props {
  video: Video;
}

export function VideoCard({ video }: Props) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchedVideos = useStudyStore((s) => s.watchedVideos);
  const toggleVideoWatched = useStudyStore((s) => s.toggleVideoWatched);
  const addQuestions = useStudyStore((s) => s.addQuestions);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);
  const questions = useStudyStore((s) => s.questions);
  const apiKey = useUserStore((s) => s.settings.apiKey);
  const isWatched = watchedVideos.includes(video.id);
  const questionCount = questions.filter((q) => q.videoId === video.id).length;

  async function handleGenerateForVideo() {
    if (!apiKey) {
      setError("Set your API key in Settings first.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const domain = DOMAINS_220_1201.find((d) => d.id === video.domainId);
      if (!domain) return;
      const objective = domain.objectives.find((o) => o.id === video.objectiveId);
      if (!objective) return;
      const newQuestions = await generateQuestions(apiKey, domain, objective, video, "medium", 5);
      addQuestions(newQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      className={`border-b border-slate-700/50 last:border-0 ${
        isWatched ? "bg-slate-700/20" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Watch toggle */}
        <button
          onClick={() => toggleVideoWatched(video.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
            isWatched
              ? "bg-indigo-600 border-indigo-600 text-accent-fg"
              : "border-slate-500 hover:border-indigo-400"
          }`}
        >
          {isWatched && <span className="text-xs">✓</span>}
        </button>

        {/* Video info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isWatched ? "text-slate-300" : "text-white"}`}>
            {video.title}
          </p>
          <p className="text-xs text-slate-500">
            Objective {video.objectiveId}
            {questionCount > 0 && (
              <span className="ml-2 text-indigo-400">
                {questionCount} question{questionCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
              showEmbed
                ? "bg-indigo-600 text-accent-fg border-indigo-600"
                : "border-white/15 text-slate-200 hover:border-white/40 hover:bg-white/5"
            }`}
          >
            {showEmbed ? <CloseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
            {showEmbed ? "Close" : "Watch"}
          </button>
          {isWatched && (
            <button
              onClick={handleGenerateForVideo}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-white/15 text-slate-200 hover:border-white/40 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              {generating ? "Generating…" : questionCount > 0 ? "More questions" : "Generate questions"}
            </button>
          )}
          {isWatched && questionCount > 0 && (
            <button
              onClick={() => setActiveTab("study")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-600 text-accent-fg hover:bg-indigo-500 transition-colors"
            >
              Study
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Generation error */}
      {error && (
        <div className="px-4 pb-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* YouTube embed */}
      {showEmbed && (
        <div className="px-4 pb-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
