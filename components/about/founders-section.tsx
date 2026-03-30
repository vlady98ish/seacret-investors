import Image from "next/image";

import { ScrollReveal } from "@/components/scroll-reveal";

type CmsFounder = {
  name: string;
  role: string;
  bio: string;
};

type HardcodedFounder = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const FALLBACK_FOUNDERS: HardcodedFounder[] = [
  {
    name: "Tom Linkovsky",
    role: "Co-Founder",
    image: "/assets/team/tom-linkovsky.webp",
    bio: "Entrepreneur with over 20 years of experience. Previously owned a restaurant chain in Tel Aviv, worked in import and large-scale event management. Brings operational drive and strategic vision to every project.",
  },
  {
    name: "Evgeny Kalika",
    role: "Co-Founder",
    image: "/assets/team/evgeny-kalika.webp",
    bio: "Specialist in marketing, strategic consulting, and advertising. Known for discipline, reliability, and responsibility. Drives the group's investor relations and market positioning across Europe.",
  },
];

// Derive photo path from founder name when using CMS data
function founderImagePath(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `/assets/team/${slug}.webp`;
}

type FoundersSectionProps = {
  eyebrow?: string;
  founders?: CmsFounder[];
};

export function FoundersSection({ eyebrow, founders }: FoundersSectionProps) {
  const resolvedEyebrow = eyebrow || "The Founders";

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <p className="eyebrow">{resolvedEyebrow}</p>
        </ScrollReveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {founders && founders.length > 0
            ? founders.map((founder, i) => (
                <ScrollReveal
                  key={founder.name}
                  delay={i * 0.1}
                  direction={i === 0 ? "left" : "right"}
                >
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={founderImagePath(founder.name)}
                        alt={`${founder.name} — ${founder.role}`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-h3">{founder.name}</h3>
                      <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
                        {founder.role}
                      </p>
                      <p className="text-body-muted mt-4">{founder.bio}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            : FALLBACK_FOUNDERS.map((founder, i) => (
                <ScrollReveal
                  key={founder.name}
                  delay={i * 0.1}
                  direction={i === 0 ? "left" : "right"}
                >
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={founder.image}
                        alt={`${founder.name} — ${founder.role}`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
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
