import { useLanguageFilterStudioContext } from "@sanity/language-filter";
import type { ObjectInputProps } from "sanity";

export function LocaleInput(props: ObjectInputProps) {
  const { selectedLanguageIds } = useLanguageFilterStudioContext();

  const filtered = {
    ...props,
    members: props.members.filter(
      (m) => m.kind !== "field" || selectedLanguageIds.includes(m.name),
    ),
  };

  return props.renderDefault(filtered);
}
