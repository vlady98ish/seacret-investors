import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, description: "Photo representing this experience." }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["culture", "nature", "gastronomy"] },
      description: "Used for filtering experiences on the location page.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
});
