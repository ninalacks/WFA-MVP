const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatTimestamp(iso: string): string {
  return `${TIMESTAMP_FORMATTER.format(new Date(iso))} UTC`;
}

export function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}
