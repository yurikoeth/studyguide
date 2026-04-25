import { useState } from "react";
import type { Domain, Video } from "@comptia-study/shared/types";
import { useStudyStore } from "../../stores/study-store";
import { VideoCard } from "./VideoCard";

interface Props {
  domain: Domain;
  videos: Video[];
}

export function DomainSection({ domain, videos }: Props) {
  const [expanded, setExpanded] = useState(true);
  const watchedVideos = useStudyStore((s) => s.watchedVideos);
  const watchedCount = videos.filter((v) => watchedVideos.includes(v.id)).length;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-400">
            {domain.number}
          </span>
          <div className="text-left">
            <h3 className="font-semibold">{domain.name}</h3>
            <p className="text-xs text-slate-400">
              {domain.percentage}% of exam · {watchedCount}/{videos.length} videos
            </p>
          </div>
        </div>
        <span className="text-slate-400 text-xl">
          {expanded ? "▾" : "▸"}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-700">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
