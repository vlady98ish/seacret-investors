import { Car, ChevronDown, Clock } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { ImageGallery } from "@/components/villa-detail/image-gallery";
import { SectionHeading } from "@/components/sections/section-heading";

interface MarkerProp {
  place: string;
  time: string;
  detail: string;
}

interface DistanceMapSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  markers?: MarkerProp[];
}

const PLACE_GALLERIES: Record<string, string[]> = {
  nafpaktos: [
    "/images/location/nafpaktos/a8838509-67a1-42b1-8dad-55b66e2f2443.jpg",
    "/images/location/nafpaktos/b82dbbe2-acb9-49cd-b599-bb8014e21fcb.jpg",
    "/images/location/nafpaktos/1000_F_399159693_ZIV5yooTkvwc3yWfW7rixLG2nVBD4GWT.jpg",
    "/images/location/nafpaktos/nafpaktos-04.png",
    "/images/location/nafpaktos/nafpaktos-03.png",
    "/images/location/nafpaktos/nafpaktos-02.png",
    "/images/location/nafpaktos/nafpaktos-01.png",
  ],
  rio: [
    "/images/location/bridge/gefyra.jpg",
    "/images/location/bridge/IMG_7589.jpg",
    "/images/location/bridge/min-Most-Rio-Antirio-Peloponnes-Gretsiya-750x400.jpg",
    "/images/location/bridge/Tl5IRaczEvoqEFp7CVBJmUaJH8jchN6hz5j3k1xF@800.jpg",
    "/images/location/bridge/unnamed.jpg",
  ],
  trizonia: [
    "/images/location/trizonia/542691_800.jpg",
    "/images/location/trizonia/542824_800.jpg",
    "/images/location/trizonia/hotel-drymna.jpg",
    "/images/location/trizonia/photo1jpg.jpg",
    "/images/location/trizonia/photo3jpg.jpg",
  ],
  patras: [
    "/images/location/patras/download.jpg",
    "/images/location/patras/IMG_0009.jpg",
    "/images/location/patras/licensed-image.jpg",
    "/images/location/patras/licensed-image (1).jpg",
    "/images/location/patras/licensed-image (2).jpg",
    "/images/location/patras/unnamed (1).jpg",
    "/images/location/patras/unnamed (2).jpg",
    "/images/location/patras/unnamed (3).jpg",
  ],
  galaxidi: [
    "/images/location/galaxidy/IMG_0002.jpg",
    "/images/location/galaxidy/IMG_0003.jpg",
    "/images/location/galaxidy/IMG_0004.jpg",
    "/images/location/galaxidy/IMG_0005.jpg",
    "/images/location/galaxidy/IMG_0009.jpg",
    "/images/location/galaxidy/IMG_0011.jpg",
    "/images/location/galaxidy/IMG_0013.jpg",
  ],
  athens: [
    "/images/location/athens/arhitektura_zakat_more_139212_3840x2400.jpg",
    "/images/location/athens/e9373ebeb417610b279b2c4074288b72.jpg",
    "/images/location/athens/gorod_arhitektura_zdaniia_175489_3840x2400.jpg",
    "/images/location/athens/istockphoto-1811502067-612x612.jpg",
  ],
};

function resolvePlaceKey(place: string): keyof typeof PLACE_GALLERIES | null {
  const value = place.toLowerCase();
  if (value.includes("нафп") || value.includes("nafpakt")) return "nafpaktos";
  if (value.includes("рио") || value.includes("rio")) return "rio";
  if (value.includes("триз") || value.includes("triz")) return "trizonia";
  if (value.includes("патр") || value.includes("patra")) return "patras";
  if (value.includes("галакс") || value.includes("galax")) return "galaxidi";
  if (value.includes("афин") || value.includes("athen")) return "athens";
  return null;
}

export function DistanceMapSection({
  eyebrow,
  title,
  description,
  markers,
}: DistanceMapSectionProps = {}) {
  if (!markers?.length) return null;

  return (
    <section className="py-20" style={{ background: "var(--color-cream)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            descriptionClassName="max-w-none lg:whitespace-nowrap"
          />
        </ScrollReveal>

        {/* Map placeholder + distance grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
          }}
          className="lg:grid-cols-2"
        >
          {/* Google Maps embed */}
          <ScrollReveal direction="left">
            <div
              className="relative overflow-hidden"
              style={{
                minHeight: "360px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(13,103,119,0.08)",
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=38.3893698,21.9141577&z=15&output=embed"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sea'cret Residences location — Chiliadou, Greece"
              />
            </div>
          </ScrollReveal>

          {/* Distance markers */}
          <ScrollReveal direction="right">
            <div className="flex flex-col gap-3">
              {markers.map((d, i) => (
                <ScrollReveal key={d.place || i} delay={i * 0.06}>
                  {(() => {
                    const placeKey = resolvePlaceKey(d.place);
                    const gallery = placeKey ? PLACE_GALLERIES[placeKey] : [];
                    return (
                  <details className="tile group overflow-hidden">
                    <summary
                      className="flex cursor-pointer list-none items-center gap-3"
                      style={{ padding: "0.5rem 0.8rem" }}
                    >
                      <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[rgba(13,103,119,0.10)]">
                        <Car size={13} className="text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="font-serif text-[0.92rem] font-semibold text-[var(--color-ink)]">
                          {d.place}
                        </span>
                        <span className="text-[0.72rem] leading-relaxed text-[var(--color-muted)]">
                          {d.detail}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <Clock
                            size={12}
                            style={{ color: "var(--color-deep-teal)" }}
                            strokeWidth={1.5}
                          />
                          <span className="whitespace-nowrap text-sm font-semibold text-[var(--color-deep-teal)]">
                            {d.time}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className="text-[var(--color-deep-teal)] transition-transform duration-300 group-open:rotate-180"
                          strokeWidth={1.7}
                        />
                      </div>
                    </summary>

                    <div className="border-t border-[rgba(13,103,119,0.1)] px-4 pb-4 pt-3">
                      {gallery.length > 0 ? (
                        <ImageGallery
                          images={gallery}
                          villaName={d.place}
                          variant="masterplan"
                        />
                      ) : (
                        <div className="rounded-md border border-dashed border-[rgba(13,103,119,0.18)] bg-white/65 px-4 py-3 text-xs text-[var(--color-muted)]">
                          Gallery will appear here after images are added for this location.
                        </div>
                      )}
                    </div>
                  </details>
                    );
                  })()}
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
