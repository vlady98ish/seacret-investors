"use client";

import Link from "next/link";

import { buildUnitContactHref } from "@/lib/contact-unit-prefill";
import type { Locale } from "@/lib/i18n";
import type { VillaMasterRecord } from "@/lib/villa-master-types";

type LegacyLabels = {
  groundFloor: string;
  upperFloor: string;
  attic: string;
  balcony: string;
  roofTerrace: string;
  outdoorArea: string;
  propertySize: string;
  bathrooms: string;
  pool: string;
  parking: string;
  yes: string;
  no: string;
};

type DetailItem = { label: string; value: string };

type UnitContactLink = {
  locale: Locale;
  villaTypeName: string;
  unitNumber: string;
  plotName?: string;
  label: string;
};

type UnitDetailPanelProps = {
  /** Row from villa_system MASTER sheet (imported JSON). */
  master?: VillaMasterRecord | null;
  /** Deep-link to /contact with villa, unit, plot and prefilled form message. */
  contact?: UnitContactLink;
  /** Fallback when no Excel row for this unit — uses Sanity fields only. */
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  outdoorArea?: number;
  propertySize?: number;
  bathrooms?: number;
  hasPool?: boolean;
  hasParking?: boolean;
  labels: LegacyLabels;
};

function fmtM2(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const t = Math.abs(n % 1) < 1e-9 ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
  return `${t} m²`;
}

function fmtEur(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function fmtEurPerM2(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${new Intl.NumberFormat("en-DE", { maximumFractionDigits: 0 }).format(n)} €/m²`;
}

function fmtText(s: string | null | undefined): string {
  if (s === null || s === undefined || s === "") return "—";
  return s;
}

function fmtInt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return String(n);
}

/** Column titles match villa_system MASTER sheet. */
function masterToRows(m: VillaMasterRecord): DetailItem[] {
  return [
    { label: "Plot", value: m.plot || "—" },
    { label: "Villa ID", value: m.villaId || "—" },
    { label: "Type", value: m.type || "—" },
    { label: "Floors", value: fmtInt(m.floors) },
    { label: "Built m²", value: fmtM2(m.builtM2) },
    { label: "ground floor", value: fmtM2(m.groundFloor) },
    { label: "first floor", value: fmtM2(m.firstFloor) },
    { label: "second floor", value: fmtM2(m.secondFloor) },
    { label: "plot size", value: fmtM2(m.plotSize) },
    { label: "Garden m²", value: fmtM2(m.gardenM2) },
    { label: "Balcony m²", value: fmtM2(m.balconyM2) },
    { label: "Roof terassa m²", value: fmtM2(m.roofTerraceM2) },
    { label: "Pool m²", value: fmtM2(m.poolM2) },
    { label: "Parking Spaces", value: fmtInt(m.parkingSpaces) },
    { label: "Bedrooms", value: fmtInt(m.bedrooms) },
    { label: "Bathrooms", value: fmtInt(m.bathrooms) },
    { label: "Living m²", value: fmtM2(m.livingM2) },
    { label: "bedroom ground floor", value: fmtText(m.bedroomGroundFloor) },
    { label: "living room first floor", value: fmtText(m.livingRoomFirstFloor) },
    { label: "bedroom first floor", value: fmtText(m.bedroomFirstFloor) },
    { label: "bedroom second floor", value: fmtText(m.bedroomSecondFloor) },
    { label: "Status", value: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase() : "—" },
    { label: "Price (€)", value: fmtEur(m.priceEur) },
    { label: "Price / Built m² (€)", value: fmtEurPerM2(m.pricePerBuiltM2) },
  ];
}

function legacyToRows(p: Omit<UnitDetailPanelProps, "master">): DetailItem[] {
  const { labels } = p;
  const items: DetailItem[] = [];
  if (p.groundFloor && p.groundFloor > 0) items.push({ label: labels.groundFloor, value: fmtM2(p.groundFloor) });
  if (p.upperFloor && p.upperFloor > 0) items.push({ label: labels.upperFloor, value: fmtM2(p.upperFloor) });
  if (p.attic && p.attic > 0) items.push({ label: labels.attic, value: fmtM2(p.attic) });
  if (p.balcony && p.balcony > 0) items.push({ label: labels.balcony, value: fmtM2(p.balcony) });
  if (p.roofTerrace && p.roofTerrace > 0) items.push({ label: labels.roofTerrace, value: fmtM2(p.roofTerrace) });
  if (p.outdoorArea && p.outdoorArea > 0) items.push({ label: labels.outdoorArea, value: fmtM2(p.outdoorArea) });
  if (p.propertySize && p.propertySize > 0) items.push({ label: labels.propertySize, value: fmtM2(p.propertySize) });
  if (p.bathrooms && p.bathrooms > 0) items.push({ label: labels.bathrooms, value: String(p.bathrooms) });
  if (p.hasPool !== undefined) items.push({ label: labels.pool, value: p.hasPool ? labels.yes : labels.no });
  if (p.hasParking !== undefined) items.push({ label: labels.parking, value: p.hasParking ? labels.yes : labels.no });
  return items;
}

export function UnitDetailPanel({ master, contact, ...legacy }: UnitDetailPanelProps) {
  const items = master ? masterToRows(master) : legacyToRows(legacy);
  const showGrid = items.length > 0;
  const showContact =
    Boolean(contact?.label) &&
    Boolean(contact?.unitNumber?.trim()) &&
    Boolean(contact?.villaTypeName?.trim()) &&
    Boolean(contact?.locale);

  if (!showGrid && !showContact) return null;

  const href =
    showContact && contact
      ? buildUnitContactHref(contact.locale, contact.villaTypeName, contact.unitNumber, contact.plotName)
      : "";

  return (
    <>
      {/* Action first: visible without scrolling past long MASTER rows */}
      {showContact && contact && (
        <div className="flex flex-col gap-2 border-b border-[rgba(13,103,119,0.1)] bg-[var(--color-sand)]/35 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <Link
            href={href}
            className="btn btn-primary !min-h-0 inline-flex min-h-8 w-full items-center justify-center px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] sm:w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {contact.label}
          </Link>
        </div>
      )}
      {showGrid && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-0 px-4 py-4 sm:grid-cols-2 sm:px-8">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between gap-4 border-b border-[rgba(13,103,119,0.06)] py-1.5">
              <span className="shrink-0 text-xs text-[var(--color-muted)]">{item.label}</span>
              <span className="min-w-0 text-right text-xs font-medium text-[var(--color-ink)]">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
