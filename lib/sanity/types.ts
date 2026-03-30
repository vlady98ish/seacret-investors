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

export interface UiStrings {
  // Navigation
  navHome: LocalizedString;
  navResidences: LocalizedString;
  navMasterplan: LocalizedString;
  navLocation: LocalizedString;
  navAbout: LocalizedString;
  navContact: LocalizedString;

  // Footer
  footerTagline: LocalizedText;
  footerNavigate: LocalizedString;
  footerLegal: LocalizedString;
  footerPrivacyPolicy: LocalizedString;
  footerTerms: LocalizedString;
  footerCookiePolicy: LocalizedString;
  footerAllRights: LocalizedString;

  // Status
  statusAvailable: LocalizedString;
  statusReserved: LocalizedString;
  statusSold: LocalizedString;
  statusSoldOut: LocalizedString;

  // Specs
  specBedrooms: LocalizedString;
  specBathrooms: LocalizedString;
  specTotalArea: LocalizedString;
  specOutdoorArea: LocalizedString;
  specPool: LocalizedString;
  specParking: LocalizedString;
  specYes: LocalizedString;
  specNo: LocalizedString;

  // Form
  formFullName: LocalizedString;
  formEmail: LocalizedString;
  formPhone: LocalizedString;
  formMessage: LocalizedString;
  formSubmit: LocalizedString;
  formSending: LocalizedString;
  formSuccess: LocalizedString;
  formError: LocalizedString;
  formGdpr: LocalizedText;
  formSelectOne: LocalizedString;
  formBack: LocalizedString;
  formNext: LocalizedString;

  // CTA
  ctaScheduleTour: LocalizedString;
  ctaRequestInfo: LocalizedString;
  ctaDownloadBrochure: LocalizedString;
  ctaWhatsappUs: LocalizedString;
  ctaExploreResidences: LocalizedString;
  ctaViewAll: LocalizedString;
  ctaSendRequest: LocalizedString;
  ctaContactUs: LocalizedString;

  // Filters & Tables
  filterBedrooms: LocalizedString;
  filterAvailableOnly: LocalizedString;
  filterSort: LocalizedString;
  filterSortName: LocalizedString;
  filterPriceLowHigh: LocalizedString;
  filterSizeSmallLarge: LocalizedString;
  filterNoResults: LocalizedString;
  filterAll: LocalizedString;
  filterAllTypes: LocalizedString;
  filterPlot: LocalizedString;
  filterType: LocalizedString;
  filterShowing: LocalizedString;
  tableUnitNumber: LocalizedString;
  tableVillaType: LocalizedString;
  tableBeds: LocalizedString;
  tableTotalArea: LocalizedString;
  tablePriceFrom: LocalizedString;
  tableStatus: LocalizedString;
  tableAreaM2: LocalizedString;
  tablePool: LocalizedString;
  tablePlot: LocalizedString;

  // Pricing
  pricingFrom: LocalizedString;
  pricingContactFor: LocalizedString;

  // Misc
  miscNoImage: LocalizedString;
  miscComingSoon: LocalizedString;
  miscImageComing: LocalizedString;
  miscDataComing: LocalizedString;
  miscUnit: LocalizedString;
  miscUnits: LocalizedString;
  miscAvailable: LocalizedString;
  miscBed: LocalizedString;
  miscBeds: LocalizedString;
  miscOf: LocalizedString;
  miscGetInTouch: LocalizedString;
  miscReadyToDiscover: LocalizedString;
  miscContactPromise: LocalizedText;
  miscGallery: LocalizedString;
  miscFloorPlans: LocalizedString;
  miscPricing: LocalizedString;
  miscAvailableUnits: LocalizedString;
  misc3dTour: LocalizedString;
  miscExploreMore: LocalizedString;
  miscYouMightLike: LocalizedString;
  miscYouMightLikeDesc: LocalizedText;
  miscGroundFloor: LocalizedString;
  miscUpperFloor: LocalizedString;
  miscAttic: LocalizedString;
  miscFloor: LocalizedString;
  miscVillaSpecs: LocalizedString;
  miscDetailsComing: LocalizedString;
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
  locationTitle: LocalizedString;
  locationDescription: LocalizedText;
  locationHighlights: Array<{
    title: LocalizedString;
    description: LocalizedText;
  }>;
  residencesTitle: LocalizedString;
  residencesDescription: LocalizedText;
  masterplanTitle: LocalizedString;
  masterplanDescription: LocalizedText;
  lifestyleTitle: LocalizedString;
  inlineContactEyebrow: LocalizedString;
  inlineContactTitle: LocalizedString;
  inlineContactDescription: LocalizedText;
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
  collectionEyebrow: LocalizedString;
  collectionTitle: LocalizedString;
  collectionDescription: LocalizedText;
  compareEyebrow: LocalizedString;
  compareTitle: LocalizedString;
  compareDescription: LocalizedText;
  upgradesEyebrow: LocalizedString;
  upgradesTitle: LocalizedString;
  upgradesDescription: LocalizedText;
  faqEyebrow: LocalizedString;
  faqTitle: LocalizedString;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface LocationPage {
  heroImage: SanityImage;
  heroTitle: LocalizedString;
  whySection: LocalizedText;
  distances: Array<{ place: string; time: string; lat: number; lng: number }>;
  whyEyebrow: LocalizedString;
  whyTitle: LocalizedString;
  whyFeatures: Array<{
    icon: string;
    heading: LocalizedString;
    description: LocalizedText;
  }>;
  highlightTitle: LocalizedString;
  highlightDescription: LocalizedText;
  highlights: Array<{
    title: LocalizedString;
    description: LocalizedText;
  }>;
  distanceEyebrow: LocalizedString;
  distanceTitle: LocalizedString;
  distanceDescription: LocalizedText;
  distanceMarkers: Array<{
    place: LocalizedString;
    time: LocalizedString;
    detail: LocalizedString;
    lat: number;
    lng: number;
  }>;
  airportEyebrow: LocalizedString;
  airportTitle: LocalizedString;
  airportDescription: LocalizedText;
  airports: Array<{
    code: string;
    name: LocalizedString;
    city: LocalizedString;
    travelTime: LocalizedString;
    destinations: number;
    countries: number;
    note: LocalizedString;
    isNearest: boolean;
  }>;
  experiencesEyebrow: LocalizedString;
  experiencesTitle: LocalizedString;
  experiencesDescription: LocalizedText;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface MasterplanPage {
  heroImage: SanityImage;
  heroTitle: LocalizedString;
  introCopy: LocalizedText;
  statTotalLabel: LocalizedString;
  statAvailableLabel: LocalizedString;
  statReservedLabel: LocalizedString;
  statSoldLabel: LocalizedString;
  statPlotsLabel: LocalizedString;
  explorerEyebrow: LocalizedString;
  explorerTitle: LocalizedString;
  explorerDescription: LocalizedText;
  inventoryEyebrow: LocalizedString;
  inventoryTitle: LocalizedString;
  inventoryDescription: LocalizedText;
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface ContactPage {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  responsePromise: LocalizedString;
  officeInfo: LocalizedText;
  directEyebrow: LocalizedString;
  directTitle: LocalizedString;
  directDescription: LocalizedText;
  labelEmail: LocalizedString;
  labelPhone: LocalizedString;
  labelOfficeHours: LocalizedString;
  budgetOptions: LocalizedString[];
  timelineOptions: LocalizedString[];
  seoTitle: LocalizedString;
  seoDescription: LocalizedText;
}

export interface AboutPage {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroImage: SanityImage;
  storyEyebrow: LocalizedString;
  storyTitle: LocalizedString;
  storyContent: LocalizedText;
  stats: Array<{
    value: string;
    label: LocalizedString;
  }>;
  valuesEyebrow: LocalizedString;
  valuesTitle: LocalizedString;
  values: Array<{
    icon: string;
    title: LocalizedString;
    description: LocalizedText;
  }>;
  foundersEyebrow: LocalizedString;
  founders: Array<{
    name: string;
    role: LocalizedString;
    bio: LocalizedText;
    photo: SanityImage;
  }>;
  ctaTitle: LocalizedString;
  ctaSubtitle: LocalizedString;
  ctaButton: LocalizedString;
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
