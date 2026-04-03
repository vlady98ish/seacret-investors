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

  return buildPageMetadata(null, locale as Locale, "/terms", {
    title: "Terms of Service | Sea'cret Residences Chiliadou",
    description:
      "Terms of Service governing the use of the Sea'cret Residences website.",
  });
}

const SITE_URL = "https://seacret-residences.com";

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <PageHero title="Terms of Service" compact />
      <article className="section-shell py-16 sm:py-24">
        <div className="legal-content mx-auto max-w-3xl">
          <p className="text-sm text-[var(--color-muted)]">Last updated: April 3, 2026</p>

          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {SITE_URL} (the
            &ldquo;Website&rdquo;), owned and operated by <strong>K HOLDINGS I K E</strong> under the
            brand names <strong>Live Better Group</strong> and{" "}
            <strong>Sea&apos;cret Residences</strong>.
          </p>

          <h2>1. Description of Services</h2>
          <p>
            The Website provides information on real estate and investment opportunities at Sea&apos;cret
            Residences in Chiliadou, Greece, and enables users to submit inquiries for contact or
            consultation.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use this Website. By using the Website, you agree to
            provide accurate information and to use the Website in a lawful manner.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Misuse the Website or its services</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to disrupt Website operations or security</li>
            <li>Use the Website for any unlawful purpose</li>
          </ul>

          <h2>4. Communications Consent</h2>
          <p>By submitting a contact form on the Website, you consent to receiving:</p>
          <ul>
            <li>Manual phone calls in response to your inquiry</li>
            <li>Automated confirmation emails</li>
            <li>Marketing emails (you may opt out at any time)</li>
          </ul>

          <h2>5. Privacy Policy</h2>
          <p>
            Your use of the Website is also governed by our{" "}
            <a href={`/${locale}/privacy-policy`}>Privacy Policy</a>
            , which describes how we collect, use, and protect your personal data.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on this Website — including text, images, logos, graphics, and design — is owned
            by K HOLDINGS I K E or its licensors and is protected by applicable intellectual property
            laws. You may not copy, reproduce, or distribute any content without prior written
            permission.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Website is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no
            warranties, express or implied, regarding the accuracy, completeness, or reliability of the
            content. Information about properties, pricing, and availability is subject to change without
            notice and does not constitute a binding offer.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, K HOLDINGS I K E shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of the Website
            or reliance on its content.
          </p>

          <h2>9. Third-Party Services</h2>
          <p>
            The Website may contain links to third-party websites or use third-party tools and services.
            We are not responsible for the content, privacy practices, or availability of any third-party
            sites or services.
          </p>

          <h2>10. Modifications</h2>
          <p>
            We reserve the right to update or modify these Terms at any time. Changes will be posted on
            this page with an updated revision date. Continued use of the Website after any changes
            constitutes acceptance of the revised Terms.
          </p>

          <h2>11. Termination</h2>
          <p>
            We may restrict or terminate your access to the Website at any time for violations of these
            Terms. You may stop using the Website at any time.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of Greece. Any disputes
            arising from these Terms shall be subject to the exclusive jurisdiction of the courts of
            Patras, Greece.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            <strong>K HOLDINGS I K E</strong>
            <br />
            Brand: Live Better Group / Sea&apos;cret Residences
          </p>
          <p>
            Phone: <a href="tel:+306931843439">+30 693 1843439</a>
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
