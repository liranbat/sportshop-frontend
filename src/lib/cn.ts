import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom font-size tokens defined in @theme (styles/index.css).
// Without this, twMerge treats `text-{anything}` as text-color and silently
// drops the size token when combined with a color token in one `cn()` call.
const CUSTOM_TEXT_TOKENS = [
  "heading-xl",
  "heading-brand",
  "heading-l",
  "heading-m",
  "body-large",
  "body-regular",
  "body-small",
  "body-small-bold",
  "caption-regular",
];

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: CUSTOM_TEXT_TOKENS }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}
