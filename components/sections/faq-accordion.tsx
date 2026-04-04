"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items?.length) return null;

  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-[var(--color-stone)]">
      {items.map((faq, index) => (
        <Accordion.Item key={index} value={`faq-${index}`}>
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left group">
                <span className="text-h3 text-base font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 flex-shrink-0 text-[var(--color-deep-teal)] transition-transform duration-200",
                    "group-data-[state=open]:rotate-180"
                  )}
                  aria-hidden="true"
                />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-body-muted pb-5">{faq.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
