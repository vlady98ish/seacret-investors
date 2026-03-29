import type { Locale } from "@/lib/i18n";

const en = {
  nav: {
    home: "Home",
    residences: "Residences",
    masterplan: "Masterplan",
    location: "Location",
    about: "About",
    contact: "Contact",
  },
  hero: {
    tagline: "Hidden from many,",
    subtitle: "perfect for few",
    cta: "Explore Residences",
    ctaSecondary: "Request a Tour",
  },
  sections: {
    concept: "The Concept",
    location: "The Location",
    lifestyle: "Lifestyle",
    residences: "The Residences",
    masterplan: "The Masterplan",
    upgrades: "Upgrades",
    experiences: "Experiences",
  },
  cta: {
    title: "Discover Your Sea'cret",
    subtitle: "From €150K · Only 39 exclusive residences",
    button: "Schedule a Viewing",
    viewAll: "View All Residences",
    exploreLocation: "Explore Location",
    exploreMasterplan: "Explore the Masterplan",
    requestTour: "Request a Tour",
    downloadBrochure: "Download Brochure",
  },
  status: {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    soldOut: "Sold Out",
  },
  specs: {
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    totalArea: "Total Area",
    outdoorArea: "Outdoor Area",
    pool: "Swimming Pool",
    parking: "Parking",
    yes: "Yes",
    no: "No",
  },
  form: {
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    interest: "Interest",
    message: "Message",
    submit: "Send Request",
    success: "Thank you! We'll be in touch within 24 hours.",
    error: "Something went wrong. Please try again.",
    gdpr: "I agree to the Privacy Policy and consent to being contacted",
    selectOne: "Select one",
  },
  filters: {
    filterBy: "Filter by",
    sortBy: "Sort by",
    all: "All",
    bedroomsLabel: "Bedrooms",
    sizeLabel: "Size",
    availableOnly: "Available only",
    priceLowHigh: "Price: Low to High",
    sizeSmallLarge: "Size: Small to Large",
  },
  contact: {
    getInTouch: "Get in Touch",
    readyToDiscover: "Ready to discover your Sea'cret?",
    responsePromise: "A member of our team will contact you within 24 hours.",
    whatsapp: "WhatsApp Us",
    step1: "What are you interested in?",
    step2: "Your details",
    step3: "Additional info",
    generalInquiry: "General Inquiry",
    budgetRange: "Budget Range",
    timeline: "Timeline",
  },
  pricing: {
    from: "From",
    contactForPricing: "Contact for pricing",
  },
};

type Dictionary = typeof en;

export function getDictionary(_locale: Locale): Dictionary {
  // All locales fall back to English for UI chrome
  // CMS provides real localized content
  return en;
}
