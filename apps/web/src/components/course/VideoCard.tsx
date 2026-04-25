import { useState } from "react";
import type { Video } from "@comptia-study/shared/types";
import { useStudyStore } from "../../stores/study-store";

interface Props {
  video: Video;
}

export function VideoCard({ video }: Props) {
  const [showEmbed, setShowEmbed] = useState(false);
  const watchedVideos = useStudyStore((s) => s.watchedVideos);
  const toggleVideoWatched = useStudyStore((s) => s.toggleVideoWatched);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);
  const questions = useStudyStore((s) => s.questions);
  const isWatched = watchedVideos.includes(video.id);
  const questionCount = questions.filter((q) => q.videoId === video.id).length;

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
              ? "bg-green-500 border-green-500 text-white"
              : "border-slate-500 hover:border-green-400"
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
            className={`text-xs px-2 py-1 rounded transition-colors ${
              showEmbed
                ? "bg-red-600/40 text-red-300"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
            }`}
          >
            {showEmbed ? "✕ Close" : "▶ Watch"}
          </button>
          {isWatched && (
            <button
              onClick={() => setActiveTab("study")}
              className="text-xs px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded hover:bg-indigo-600/30 transition-colors"
            >
              Study
            </button>
          )}
        </div>
      </div>

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
