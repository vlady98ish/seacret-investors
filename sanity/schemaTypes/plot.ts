import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const plotType = defineType({
  name: "plot",
  title: "Plot",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "position", title: "Position" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // General
    defineField({ name: "name", title: "Name", type: "string", group: "general", validation: (r) => r.required().error("Every plot needs a name (e.g. 'Plot A').") }),
    defineField({ name: "summary", title: "Summary", type: "localeText", group: "general" }),
    defineField({ name: "aerialImage", title: "Aerial Image", type: "image", options: { hotspot: true }, group: "general" }),

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
