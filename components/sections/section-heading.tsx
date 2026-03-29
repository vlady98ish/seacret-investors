import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="text-h2 mt-3">{title}</h2>
      {description && (
        <p className={cn("text-body-muted mt-4 max-w-2xl", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
