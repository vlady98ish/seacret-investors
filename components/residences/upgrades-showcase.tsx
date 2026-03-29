import Image from "next/image";
import {
  Beef,
  Flame,
  Shield,
  Smartphone,
  Waves,
} from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Upgrade } from "@/lib/sanity/types";

type UpgradesShowcaseProps = {
  upgrades: Upgrade[] | null;
  locale: Locale;
};

const FALLBACK_UPGRADES = [
  {
    key: "pool",
    name: "Swimming Pool",
    description: "Private infinity pool with ocean-inspired finish.",
    icon: <Waves className="h-7 w-7" />,
  },
  {
    key: "jacuzzi",
    name: "Jacuzzi",
    description: "Outdoor jacuzzi with hydrotherapy jets.",
    icon: <Waves className="h-7 w-7" />,
  },
  {
    key: "sauna",
    name: "Sauna",
    description: "Finnish sauna cabin with panoramic glazing.",
    icon: <Flame className="h-7 w-7" />,
  },
  {
    key: "bbq",
    name: "BBQ Kitchen",
    description: "Fully equipped outdoor summer kitchen.",
    icon: <Beef className="h-7 w-7" />,
  },
  {
    key: "smart",
    name: "Smart House",
    description: "Full home automation — lighting, climate, security.",
    icon: <Smartphone className="h-7 w-7" />,
  },
  {
    key: "security",
    name: "Security System",
    description: "24/7 CCTV, alarm, and smart access control.",
    icon: <Shield className="h-7 w-7" />,
  },
  {
    key: "fireplace",
    name: "Fireplace",
    description: "Built-in indoor/outdoor fireplace for year-round ambience.",
    icon: <Flame className="h-7 w-7" />,
  },
] as const;

export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  const hasCmsUpgrades = upgrades && upgrades.length > 0;

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {hasCmsUpgrades
        ? upgrades.map((upgrade) => {
            const name = getLocalizedValue(upgrade.name, locale) ?? "";
            const description = getLocalizedValue(upgrade.description, locale) ?? "";
            const imageUrl = getSanityImageUrl(upgrade.image, 400);

            return (
              <div
                key={upgrade._id}
                className="tile flex flex-col gap-4"
              >
                {imageUrl ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--color-stone)]">
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-[var(--color-deep-teal)]">
                    <Waves className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <h3 className="text-h3 text-base">{name}</h3>
                  {description && (
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
                  )}
                </div>
              </div>
            );
          })
        : FALLBACK_UPGRADES.map((item) => (
            <div key={item.key} className="tile flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-[var(--color-deep-teal)]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-h3 text-base">{item.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
              </div>
            </div>
          ))}
    </div>
  );
}
