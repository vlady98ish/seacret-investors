import Image from "next/image";

import { ScrollReveal } from "@/components/scroll-reveal";
import type { SanityImage } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

type CmsFounder = {
  name: string;
  role: string;
  bio: string;
  photo?: SanityImage;
};

type FoundersSectionProps = {
  locale: Locale;
  eyebrow?: string;
  founders?: CmsFounder[];
};

const UNITY_COPY: Record<Locale, { title: string; text: string; badge: string }> = {
  en: {
    title: "A lifelong friendship. One strategy.",
    text: "Tom and Evgeny have worked together for decades, combining operational execution, market vision, and investor-first decision making in every project.",
    badge: "30+ years of partnership",
  },
  ru: {
    title: "Дружба длиною в жизнь. Одна стратегия.",
    text: "Том и Евгений работают вместе десятилетиями, объединяя операционную экспертизу, рыночное видение и фокус на интересах инвестора в каждом проекте.",
    badge: "30+ лет партнёрства",
  },
  he: {
    title: "חברות של חיים שלמים. אסטרטגיה אחת.",
    text: "טום ויבגני עובדים יחד עשרות שנים ומשלבים ביצוע תפעולי, ראייה שיווקית והתמקדות במשקיע בכל פרויקט.",
    badge: "30+ שנות שותפות",
  },
  el: {
    title: "Μια φιλία ζωής. Μία στρατηγική.",
    text: "Ο Tom και ο Evgeny συνεργάζονται εδώ και δεκαετίες, συνδυάζοντας επιχειρησιακή εκτέλεση, στρατηγική αγοράς και επενδυτική σκέψη σε κάθε έργο.",
    badge: "30+ χρόνια συνεργασίας",
  },
};

export function FoundersSection({ locale, eyebrow, founders }: FoundersSectionProps) {
  if (!founders?.length) return null;
  const unity = UNITY_COPY[locale];

  return (
    <section className="bg-[var(--color-cream)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        {eyebrow && (
          <ScrollReveal>
            <p className="eyebrow">{eyebrow}</p>
          </ScrollReveal>
        )}

        <div className="mt-6 bg-transparent p-0">
          <p className="text-h3">{unity.title}</p>
          <p className="text-body-muted mt-2.5">{unity.text}</p>
          <div className="mt-4 flex items-center gap-2.5 text-[var(--color-deep-teal)]/80">
            <span className="h-px w-8 bg-[var(--color-deep-teal)]/30" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              {unity.badge}
            </p>
            <span className="h-px w-8 bg-[var(--color-deep-teal)]/30" aria-hidden />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-md shadow-[var(--shadow-card)] ring-1 ring-[rgba(13,103,119,0.06)]">
          <div className="relative aspect-[3/2] md:aspect-[16/9]">
            <Image
              src="/images/about/founders-together.png"
              alt="Live Better founders together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={92}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[...founders].reverse().map((founder, i) => (
            <ScrollReveal
              key={founder.name}
              delay={i * 0.1}
              direction={i === 0 ? "left" : "right"}
            >
              <div className="h-full rounded-md border border-[var(--color-deep-teal)]/10 bg-white/72 p-5">
                <h3 className="text-h3">{founder.name}</h3>
                <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
                  {founder.role}
                </p>
                <p className="text-body-muted mt-4">{founder.bio}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
