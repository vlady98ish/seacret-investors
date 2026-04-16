import { defineField, defineType } from "sanity";
import { LocaleInput } from "../components/locale-input";

export const localeStringType = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  components: { input: LocaleInput },
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "he", title: "Hebrew", type: "string" }),
    defineField({ name: "ru", title: "Russian", type: "string" }),
    defineField({ name: "el", title: "Greek", type: "string" }),
  ],
});
