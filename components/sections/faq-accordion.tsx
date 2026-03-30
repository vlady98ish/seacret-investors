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

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items?.length) return null;

  const faqs = items;

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
