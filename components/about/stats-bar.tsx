type CmsStat = {
  value: string;
  label: string;
};

type StatsBarProps = {
  stats?: CmsStat[];
};

export function StatsBar({ stats }: StatsBarProps) {
  if (!stats?.length) return null;

  return (
    <section className="bg-[var(--color-ink)]">
      <div className="section-shell flex flex-wrap items-center justify-center gap-8 py-10 sm:gap-12 md:gap-16 lg:justify-between lg:py-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold text-[var(--color-gold-sun)] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs tracking-wide text-[var(--color-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
