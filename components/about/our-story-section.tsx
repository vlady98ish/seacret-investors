import Image from "next/image";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type OurStorySectionProps = {
  eyebrow?: string;
  title?: string;
  content?: string;
};

export function OurStorySection({ eyebrow, title, content }: OurStorySectionProps) {
  if (!content) return null;

  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <section className="bg-[var(--color-cream)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        {(eyebrow || title) && (
          <ScrollReveal>
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
            />
          </ScrollReveal>
        )}

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="space-y-6">
            {paragraphs.map((para, i) => (
              <ScrollReveal key={i} delay={(i + 1) * 0.1}>
                <p className="text-body-muted">{para}</p>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-[var(--shadow-card)] ring-1 ring-[rgba(13,103,119,0.08)]">
              <Image
                src="/images/about/our-story-team.png"
                alt="Live Better founders discussing project strategy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
