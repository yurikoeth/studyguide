import { DOMAINS_220_1201, VIDEOS_220_1201, TOTAL_VIDEOS } from "@comptia-study/shared/data";
import { useStudyStore } from "../../stores/study-store";
import { DomainSection } from "./DomainSection";

export function CourseOverview() {
  const watchedVideos = useStudyStore((s) => s.watchedVideos);
  const watchedCount = watchedVideos.length;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Professor Messer's 220-1201 Course</h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
          {watchedCount}/{TOTAL_VIDEOS} watched
        </span>
      </div>

      {/* Course progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${(watchedCount / TOTAL_VIDEOS) * 100}%` }}
        />
      </div>

      {/* Domains */}
      {DOMAINS_220_1201.map((domain) => {
        const domainVideos = VIDEOS_220_1201.filter(
          (v) => v.domainId === domain.id
        );
        return (
          <DomainSection
            key={domain.id}
            domain={domain}
            videos={domainVideos}
          />
        );
      })}
    </div>
  );
}
