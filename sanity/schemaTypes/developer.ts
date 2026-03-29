import { defineField, defineType } from "sanity";

export const developerType = defineType({
  name: "developer",
  title: "Developer",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "credentials", title: "Credentials", type: "localeText" }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role", type: "localeString" }),
          defineField({ name: "photo", title: "Photo", type: "image" }),
        ],
      }],
    }),
  ],
});
