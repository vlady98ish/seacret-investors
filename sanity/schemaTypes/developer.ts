import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const developerType = defineType({
  name: "developer",
  title: "Developer",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "localeText", description: "About the development company." }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "credentials", title: "Credentials", type: "localeText", description: "Licenses, certifications, or notable achievements." }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
      description: "Key team members shown on the website.",
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
