import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import { requireAllTranslations } from "../lib/validation";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "office", title: "Office & Direct Contact" },
    { name: "labels", title: "Labels" },
    { name: "options", title: "Form Options" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero", validation: requireAllTranslations }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero" }),
    defineField({ name: "responsePromise", title: "Response Promise", type: "localeString", group: "hero", description: "Text like 'We'll get back to you within 24 hours'." }),

    // Office
    defineField({ name: "officeInfo", title: "Office Info", type: "localeText", group: "office", description: "Office address and opening hours text." }),
    defineField({ name: "directEyebrow", title: "Direct Contact Eyebrow", type: "localeString", group: "office" }),
    defineField({ name: "directTitle", title: "Direct Contact Title", type: "localeString", group: "office" }),
    defineField({ name: "directDescription", title: "Direct Contact Description", type: "localeText", group: "office" }),

    // Labels
    defineField({ name: "labelEmail", title: "Label: Email", type: "localeString", group: "labels" }),
    defineField({ name: "labelPhone", title: "Label: Phone", type: "localeString", group: "labels" }),
    defineField({ name: "labelOfficeHours", title: "Label: Office Hours", type: "localeString", group: "labels" }),

    // Form options
    defineField({
      name: "budgetOptions",
      title: "Budget Options",
      type: "array",
      group: "options",
      description: "Options shown in the budget dropdown on the contact form.",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "timelineOptions",
      title: "Timeline Options",
      type: "array",
      group: "options",
      description: "Options shown in the timeline dropdown on the contact form.",
      of: [{ type: "localeString" }],
    }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results.", validation: requireAllTranslations }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended).", validation: requireAllTranslations }),
  ],
});
