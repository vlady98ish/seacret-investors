import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  /** Extra classes for the title (e.g. uppercase for editorial masterplan style). */
  titleClassName?: string;
  /** Extra classes for description wrapper (e.g. max-width overrides). */
  descriptionClassName?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", titleClassName, descriptionClassName }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h2 className={cn("text-h2 mt-3", titleClassName)}>{title}</h2>}
      {description && (
        <p className={cn("text-body-muted mt-4 max-w-2xl", align === "center" && "mx-auto", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
