import { StatsCounter } from "@/components/about/stats-counter";

const STATS = [
  { value: 12, suffix: "+", label: "Completed Projects" },
  { value: 80, suffix: "+", label: "Units Delivered" },
  { value: 10, prefix: "€", suffix: "M+", label: "Capital Raised" },
  { value: 45, suffix: "%+", label: "ROI in 2023–2024" },
];

export function StatsBar() {
  return (
    <section className="bg-[var(--color-ink)]">
      <div className="section-shell flex flex-wrap items-center justify-center gap-8 py-10 sm:gap-12 md:gap-16 lg:justify-between lg:py-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold text-[var(--color-gold-sun)] sm:text-4xl">
              <StatsCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
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
