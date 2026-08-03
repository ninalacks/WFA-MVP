import type { FilterOptionLists, FilterState, SavedFilter } from "@/types/schedule";

const STORAGE_KEY = "kompass.savedFilters";

function readAll(): SavedFilter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(filters: SavedFilter[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export function getSavedFilters(): SavedFilter[] {
  return readAll();
}

export function saveFilter(name: string, filters: FilterState): SavedFilter {
  const saved: SavedFilter = {
    id: `filter-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
    name,
    filters,
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), saved]);
  return saved;
}

export function deleteSavedFilter(id: string): void {
  writeAll(readAll().filter((filter) => filter.id !== id));
}

export interface ValidatedFilter {
  filters: FilterState;
  removedCount: number;
}

export function validateSavedFilter(
  filters: FilterState,
  options: FilterOptionLists
): ValidatedFilter {
  const periodWeekLabels = options.periodWeeks.map((option) => option.label);
  const fields: Array<[keyof FilterState, (string | number)[]]> = [
    ["fiscalYears", options.fiscalYears],
    ["departments", options.departments],
    ["commodities", options.commodities],
    ["types", options.types],
    ["categoryManagers", options.categoryManagers],
    ["processManagers", options.processManagers],
    ["periodWeeks", periodWeekLabels],
    ["divisions", options.divisions],
    ["statuses", options.statuses],
  ];

  let removedCount = 0;
  const result = { ...filters };

  for (const [field, validValues] of fields) {
    const current = filters[field] as (string | number)[];
    const next = current.filter((value) => validValues.includes(value));
    removedCount += current.length - next.length;
    (result[field] as (string | number)[]) = next;
  }

  return { filters: result, removedCount };
}
