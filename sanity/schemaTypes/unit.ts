import { defineField, defineType } from "sanity";

export const unitType = defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  fields: [
    defineField({ name: "unitNumber", title: "Unit Number", type: "string", validation: (r) => r.required() }),
    defineField({ name: "plot", title: "Plot", type: "reference", to: [{ type: "plot" }], validation: (r) => r.required() }),
    defineField({ name: "villaType", title: "Villa Type", type: "reference", to: [{ type: "villa" }], validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
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
    defineField({ name: "totalArea", title: "Total Area (m²)", type: "number", validation: (r) => r.required().positive() }),
    defineField({ name: "outdoorArea", title: "Outdoor Area (m²)", type: "number" }),
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "groundFloor", title: "Ground Floor (m²)", type: "number" }),
    defineField({ name: "upperFloor", title: "Upper Floor (m²)", type: "number" }),
    defineField({ name: "attic", title: "Attic (m²)", type: "number" }),
    defineField({ name: "balcony", title: "Balcony (m²)", type: "number" }),
    defineField({ name: "roofTerrace", title: "Roof Terrace (m²)", type: "number" }),
    defineField({ name: "hasPool", title: "Swimming Pool", type: "boolean", initialValue: false }),
    defineField({ name: "hasParking", title: "Parking Spot", type: "boolean", initialValue: true }),
    defineField({
      name: "floorLevel",
      title: "Floor Level",
      type: "string",
      options: { list: [{ title: "Ground", value: "ground" }, { title: "Upper", value: "upper" }] },
      hidden: ({ document }) => !document?.unitNumber?.toString().match(/^[EF]/),
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
