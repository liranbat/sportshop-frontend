const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const countFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDateRange(from: string, to: string): string {
  return `${formatIsoDate(from)} - ${formatIsoDate(to)}`;
}

// build from parts: new Date("2026-04-01") parses as UTC midnight and renders as Mar 31 west of GMT.
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return dateFormatter.format(new Date(Number(year), Number(month) - 1, Number(day)));
}
