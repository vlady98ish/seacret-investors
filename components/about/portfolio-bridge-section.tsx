import type { Locale } from "@/lib/i18n";
import { GraduationCap, Percent, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

type PortfolioBridgeSectionProps = {
  locale: Locale;
};

const CONTENT: Record<
  Locale,
  {
    sectionEyebrow: string;
    eyebrow: string;
    title: string;
    description: string;
    proofLabel: string;
    stats: [string, string, string];
    bullets: [string, string, string];
    cta: string;
  }
> = {
  en: {
    sectionEyebrow: "Discover our other projects",
    eyebrow: "Live Better Ecosystem",
    title: "Sea'cret is part of the broader Live Better portfolio",
    description:
      "For investors, one project is only part of the picture. The main Live Better site shows completed work, investment formats, and the execution model behind each project.",
    proofLabel: "Investment proof points",
    stats: ["7-10% annual rental income", "Up to 50% ROI in 2 years", "50,000 students in Patras"],
    bullets: ["Review all projects", "Compare investment formats", "Understand why Patras"],
    cta: "View full portfolio",
  },
  ru: {
    sectionEyebrow: "Узнайте о других наших проектах",
    eyebrow: "Экосистема Live Better",
    title: "Sea'cret — часть более широкого портфеля Live Better",
    description:
      "Для инвестора важно видеть не один объект, а весь подход команды. На основном сайте Live Better показаны проекты, инвестиционные форматы и принципы работы с инвесторами.",
    proofLabel: "Ключевые инвестиционные ориентиры",
    stats: ["7-10% годового арендного дохода", "ROI до 50% за 2 года", "50 000 студентов в Патрах"],
    bullets: ["Посмотреть все проекты", "Сравнить форматы инвестиций", "Понять, почему именно Патры"],
    cta: "Посмотреть весь портфель",
  },
  he: {
    sectionEyebrow: "גלו את שאר הפרויקטים שלנו",
    eyebrow: "האקוסיסטם של Live Better",
    title: "Sea'cret הוא חלק מפורטפוליו רחב יותר של Live Better",
    description:
      "עבור משקיעים חשוב לראות לא רק פרויקט אחד אלא את הגישה הכוללת של הצוות. באתר הראשי של Live Better תמצאו פרויקטים, מסלולי השקעה ומתודולוגיית עבודה.",
    proofLabel: "נתוני השקעה מרכזיים",
    stats: ["תשואת שכירות שנתית של 7-10%", "ROI של עד 50% בתוך שנתיים", "50,000 סטודנטים בפטרס"],
    bullets: ["לסקור את כל הפרויקטים", "להשוות מסלולי השקעה", "להבין למה פטרס"],
    cta: "לצפייה בפורטפוליו המלא",
  },
  el: {
    sectionEyebrow: "Ανακαλύψτε τα άλλα έργα μας",
    eyebrow: "Οικοσύστημα Live Better",
    title: "Το Sea'cret είναι μέρος του ευρύτερου χαρτοφυλακίου Live Better",
    description:
      "Για έναν επενδυτή, ένα μόνο έργο δεν είναι αρκετό. Στον βασικό ιστότοπο της Live Better θα δείτε το πλήρες χαρτοφυλάκιο, μορφές επένδυσης και το μοντέλο εκτέλεσης της ομάδας.",
    proofLabel: "Βασικοί επενδυτικοί δείκτες",
    stats: ["7-10% ετήσιο εισόδημα από ενοίκια", "ROI έως 50% σε 2 χρόνια", "50.000 φοιτητές στην Πάτρα"],
    bullets: ["Δείτε όλα τα έργα", "Συγκρίνετε μορφές επένδυσης", "Κατανοήστε γιατί η Πάτρα"],
    cta: "Δείτε όλο το χαρτοφυλάκιο",
  },
};

export function PortfolioBridgeSection({ locale }: PortfolioBridgeSectionProps) {
  const content = CONTENT[locale];
  const statIcons = [Percent, TrendingUp, GraduationCap] as const;

  return (
    <section className="bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <ScrollReveal>
          <p className="eyebrow">{content.sectionEyebrow}</p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="tile mt-6 p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-deep-teal)]/20 bg-white/70 px-3 py-1.5">
              <img
                src="https://livebettergr.com/wp-content/webp-express/webp-images/uploads/2025/08/Live-Better-logo-white.png.webp"
                alt="Live Better Group"
                className="h-5 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-deep-teal)]">
                {content.eyebrow}
              </span>
            </div>

            <h2 className="text-h2 mt-5">{content.title}</h2>
            <p className="text-body-muted mt-4 max-w-2xl">{content.description}</p>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-deep-teal)]">
              {content.proofLabel}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {content.stats.map((item, index) => {
                const Icon = statIcons[index] ?? Percent;
                return (
                  <div
                    key={item}
                    className="rounded-md border border-[var(--color-deep-teal)]/12 bg-[linear-gradient(180deg,rgba(245,239,218,0.86)_0%,rgba(239,228,203,0.72)_100%)] px-4 py-3 text-[var(--color-ink)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/75 ring-1 ring-[var(--color-deep-teal)]/12">
                        <Icon className="h-4.5 w-4.5 text-[var(--color-deep-teal)]" />
                      </div>
                      <p className="pt-1 text-sm font-semibold leading-snug">{item}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="mt-6 space-y-2" aria-label="Portfolio highlights">
              {content.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-deep-teal)]/80"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href="https://livebettergr.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {content.cta}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
