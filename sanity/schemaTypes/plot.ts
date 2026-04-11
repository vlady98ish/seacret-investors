import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const plotType = defineType({
  name: "plot",
  title: "Plot",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "layout", title: "Layout Plan" },
    { name: "position", title: "Position" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // General
    defineField({ name: "name", title: "Name", type: "string", group: "general", validation: (r) => r.required().error("Every plot needs a name (e.g. 'Plot A').") }),
    defineField({ name: "summary", title: "Summary", type: "localeText", group: "general" }),
    defineField({ name: "aerialImage", title: "Aerial Image", type: "image", options: { hotspot: true }, group: "general" }),

    // Layout Plan
    defineField({
      name: "layoutImages",
      title: "Layout Plan Images",
      type: "array",
      group: "layout",
      description: "Architectural site plan images. One per floor (e.g. Ground Floor, 1st Floor).",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Floor Label", type: "string", description: 'e.g. "Ground Floor", "1st Floor". Leave empty for single-floor plots.' }),
            defineField({ name: "image", title: "Plan Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "label", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Floor plan", media };
            },
          },
        },
      ],
    }),
    defineField({
      name: "unitPositions",
      title: "Unit Positions on Layout",
      type: "array",
      group: "layout",
      description: "Position and size of each unit hotspot on the layout plan image (percentages).",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "unit", title: "Unit", type: "reference", to: [{ type: "unit" }], validation: (r) => r.required() }),
            defineField({ name: "floorIndex", title: "Floor Index", type: "number", description: "0 = first image, 1 = second image, etc.", initialValue: 0 }),
            defineField({ name: "x", title: "X (%)", type: "number", validation: (r) => r.min(0).max(100) }),
            defineField({ name: "y", title: "Y (%)", type: "number", validation: (r) => r.min(0).max(100) }),
            defineField({ name: "width", title: "Width (%)", type: "number", validation: (r) => r.min(1).max(100) }),
            defineField({ name: "height", title: "Height (%)", type: "number", validation: (r) => r.min(1).max(100) }),
          ],
          preview: {
            select: { unitNum: "unit.unitNumber", floorIndex: "floorIndex" },
            prepare({ unitNum, floorIndex }) {
              return { title: `Unit ${unitNum ?? "?"}`, subtitle: `Floor ${floorIndex ?? 0}` };
            },
          },
        },
      ],
    }),

    // Position
    defineField({
      name: "positionData",
      title: "Position on Masterplan",
      type: "object",
      group: "position",
      description: "Coordinates for placing this plot on the masterplan image.",
      fields: [
        defineField({ name: "x", title: "X (%)", type: "number", description: "Horizontal position (0 = left, 100 = right)." }),
        defineField({ name: "y", title: "Y (%)", type: "number", description: "Vertical position (0 = top, 100 = bottom)." }),
      ],
    }),

    // Settings
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", group: "settings", initialValue: 0, description: "Lower numbers appear first in lists." }),
  ],
  preview: { select: { title: "name" } },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
