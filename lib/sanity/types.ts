import type { Locale } from "@/lib/i18n";

export type LocalizedString = Record<Locale, string>;
export type LocalizedText = Record<Locale, string>;

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; width: number; height: number };
}

export interface Villa {
  _id: string;
  name: string;
  slug: { current: string };
  label: LocalizedString;
  summary: LocalizedText;
  highlights: LocalizedString[];
  heroImage: SanityImage;
  galleryImages: SanityImage[];
  floorPlanImages: SanityImage[];
  tourUrl?: string;
  typicalBedrooms: number;
  typicalBathrooms: number;
  areaRange: string;
  sortOrder: number;
}

export type UnitStatus = "available" | "reserved" | "sold";

export interface Unit {
  _id: string;
  unitNumber: string;
  plot: { _ref: string; name: string };
  villaType: { _ref: string; name: string; slug: { current: string } };
  status: UnitStatus;
  totalArea: number;
  outdoorArea: number;
  bedrooms: number;
  bathrooms: number;
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  hasPool: boolean;
  hasParking: boolean;
  floorLevel?: "ground" | "upper";
}

export interface Plot {
  _id: string;
  name: string;
  summary: LocalizedText;
  aerialImage: SanityImage;
  positionData: { x: number; y: number };
  sortOrder: number;
}

export interface SiteSettings {
  projectName: string;
  salesEmail: string;
  salesPhone: string;
  whatsappNumber: string;
  officeHours: LocalizedString;
  brochurePdf: Record<Locale, { asset: { _ref: string; url: string } }>;
  legalLinks: {
    privacyPolicy?: string;
    termsConditions?: string;
    cookiePolicy?: string;
  };
}

export interface FAQ {
  _id: string;
  question: LocalizedString;
  answer: LocalizedText;
  category: string;
  sortOrder: number;
}

// === Page Document Types ===

export interface HomePage {
  heroTagline: LocalizedString;
  heroSubtitle: LocalizedString;
  heroImage: SanityImage;
  heroVideoUrl?: string;
  conceptEyebrow: LocalizedString;
  conceptCopy: LocalizedText;
  conceptImage: SanityImage;
  lifestyleMoments: Array<{
    period: string;
    copy: LocalizedText;
    image: SanityImage;
  }>;
  featuredVillas: FeaturedVilla[];
  masterplanImage: SanityImage;
  ctaTitle: LocalizedString;
  ctaSubtitle: LocalizedString;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface FeaturedVilla {
  _id: string;
  name: string;
  slug: { current: string };
  label: LocalizedString;
  heroImage: SanityImage;
  typicalBedrooms: number;
  areaRange: string;
  sortOrder: number;
}

export interface ResidencesPage {
  heroImage: SanityImage;
  heroTitle: LocalizedString;
  introCopy: LocalizedText;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface LocationPage {
  heroImage: SanityImage;
  heroTitle: LocalizedString;
  whySection: LocalizedText;
  distances: Array<{ place: string; time: string; lat: number; lng: number }>;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface MasterplanPage {
  heroImage: SanityImage;
  heroTitle: LocalizedString;
  introCopy: LocalizedText;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface ContactPage {
  heroTitle: LocalizedString;
  responsePromise: LocalizedString;
  officeInfo: LocalizedText;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface Upgrade {
  _id: string;
  name: LocalizedString;
  description: LocalizedText;
  image: SanityImage;
  category: string;
  sortOrder: number;
}

export interface Experience {
  _id: string;
  title: LocalizedString;
  description: LocalizedText;
  image: SanityImage;
  category: string;
  sortOrder: number;
}

export interface Developer {
  companyName: string;
  description: LocalizedText;
  logo: SanityImage;
  credentials: LocalizedText;
  team: Array<{ name: string; role: LocalizedString; photo: SanityImage }>;
}

export interface UnitWithRefs {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  outdoorArea: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  plotName: string;
}

export interface PlotWithUnits {
  _id: string;
  name: string;
  summary: LocalizedText;
  aerialImage: SanityImage;
  positionData: { x: number; y: number };
  sortOrder: number;
  units: Array<{
    _id: string;
    unitNumber: string;
    status: UnitStatus;
    totalArea: number;
    bedrooms: number;
    hasPool: boolean;
    villaTypeName: string;
    villaTypeSlug: string;
  }>;
}

export interface UnitFlat {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  plotName: string;
  villaTypeName: string;
  villaTypeSlug: string;
}
