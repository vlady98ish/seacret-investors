import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "projectName", title: "Project Name", type: "string" }),
    defineField({ name: "salesEmail", title: "Sales Email", type: "string" }),
    defineField({ name: "salesPhone", title: "Sales Phone", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string" }),
    defineField({ name: "officeHours", title: "Office Hours", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
    defineField({
      name: "brochurePdf",
      title: "Brochure PDF",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "file" }),
        defineField({ name: "he", title: "Hebrew", type: "file" }),
        defineField({ name: "ru", title: "Russian", type: "file" }),
        defineField({ name: "el", title: "Greek", type: "file" }),
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "object",
      fields: [
        defineField({ name: "privacyPolicy", title: "Privacy Policy URL", type: "url" }),
        defineField({ name: "termsConditions", title: "Terms & Conditions URL", type: "url" }),
        defineField({ name: "cookiePolicy", title: "Cookie Policy URL", type: "url" }),
      ],
    }),
  ],
});
