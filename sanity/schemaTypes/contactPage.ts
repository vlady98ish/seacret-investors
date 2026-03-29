import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "responsePromise", title: "Response Promise Text", type: "localeString" }),
    defineField({ name: "officeInfo", title: "Office Info", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
