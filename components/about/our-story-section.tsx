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

        <div className="mt-10 max-w-3xl space-y-6">
          {paragraphs.map((para, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 0.1}>
              <p className="text-body-muted">{para}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
