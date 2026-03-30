import { StatsCounter } from "@/components/about/stats-counter";

type StatsBarProps = {
  stats: Array<{ label?: string; value: string | number }>;
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-h2 text-[var(--color-deep-teal)]">
            <StatsCounter value={parseFloat(String(stat.value))} />
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
