import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "brochures", title: "Brochures" },
    { name: "legal", title: "Legal" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // General
    defineField({ name: "projectName", title: "Project Name", type: "string", group: "general" }),
    defineField({ name: "salesEmail", title: "Sales Email", type: "string", group: "general", description: "Shown on the contact page and footer." }),
    defineField({ name: "salesPhone", title: "Sales Phone", type: "string", group: "general", description: "Include country code (e.g. +357 XXX XXXX)." }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string", group: "general", description: "Full number with country code, no spaces (e.g. 35799123456)." }),
    defineField({ name: "viberNumber", title: "Viber Number", type: "string", group: "general", description: "Full number with country code, no spaces (e.g. 306931843439)." }),
    defineField({ name: "officeHours", title: "Office Hours", type: "localeString", group: "general" }),
    defineField({ name: "officeAddress", title: "Office Address", type: "string", group: "general", description: "Full office address shown on the contact page." }),
    defineField({ name: "officeRegion", title: "Office Region", type: "string", group: "general", description: "City/region subtitle (e.g. Patras, Western Greece)." }),

    // Brochures
    defineField({
      name: "brochurePdf",
      title: "Brochure PDF",
      type: "object",
      group: "brochures",
      description: "Upload a brochure PDF for each language. Visitors download the version matching their language.",
      fields: [
        defineField({ name: "en", title: "English", type: "file" }),
        defineField({ name: "he", title: "Hebrew", type: "file" }),
        defineField({ name: "ru", title: "Russian", type: "file" }),
        defineField({ name: "el", title: "Greek", type: "file" }),
      ],
    }),

    // Legal
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "object",
      group: "legal",
      description: "URLs to legal documents. Shown in the footer.",
      fields: [
        defineField({ name: "privacyPolicy", title: "Privacy Policy URL", type: "url" }),
        defineField({ name: "termsConditions", title: "Terms & Conditions URL", type: "url" }),
        defineField({ name: "cookiePolicy", title: "Cookie Policy URL", type: "url" }),
      ],
    }),

    // SEO
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Default meta description used when a page doesn't have its own." }),
  ],
});
