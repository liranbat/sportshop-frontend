export type SortDirection = "asc" | "desc";

// bundles a feature's page-size tuple + its default + a matching type-guard.
export function createPageSizeOptions<const T extends readonly number[]>(
  options: T,
  defaultSize: T[number],
): {
  PAGE_SIZE_OPTIONS: T;
  DEFAULT_PAGE_SIZE: T[number];
  isPageSize: (value: number) => value is T[number];
} {
  const set = new Set<number>(options);
  return {
    PAGE_SIZE_OPTIONS: options,
    DEFAULT_PAGE_SIZE: defaultSize,
    isPageSize: (value: number): value is T[number] => set.has(value),
  };
}

// mutates sortField/sortDirection only when enabled. field is widened to string so each feature's union fits.
export function wireSort<P extends object>(
  params: P,
  enabled: boolean,
  field: string,
  direction: SortDirection,
): void {
  if (enabled) {
    const p = params as Record<string, unknown>;
    p.sortField = field;
    p.sortDirection = direction;
  }
}

// writes the trimmed value only when non-empty. omitting a key on the request means "no filter" on the backend.
export function wireOptionalTrimmed<P extends object>(
  params: P,
  key: keyof P,
  value: string,
): void {
  const trimmed = value.trim();
  if (trimmed.length > 0) {
    (params as Record<keyof P, unknown>)[key] = trimmed;
  }
}

// element-wise === for two arrays. use as a createFiltersEqual override for readonly array keys.
export function shallowArrayEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// equality closure over a fixed key set. pass overrides for keys that need something other than ===.
export function createFiltersEqual<T>(
  keys: readonly (keyof T)[],
  overrides?: Partial<{ [K in keyof T]: (a: T[K], b: T[K]) => boolean }>,
): (a: T, b: T) => boolean {
  return (a, b) =>
    keys.every((k) => {
      const cmp = overrides?.[k];
      return cmp ? cmp(a[k], b[k]) : a[k] === b[k];
    });
}
