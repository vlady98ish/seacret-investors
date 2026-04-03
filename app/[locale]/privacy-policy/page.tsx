import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sections/page-hero";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return buildPageMetadata(null, locale as Locale, "/privacy-policy", {
    title: "Privacy Policy | Sea'cret Residences Chiliadou",
    description:
      "Privacy Policy for Sea'cret Residences — how we collect, use, and protect your personal data. GDPR and CCPA compliant.",
  });
}

const SITE_URL = "https://seacret-residences.com";

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <PageHero title="Privacy Policy" compact />
      <article className="section-shell py-16 sm:py-24">
        <div className="legal-content mx-auto max-w-3xl">
          <p className="text-sm text-[var(--color-muted)]">Last updated: April 3, 2026</p>

          <h2>Introduction</h2>
          <p>
            <strong>K HOLDINGS I K E</strong>, operating under the brand names{" "}
            <strong>Live Better Group</strong> and <strong>Sea&apos;cret Residences</strong>, provides
            this Privacy Policy to explain how personal data is collected, used, shared, and processed
            from visitors to {SITE_URL} (the &ldquo;Website&rdquo;). This policy complies with the
            General Data Protection Regulation (GDPR) of the European Union and the California Consumer
            Privacy Act / California Privacy Rights Act (CCPA/CPRA) of the United States.
          </p>
          <p>
            This policy applies globally to all visitors, including those in the European Economic Area
            (EEA), Israel, and the United States.
          </p>

          <h2>Personal Data We Collect</h2>

          <h3>Information You Provide</h3>
          <p>When you submit a form on our Website, you may provide:</p>
          <ul>
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Free-text messages</li>
          </ul>
          <p>Fields marked as required must be completed for us to process your request.</p>

          <h3>Automatically Collected Data</h3>
          <p>
            Our Website may use tracking technologies and analytics services to monitor Website activity.
            When such services are active, we will update this section accordingly and provide information
            about specific cookies and their retention periods.
          </p>

          <h2>How We Use Your Data</h2>

          <h3>Managing Contact Requests</h3>
          <p>
            We use your data to confirm receipt of inquiries, respond to your messages, and provide
            information about real estate investment opportunities at Sea&apos;cret Residences.
          </p>
          <p>
            <strong>EU Legal Basis:</strong> Consent; legitimate interest; pre-contractual steps.
          </p>
          <p>
            <strong>US Basis:</strong> Consent and business purposes.
          </p>

          <h3>Promotional Communications</h3>
          <p>
            With your consent, we may add you to our mailing list and send marketing communications
            about our projects and services.
          </p>
          <p>
            <strong>EU Legal Basis:</strong> Consent (withdrawable at any time).
          </p>
          <p>
            <strong>US Basis:</strong> Consent and legitimate business purposes.
          </p>

          <h3>Website Improvement</h3>
          <p>
            We may monitor performance and usage patterns to enhance your experience on the Website.
          </p>
          <p>
            <strong>EU Legal Basis:</strong> Consent.
          </p>
          <p>
            <strong>US Basis:</strong> Legitimate interest.
          </p>

          <h3>Legal Protection</h3>
          <p>We may process data to manage disputes and seek legal advice.</p>
          <p>
            <strong>EU Legal Basis:</strong> Legitimate interest.
          </p>

          <h3>Compliance</h3>
          <p>
            We may process data to respond to government requests, prevent illegal activity, and fulfill
            statutory obligations.
          </p>
          <p>
            <strong>EU Legal Basis:</strong> Legal obligation.
          </p>

          <h2>Data Sharing</h2>
          <p>We may share your data with:</p>
          <ul>
            <li>Service providers (hosting, email delivery)</li>
            <li>Legal authorities (if required by law)</li>
            <li>Professional advisors</li>
            <li>Parties involved in mergers or corporate transactions</li>
          </ul>
          <p>
            All third parties are required to follow appropriate data protection safeguards.{" "}
            <strong>We do not sell your personal data for monetary gain.</strong>
          </p>

          <h2>Cross-Border Transfers</h2>
          <ul>
            <li>
              <strong>Israel:</strong> Transfers comply with Israeli Privacy Protection Authority
              requirements.
            </li>
            <li>
              <strong>EEA:</strong> Transfers are based on adequacy decisions or Standard Contractual
              Clauses (SCCs).
            </li>
            <li>
              <strong>United States:</strong> US residents&apos; data may be processed in the EU, Israel,
              or other regions with potentially different privacy protections.
            </li>
          </ul>

          <h2>Data Retention</h2>
          <p>We retain personal data only as long as necessary to:</p>
          <ul>
            <li>Respond to your inquiries</li>
            <li>Maintain ongoing communication</li>
            <li>Fulfill legal obligations</li>
            <li>Defend legal claims</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data.
            However, no method of transmission over the Internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>

          <h2>Your Rights</h2>

          <h3>Rights Under GDPR (EEA Residents)</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Correct inaccurate information</li>
            <li>Object to certain processing</li>
            <li>Request processing restrictions</li>
            <li>Withdraw consent at any time</li>
            <li>Data portability</li>
            <li>Lodge a complaint with your national data protection authority</li>
          </ul>

          <h3>Rights Under CCPA/CPRA (California Residents)</h3>
          <p>California residents may:</p>
          <ul>
            <li>Request disclosure of data collected about them</li>
            <li>Request deletion of their personal data</li>
            <li>Opt out of the sharing of data for targeted advertising</li>
            <li>Request correction of inaccurate data</li>
          </ul>
          <p>
            We will not discriminate against you for exercising any of these rights.
          </p>

          <h2>Withdrawal of Consent</h2>
          <p>
            You may withdraw your consent for marketing communications at any time by contacting us at:{" "}
            <a href="mailto:lkholdingsike@gmail.com">lkholdingsike@gmail.com</a>
          </p>

          <h2>Minors</h2>
          <p>
            This Website is not intended for users under 18 years of age. We do not knowingly collect
            personal data from minors.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>

          <h2>Contact Information</h2>
          <p>
            <strong>K HOLDINGS I K E</strong>
            <br />
            Brand: Live Better Group / Sea&apos;cret Residences
          </p>
          <p>
            Phone: <a href="tel:+306931843439">+30 6931 843 439</a>
            <br />
            Email: <a href="mailto:lkholdingsike@gmail.com">lkholdingsike@gmail.com</a>
            <br />
            Address: Georg. Olimpiou 33-35, Patras, Greece 26222
          </p>
        </div>
      </article>
    </>
  );
}
