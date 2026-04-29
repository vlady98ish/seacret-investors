import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";

type PortfolioBridgeSectionProps = {
  locale: Locale;
};

const CONTENT: Record<
  Locale,
  {
    sectionEyebrow: string;
    title: string;
    description: string;
    stats: [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
    cta: string;
  }
> = {
  en: {
    sectionEyebrow: "Discover our other projects",
    title: "Sea'cret is part of the broader Live Better portfolio",
    description:
      "For investors, one project is only part of the picture. The main Live Better site shows completed work, investment formats, and the execution model behind each project.",
    stats: [
      { value: "7–10%", label: "annual rental income" },
      { value: "50%", label: "ROI in 2 years" },
      { value: "50,000", label: "students in Patras" },
    ],
    cta: "View full portfolio",
  },
  ru: {
    sectionEyebrow: "Узнайте о других наших проектах",
    title: "Sea'cret — часть более широкого портфеля Live Better",
    description:
      "Для инвестора важно видеть не один объект, а весь подход команды. На основном сайте Live Better показаны проекты, инвестиционные форматы и принципы работы с инвесторами.",
    stats: [
      { value: "7–10%", label: "годового арендного дохода" },
      { value: "50%", label: "ROI за 2 года" },
      { value: "50 000", label: "студентов в Патрах" },
    ],
    cta: "Посмотреть весь портфель",
  },
  he: {
    sectionEyebrow: "גלו את שאר הפרויקטים שלנו",
    title: "Sea'cret הוא חלק מפורטפוליו רחב יותר של Live Better",
    description:
      "עבור משקיעים חשוב לראות לא רק פרויקט אחד אלא את הגישה הכוללת של הצוות. באתר הראשי של Live Better תמצאו פרויקטים, מסלולי השקעה ומתודולוגיית עבודה.",
    stats: [
      { value: "7–10%", label: "תשואת שכירות שנתית" },
      { value: "50%", label: "ROI בתוך שנתיים" },
      { value: "50,000", label: "סטודנטים בפטרס" },
    ],
    cta: "לצפייה בפורטפוליו המלא",
  },
  el: {
    sectionEyebrow: "Ανακαλύψτε τα άλλα έργα μας",
    title: "Το Sea'cret είναι μέρος του ευρύτερου χαρτοφυλακίου Live Better",
    description:
      "Για έναν επενδυτή, ένα μόνο έργο δεν είναι αρκετό. Στον βασικό ιστότοπο της Live Better θα δείτε το πλήρες χαρτοφυλάκιο, μορφές επένδυσης και το μοντέλο εκτέλεσης της ομάδας.",
    stats: [
      { value: "7–10%", label: "ετήσιο εισόδημα ενοικίων" },
      { value: "50%", label: "ROI σε 2 χρόνια" },
      { value: "50.000", label: "φοιτητές στην Πάτρα" },
    ],
    cta: "Δείτε όλο το χαρτοφυλάκιο",
  },
};

export function PortfolioBridgeSection({ locale }: PortfolioBridgeSectionProps) {
  const content = CONTENT[locale];

  return (
    <section className="bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <ScrollReveal>
          <p className="eyebrow">{content.sectionEyebrow}</p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative mt-6 overflow-hidden rounded-[var(--radius-xl)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-night) 0%, #0d3a42 50%, #143d3e 100%)",
              padding: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {/* Subtle radial glow */}
            <div
              className="pointer-events-none absolute -top-1/3 -right-1/5"
              style={{
                width: 500,
                height: 500,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(232,163,64,0.05) 0%, transparent 70%)",
              }}
            />

            {/* Logo + Ecosystem badge */}
            <div className="relative mb-8 flex items-center gap-4">
              <Image
                src="/images/about/live-better-logo-white.webp"
                alt="Live Better Group"
                width={120}
                height={28}
                className="h-7 w-auto object-contain opacity-90"
              />
              <div
                className="h-5 w-px"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <span
                className="rounded-full px-3.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em]"
                style={{
                  color: "var(--color-gold-sun)",
                  background: "rgba(232,163,64,0.10)",
                }}
              >
                Ecosystem
              </span>
            </div>

            {/* Title + description */}
            <h2
              className="relative font-serif font-semibold leading-tight tracking-wide text-white"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", maxWidth: 620 }}
            >
              {content.title}
            </h2>
            <p
              className="relative mt-4 max-w-[560px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}
            >
              {content.description}
            </p>

            {/* Stats */}
            <div className="relative mt-10 grid gap-4 grid-cols-1 sm:grid-cols-3">
              {content.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-5 py-6 text-center backdrop-blur-sm transition-colors hover:border-[var(--color-gold-sun)]/20"
                >
                  <p
                    className="font-serif font-bold tracking-wide"
                    style={{ fontSize: "1.6rem", color: "var(--color-gold-sun)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="relative mt-10">
              <a
                href="https://livebettergr.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                {content.cta}
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
