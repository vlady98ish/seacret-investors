import { defineField, defineType } from "sanity";

export const leadSubmissionType = defineType({
  name: "leadSubmission",
  title: "Lead Submission",
  type: "document",
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "interest", title: "Interest", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "locale", title: "Locale", type: "string" }),
    defineField({ name: "source", title: "Source Page URL", type: "string" }),
    defineField({ name: "preferredVilla", title: "Preferred Villa", type: "string" }),
    defineField({ name: "budget", title: "Budget Range", type: "string" }),
    defineField({ name: "utmSource", title: "UTM Source", type: "string" }),
    defineField({ name: "utmMedium", title: "UTM Medium", type: "string" }),
    defineField({ name: "utmCampaign", title: "UTM Campaign", type: "string" }),
    defineField({ name: "gdprConsent", title: "GDPR Consent", type: "boolean" }),
    defineField({ name: "countryCode", title: "Country Code", type: "string" }),
  ],
  preview: { select: { title: "fullName", subtitle: "email" } },
});
