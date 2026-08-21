const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatTimestamp(iso: string): string {
  return TIMESTAMP_FORMATTER.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}

export function nextScheduleVersion(current: string): string {
  const match = /^(\d{4})\.(\d+)$/.exec(current);
  if (!match) return current;
  const [, year, number] = match;
  const nextNumber = String(Number(number) + 1).padStart(number.length, "0");
  return `${year}.${nextNumber}`;
}
