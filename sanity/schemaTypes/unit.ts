import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const unitType = defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "areas", title: "Areas" },
    { name: "features", title: "Features" },
  ],
  fields: [
    // General
    defineField({ name: "unitNumber", title: "Unit Number", type: "string", group: "general", validation: (r) => r.required().error("Every unit needs a unique identifier (e.g. A1, B2).") }),
    defineField({ name: "plot", title: "Plot", type: "reference", to: [{ type: "plot" }], group: "general", validation: (r) => r.required().error("Please select the plot this unit is on.") }),
    defineField({ name: "villaType", title: "Villa Type", type: "reference", to: [{ type: "villa" }], group: "general", validation: (r) => r.required().error("Please select the villa type for this unit.") }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (r) => r.required(),
    }),

    // Areas
    defineField({ name: "totalArea", title: "Total Area (m²)", type: "number", group: "areas", validation: (r) => r.required().positive().error("Total area is required and must be a positive number.") }),
    defineField({ name: "outdoorArea", title: "Outdoor Area (m²)", type: "number", group: "areas" }),
    defineField({ name: "groundFloor", title: "Ground Floor (m²)", type: "number", group: "areas" }),
    defineField({ name: "upperFloor", title: "Upper Floor (m²)", type: "number", group: "areas" }),
    defineField({ name: "attic", title: "Attic (m²)", type: "number", group: "areas" }),
    defineField({ name: "balcony", title: "Balcony (m²)", type: "number", group: "areas" }),
    defineField({ name: "roofTerrace", title: "Roof Terrace (m²)", type: "number", group: "areas" }),

    // Features
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number", group: "features", validation: (r) => r.required().min(1) }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number", group: "features", validation: (r) => r.required().min(1) }),
    defineField({ name: "hasPool", title: "Swimming Pool", type: "boolean", group: "features", initialValue: false }),
    defineField({ name: "hasParking", title: "Parking Spot", type: "boolean", group: "features", initialValue: true }),
    defineField({
      name: "floorLevel",
      title: "Floor Level",
      type: "string",
      group: "features",
      options: { list: [{ title: "Ground", value: "ground" }, { title: "Upper", value: "upper" }] },
      hidden: ({ document }) => !document?.unitNumber?.toString().match(/^[EF]/),
      description: "Only applies to E and F unit types.",
    }),
  ],
  preview: {
    select: { title: "unitNumber", villaName: "villaType.name", plotName: "plot.name", status: "status" },
    prepare({ title, villaName, plotName, status }) {
      return { title: `${title} — ${villaName ?? ""}`, subtitle: `${plotName ?? ""} · ${status ?? ""}` };
    },
  },
  orderings: [{ title: "Unit Number", name: "unitNumber", by: [{ field: "unitNumber", direction: "asc" }] }],
});
