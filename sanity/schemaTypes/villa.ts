import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const villaType = defineType({
  name: "villa",
  title: "Villa Type",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "media", title: "Media" },
    { name: "specs", title: "Specs" },
  ],
  fields: [
    // General
    defineField({ name: "name", title: "Name", type: "string", group: "general", validation: (r) => r.required().error("Every villa type needs a name (e.g. 'Villa Alpha').") }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, group: "general", validation: (r) => r.required(), description: "URL-friendly name. Click 'Generate' to create from the name." }),
    defineField({ name: "label", title: "Label", type: "localeString", group: "general", description: "Short marketing label shown on villa cards." }),
    defineField({ name: "summary", title: "Summary", type: "localeText", group: "general", description: "Brief description of this villa type." }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "general",
      description: "Key selling points (e.g. 'Private pool', 'Sea view').",
      of: [{ type: "localeString" }],
    }),

    // Media
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "media", validation: (r) => r.required().error("Please add a main photo for this villa type.") }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      group: "media",
      description: "Additional photos shown in the villa detail gallery.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "floorPlanImages",
      title: "Floor Plan Images",
      type: "array",
      group: "media",
      description: "Floor plan drawings or diagrams.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tourUrl", title: "3D Tour URL", type: "url", group: "media", description: "Link to a 3D virtual tour (e.g. Matterport)." }),

    // Specs
    defineField({ name: "typicalBedrooms", title: "Typical Bedrooms", type: "number", group: "specs" }),
    defineField({ name: "typicalBathrooms", title: "Typical Bathrooms", type: "number", group: "specs" }),
    defineField({ name: "areaRange", title: "Area Range", type: "string", group: "specs", description: "e.g. '130-134' — the range of total area across units of this type." }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", group: "specs", initialValue: 0, description: "Lower numbers appear first in lists." }),
  ],
  preview: {
    select: { title: "name", subtitle: "areaRange" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `${subtitle} m²` : "" };
    },
  },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
