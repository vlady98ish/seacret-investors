import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  PackageIcon,
} from "@sanity/icons";

// Singleton types — open directly in edit mode, no list
const singletonTypes = new Set([
  "homePage",
  "residencesPage",
  "masterplanPage",
  "locationPage",
  "aboutPage",
  "contactPage",
  "siteSettings",
  "uiStrings",
  "developer",
]);

export const structure: StructureResolver = (S) => {
  const singleton = (typeId: string, title: string) =>
    S.listItem()
      .title(title)
      .id(typeId)
      .child(S.document().schemaType(typeId).documentId(typeId));

  const documentList = (
    typeId: string,
    title: string,
    ordering?: { field: string; direction: "asc" | "desc" },
  ) => {
    let list = S.documentTypeList(typeId).title(title);
    if (ordering) {
      list = list.defaultOrdering([ordering]);
    }
    return S.listItem().title(title).child(list);
  };

  return S.list()
    .title("Content")
    .items([
      // — Pages —
      S.listItem()
        .title("Pages")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton("homePage", "Home"),
              singleton("residencesPage", "Residences"),
              singleton("masterplanPage", "Masterplan"),
              singleton("locationPage", "Location"),
              singleton("aboutPage", "About"),
              singleton("contactPage", "Contact"),
            ]),
        ),

      S.divider(),

      // — Properties —
      S.listItem()
        .title("Properties")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Properties")
            .items([
              documentList("villa", "Villa Types", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("unit", "Units", {
                field: "unitNumber",
                direction: "asc",
              }),
              documentList("plot", "Plots", {
                field: "sortOrder",
                direction: "asc",
              }),
            ]),
        ),

      S.divider(),

      // — Content —
      S.listItem()
        .title("Content")
        .icon(PackageIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              documentList("upgrade", "Upgrades", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("experience", "Experiences", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("faq", "FAQ", {
                field: "sortOrder",
                direction: "asc",
              }),
              singleton("developer", "Developer"),
            ]),
        ),

      S.divider(),

      // — Settings —
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings")
            .items([
              singleton("siteSettings", "Site Settings"),
              singleton("uiStrings", "UI Strings"),
            ]),
        ),

      S.divider(),

      // — Leads —
      S.listItem()
        .title("Leads")
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList("leadSubmission")
            .title("Submissions")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
    ]);
};

// Filter singletons out of "new document" options
export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !singletonTypes.has(templateId));
