import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type OurStorySectionProps = {
  eyebrow?: string;
  title?: string;
  content?: string;
};

export function OurStorySection({ eyebrow, title, content }: OurStorySectionProps) {
  const resolvedEyebrow = eyebrow || "Our Story";
  const resolvedTitle = title || "From a pandemic-era idea to Greece's most dynamic developer";

  // Split content into paragraphs if CMS-provided, otherwise use hardcoded fallback paragraphs
  const paragraphs = content
    ? content.split(/\n\n+/).filter(Boolean)
    : [
        "In September 2020, while the world was in lockdown, Tom Linkovsky and Evgeny Kalika — friends for over 30 years — saw what others missed: untapped potential in the Greek real estate market. They started in Patras, a vibrant university city and major transport hub on the Peloponnese coast.",
        "The problem was clear — students were living in outdated, poorly maintained apartments. The solution became Live Better\u2019s first concept: the \u201cAirbnb for students\u201d — fully furnished apartments for long-term rental. Five years in, the model has a perfect track record: zero vacant units exceeding one week.",
        "From student housing, the group expanded into family residences, property flips, villa construction, and luxury vacation homes. Today Live Better Group operates across Patras, Athens, and the resort towns of Chiliadou and Akrata — with 14 projects in progress and over 420 housing units in the pipeline.",
      ];

  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={resolvedEyebrow}
            title={resolvedTitle}
          />
        </ScrollReveal>

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
