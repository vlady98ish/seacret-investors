import Image from "next/image";

import { ScrollReveal } from "@/components/scroll-reveal";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

type CmsFounder = {
  name: string;
  role: string;
  bio: string;
  photo?: SanityImage;
};

type FoundersSectionProps = {
  eyebrow?: string;
  founders?: CmsFounder[];
};

export function FoundersSection({ eyebrow, founders }: FoundersSectionProps) {
  if (!founders?.length) return null;

  return (
    <section className="bg-[var(--color-cream)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        {eyebrow && (
          <ScrollReveal>
            <p className="eyebrow">{eyebrow}</p>
          </ScrollReveal>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {founders.map((founder, i) => (
            <ScrollReveal
              key={founder.name}
              delay={i * 0.1}
              direction={i === 0 ? "left" : "right"}
            >
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {founder.photo && getSanityImageUrl(founder.photo, 320) && (
                  <div className="relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={getSanityImageUrl(founder.photo, 320)!}
                      alt={`${founder.name} — ${founder.role}`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-h3">{founder.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
                    {founder.role}
                  </p>
                  <p className="text-body-muted mt-4">{founder.bio}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
