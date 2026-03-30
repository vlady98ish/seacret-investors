import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["investment", "construction", "legal", "lifestyle", "general"] },
      description: "Groups FAQs by topic on the residences page.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
