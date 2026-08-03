import type { FilterState, ResetRecord, SortState } from "@/types/schedule";

export function periodWeekLabel(record: ResetRecord): string {
  return `P${record.period} W${record.week}`;
}

export function applyFilters(records: ResetRecord[], filters: FilterState): ResetRecord[] {
  return records.filter((record) => {
    if (filters.fiscalYears.length && !filters.fiscalYears.includes(record.fiscalYear)) {
      return false;
    }
    if (filters.departments.length && !filters.departments.includes(record.department)) {
      return false;
    }
    if (filters.commodities.length && !filters.commodities.includes(record.commodity)) {
      return false;
    }
    if (filters.types.length && !filters.types.includes(record.type)) {
      return false;
    }
    if (
      filters.categoryManagers.length &&
      !filters.categoryManagers.includes(record.categoryManager)
    ) {
      return false;
    }
    if (
      filters.processManagers.length &&
      !filters.processManagers.includes(record.processManager)
    ) {
      return false;
    }
    if (filters.periodWeeks.length && !filters.periodWeeks.includes(periodWeekLabel(record))) {
      return false;
    }
    if (
      filters.divisions.length &&
      !record.divisions.some((division) => filters.divisions.includes(division))
    ) {
      return false;
    }
    if (filters.statuses.length && !filters.statuses.includes(record.status)) {
      return false;
    }
    return true;
  });
}

function compareValues(a: ResetRecord, b: ResetRecord, column: NonNullable<SortState["column"]>) {
  switch (column) {
    case "start":
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    case "durationDays":
      return a.durationDays - b.durationDays;
    case "hours":
      return (a.hours ?? -1) - (b.hours ?? -1);
    case "divisionsCount":
      return a.divisions.length - b.divisions.length;
    default:
      return a[column].localeCompare(b[column]);
  }
}

export function sortRecords(records: ResetRecord[], sort: SortState): ResetRecord[] {
  if (!sort.column || !sort.direction) {
    return records;
  }
  const sorted = [...records].sort((a, b) => compareValues(a, b, sort.column!));
  return sort.direction === "asc" ? sorted : sorted.reverse();
}

export function isFilterStateEmpty(filters: FilterState): boolean {
  return Object.values(filters).every((values) => values.length === 0);
}
