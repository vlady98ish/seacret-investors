"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

const FALLBACK_FAQS: FAQItem[] = [
  {
    question: "Is this property eligible for Greece's Golden Visa program?",
    answer: "Yes, the Greek Golden Visa program grants residency permits to non-EU nationals who invest in Greek real estate. Our residences qualify for this program. Contact us for current minimum investment thresholds and requirements.",
  },
  {
    question: "What is the expected delivery timeline?",
    answer: "Construction is progressing on schedule. Current units are in various stages of completion. Contact us for the latest construction timeline and expected delivery dates for specific villa types.",
  },
  {
    question: "Can I rent out my property when not in use?",
    answer: "Absolutely. Chiliadou's growing tourism appeal makes short-term rental a viable income stream. We can connect you with property management services that handle everything from bookings to maintenance.",
  },
  {
    question: "What financing options are available?",
    answer: "We work with several Greek and international banks that offer mortgage financing for foreign buyers. Our team can guide you through the process and connect you with the right financial advisors.",
  },
  {
    question: "What upgrades are available?",
    answer: "Each residence can be customized with premium upgrades including private swimming pools, outdoor jacuzzis, saunas, BBQ areas, smart home systems, security systems, and indoor fireplaces. Contact us for pricing.",
  },
];

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = items.length > 0 ? items : FALLBACK_FAQS;

  return (
    <div className="mx-auto max-w-3xl divide-y divide-[var(--color-stone)]">
      {faqs.map((faq, index) => (
        <div key={index}>
          <button
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="text-h3 text-base font-medium">{faq.question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 flex-shrink-0 text-[var(--color-deep-teal)] transition-transform duration-200",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96 pb-5" : "max-h-0"
            )}
          >
            <p className="text-body-muted">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
