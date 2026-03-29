import { defineField, defineType } from "sanity";

export const localeTextType = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
    defineField({ name: "he", title: "Hebrew", type: "text", rows: 4 }),
    defineField({ name: "ru", title: "Russian", type: "text", rows: 4 }),
    defineField({ name: "el", title: "Greek", type: "text", rows: 4 }),
  ],
});
