import Image from "next/image";
import { Waves } from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Upgrade } from "@/lib/sanity/types";

type UpgradesShowcaseProps = {
  upgrades: Upgrade[] | null;
  locale: Locale;
};

export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  if (!upgrades?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {upgrades.map((upgrade) => {
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
      })}
    </div>
  );
}
