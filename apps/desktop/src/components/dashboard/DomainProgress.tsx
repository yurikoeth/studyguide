import { DOMAINS_220_1201 } from "@comptia-study/shared/data";

interface Props {
  domainCorrectCounts: Record<string, number>;
}

export function DomainProgress({ domainCorrectCounts }: Props) {
  return (
    <div className="space-y-3">
      {DOMAINS_220_1201.map((domain) => {
        const correct = domainCorrectCounts[domain.id] ?? 0;
        const progress = Math.min(correct / 50, 1);

        return (
          <div key={domain.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">
                {domain.number}. {domain.name}
              </span>
              <span className="text-slate-400">{domain.percentage}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
