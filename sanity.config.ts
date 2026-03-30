import { languageFilter } from "@sanity/language-filter";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { newDocumentOptions, structure } from "./sanity/desk/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Sea'cret Residences Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    languageFilter({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "he", title: "Hebrew" },
        { id: "ru", title: "Russian" },
        { id: "el", title: "Greek" },
      ],
      defaultLanguages: ["en"],
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !["localeString", "localeText"].includes(enclosingType.name) ||
        selectedLanguageIds.includes(member.name),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions,
  },
});
