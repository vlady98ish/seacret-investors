import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

export function OurStorySection() {
  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Our Story"
            title="From a pandemic-era idea to Greece's most dynamic developer"
          />
        </ScrollReveal>

        <div className="mt-10 max-w-3xl space-y-6">
          <ScrollReveal delay={0.1}>
            <p className="text-body-muted">
              In September 2020, while the world was in lockdown, Tom Linkovsky and Evgeny
              Kalika — friends for over 30 years — saw what others missed: untapped potential
              in the Greek real estate market. They started in Patras, a vibrant university
              city and major transport hub on the Peloponnese coast.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-body-muted">
              The problem was clear — students were living in outdated, poorly maintained
              apartments. The solution became Live Better&apos;s first concept: the &ldquo;Airbnb
              for students&rdquo; — fully furnished apartments for long-term rental. Five years
              in, the model has a perfect track record: zero vacant units exceeding one week.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-body-muted">
              From student housing, the group expanded into family residences, property flips,
              villa construction, and luxury vacation homes. Today Live Better Group operates
              across Patras, Athens, and the resort towns of Chiliadou and Akrata — with 14
              projects in progress and over 420 housing units in the pipeline.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
