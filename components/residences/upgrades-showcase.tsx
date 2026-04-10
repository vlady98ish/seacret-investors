import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Flame,
  Shield,
  Sparkles,
  TabletSmartphone,
  ThermometerSun,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Upgrade } from "@/lib/sanity/types";

type UpgradesShowcaseProps = {
  upgrades: Upgrade[] | null;
  locale: Locale;
};

/** Совпадает с `category` в sanity/schemaTypes/upgrade.ts */
const UPGRADE_ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  pool: Waves,
  jacuzzi: Bath,
  sauna: ThermometerSun,
  bbq: UtensilsCrossed,
  "smart-house": TabletSmartphone,
  security: Shield,
  fireplace: Flame,
};

function upgradeIconForCategory(category: string | undefined): LucideIcon {
  if (!category) return Sparkles;
  return UPGRADE_ICON_BY_CATEGORY[category] ?? Sparkles;
}

export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  if (!upgrades?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 [&>*]:w-[calc(50%-0.75rem)] [&>*]:md:w-[calc(33.333%-1rem)] [&>*]:lg:w-[calc(25%-1.125rem)]">
      {upgrades.map((upgrade) => {
        const name = getLocalizedValue(upgrade.name, locale) ?? "";
        const description = getLocalizedValue(upgrade.description, locale) ?? "";
        const imageUrl = getSanityImageUrl(upgrade.image, 400);
        const Icon = upgradeIconForCategory(upgrade.category);

        return (
          <div
            key={upgrade._id}
            className="tile flex flex-col gap-4"
          >
            {imageUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-md bg-[var(--color-stone)]">
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
                <Icon className="h-7 w-7" aria-hidden />
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
      })}
    </div>
  );
}
