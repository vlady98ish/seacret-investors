import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  ...,
  featuredVillas[]->{ _id, name, slug, label, heroImage, typicalBedrooms, areaRange, sortOrder }
}`;

export const allVillasQuery = groq`*[_type == "villa"] | order(sortOrder asc){
  _id, name, slug, label, summary, heroImage, typicalBedrooms, typicalBathrooms, areaRange, sortOrder
}`;

export const villaBySlugQuery = groq`*[_type == "villa" && slug.current == $slug][0]{
  ...,
  "units": *[_type == "unit" && villaType._ref == ^._id]{
    _id, unitNumber, status, totalArea, outdoorArea, bedrooms, bathrooms, hasPool, hasParking,
    "plotName": plot->name
  } | order(unitNumber asc)
}`;

export const allPlotsQuery = groq`*[_type == "plot"] | order(sortOrder asc){
  _id, name, summary, aerialImage, positionData, sortOrder,
  "units": *[_type == "unit" && plot._ref == ^._id]{
    _id, unitNumber, status, totalArea, bedrooms, hasPool,
    "villaTypeName": villaType->name,
    "villaTypeSlug": villaType->slug.current
  } | order(unitNumber asc)
}`;

export const allUnitsQuery = groq`*[_type == "unit"] | order(unitNumber asc){
  _id, unitNumber, status, totalArea, bedrooms, bathrooms, hasPool,
  "plotName": plot->name,
  "villaTypeName": villaType->name,
  "villaTypeSlug": villaType->slug.current
}`;

export const availabilityStatsQuery = groq`{
  "total": count(*[_type == "unit"]),
  "available": count(*[_type == "unit" && status == "available"]),
  "reserved": count(*[_type == "unit" && status == "reserved"]),
  "sold": count(*[_type == "unit" && status == "sold"])
}`;

export const uiStringsQuery = groq`*[_type == "uiStrings"][0]`;
export const aboutPageQuery = groq`*[_type == "aboutPage"][0]`;
export const residencesPageQuery = groq`*[_type == "residencesPage"][0]`;
export const locationPageQuery = groq`*[_type == "locationPage"][0]`;
export const masterplanPageQuery = groq`*[_type == "masterplanPage"][0]`;
export const contactPageQuery = groq`*[_type == "contactPage"][0]`;

export const allUpgradesQuery = groq`*[_type == "upgrade"] | order(sortOrder asc)`;
export const allExperiencesQuery = groq`*[_type == "experience"] | order(sortOrder asc)`;
export const allFaqsQuery = groq`*[_type == "faq"] | order(sortOrder asc)`;
export const developerQuery = groq`*[_type == "developer"][0]`;
