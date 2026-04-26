import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Fence,
  Flame,
  Network,
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

const UPGRADE_ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  pool: Waves,
  jacuzzi: Bath,
  sauna: ThermometerSun,
  bbq: UtensilsCrossed,
  "smart-house": TabletSmartphone,
  knx: Network,
  security: Shield,
  fireplace: Flame,
  fence: Fence,
};

const CATEGORY_BADGE_LABEL: Record<string, string> = {
  pool: "Outdoor Living",
  jacuzzi: "Wellness",
  sauna: "Wellness",
  bbq: "Outdoor Living",
  "smart-house": "Technology",
  knx: "Technology",
  security: "Security",
  fireplace: "Interior",
  fence: "Exterior",
};

function upgradeIconForCategory(category: string | undefined): LucideIcon {
  if (!category) return Sparkles;
  return UPGRADE_ICON_BY_CATEGORY[category] ?? Sparkles;
}

export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  if (!upgrades?.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upgrades.map((upgrade) => {
          const name = getLocalizedValue(upgrade.name, locale) ?? "";
          const description = getLocalizedValue(upgrade.description, locale) ?? "";
          const imageUrl = getSanityImageUrl(upgrade.image, 600);
          const Icon = upgradeIconForCategory(upgrade.category);
          const badgeLabel = upgrade.category
            ? CATEGORY_BADGE_LABEL[upgrade.category]
            : undefined;
          const priceNote = upgrade.priceNote
            ? getLocalizedValue(upgrade.priceNote, locale)
            : undefined;

          return (
            <div
              key={upgrade._id}
              className="tile flex flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              {imageUrl ? (
                <div className="relative h-[220px] bg-[var(--color-stone)]">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-[var(--color-stone)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-[var(--color-deep-teal)]">
                    <Icon className="h-8 w-8" aria-hidden />
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                {badgeLabel && (
                  <span className="mb-2 inline-block w-fit rounded-sm bg-[rgba(26,107,110,0.08)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-deep-teal)]">
                    {badgeLabel}
                  </span>
                )}
                <h3 className="text-h3 text-base">{name}</h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {description}
                  </p>
                )}

                {upgrade.price != null && (
                  <div className="mt-auto flex items-baseline justify-between border-t border-[rgba(13,103,119,0.06)] pt-3 mt-4">
                    <span className="text-xl font-bold text-[var(--color-ink)]">
                      {upgrade.price.toLocaleString("en-US")}{" "}
                      <span className="text-xs font-normal text-[var(--color-muted)]">
                        {upgrade.priceUnit === "meter" ? "EUR / m" : "EUR"}
                      </span>
                    </span>
                    {priceNote && (
                      <span className="text-xs italic text-[var(--color-muted)]">
                        {priceNote}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {upgrades.some((u) => u.price != null) && (
        <div className="mt-8 rounded-r border-l-[3px] border-[var(--color-deep-teal)] bg-[rgba(26,107,110,0.04)] px-5 py-4 text-sm text-[var(--color-muted)]">
          <strong>Project: Chiliadou</strong> — All prices are indicative and
          exclude VAT at 24%. Final pricing may vary based on villa configuration
          and site conditions.
        </div>
      )}
    </>
  );
}
