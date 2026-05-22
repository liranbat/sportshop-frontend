import { useEffect, useRef, type RefObject } from "react";

// Calls `onOutside` whenever a mousedown happens outside the referenced element.
// Pass enabled=false (e.g. while a menu is closed) to skip attaching the global
// listener — keeps idle dropdowns from leaking work onto the document.
// The callback is held in a ref so callers don't have to wrap it in useCallback;
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  enabled: boolean = true,
): void {
  const callbackRef = useRef(onOutside);

  useEffect(() => {
    callbackRef.current = onOutside;
  });

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, enabled]);
}
