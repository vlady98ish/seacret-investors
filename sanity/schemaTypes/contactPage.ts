import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString" }),
    defineField({ name: "responsePromise", title: "Response Promise Text", type: "localeString" }),
    defineField({ name: "officeInfo", title: "Office Info", type: "localeText" }),
    defineField({ name: "directEyebrow", title: "Direct Contact Eyebrow", type: "localeString" }),
    defineField({ name: "directTitle", title: "Direct Contact Title", type: "localeString" }),
    defineField({ name: "directDescription", title: "Direct Contact Description", type: "localeText" }),
    defineField({ name: "labelEmail", title: "Label: Email", type: "localeString" }),
    defineField({ name: "labelPhone", title: "Label: Phone", type: "localeString" }),
    defineField({ name: "labelOfficeHours", title: "Label: Office Hours", type: "localeString" }),
    defineField({
      name: "budgetOptions",
      title: "Budget Options",
      type: "array",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "timelineOptions",
      title: "Timeline Options",
      type: "array",
      of: [{ type: "localeString" }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
