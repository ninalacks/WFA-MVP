"use client";

import { ChevronDown, ListFilter, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/MultiSelect";
import type { FilterOptionLists, FilterState, SavedFilter } from "@/types/schedule";
import { isFilterStateEmpty } from "@/lib/schedule-filters";

export interface FilterPanelProps {
  options: FilterOptionLists;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  savedFilters: SavedFilter[];
  onApplySavedFilter: (savedFilter: SavedFilter) => void;
  onDeleteSavedFilter: (id: string) => void;
}

function toOptions(values: (string | number)[]) {
  return values.map((value) => ({ value: String(value), label: String(value) }));
}

export function FilterPanel({
  options,
  filters,
  onChange,
  savedFilters,
  onApplySavedFilter,
  onDeleteSavedFilter,
}: FilterPanelProps) {
  const isEmpty = isFilterStateEmpty(filters);

  function update<K extends keyof FilterState>(key: K, next: string[]) {
    onChange({
      ...filters,
      [key]: key === "fiscalYears" ? next.map(Number) : next,
    } as FilterState);
  }

  function clearAll() {
    onChange({
      fiscalYears: [],
      departments: [],
      commodities: [],
      types: [],
      categoryManagers: [],
      processManagers: [],
      periodWeeks: [],
      divisions: [],
      statuses: [],
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-6 py-3">
      <MultiSelect
        label="Year"
        options={toOptions(options.fiscalYears)}
        selected={filters.fiscalYears.map(String)}
        onChange={(next) => update("fiscalYears", next)}
      />
      <MultiSelect
        label="Department"
        options={toOptions(options.departments)}
        selected={filters.departments}
        onChange={(next) => update("departments", next)}
      />
      <MultiSelect
        label="Commodity"
        options={toOptions(options.commodities)}
        selected={filters.commodities}
        onChange={(next) => update("commodities", next)}
      />
      <MultiSelect
        label="Type"
        options={toOptions(options.types)}
        selected={filters.types}
        onChange={(next) => update("types", next)}
      />
      <MultiSelect
        label="Category Manager"
        options={toOptions(options.categoryManagers)}
        selected={filters.categoryManagers}
        onChange={(next) => update("categoryManagers", next)}
      />
      <MultiSelect
        label="Process Manager"
        options={toOptions(options.processManagers)}
        selected={filters.processManagers}
        onChange={(next) => update("processManagers", next)}
      />
      <MultiSelect
        label="Period & Week"
        options={options.periodWeeks.map((option) => ({ value: option.label, label: option.label }))}
        selected={filters.periodWeeks}
        onChange={(next) => update("periodWeeks", next)}
      />
      <MultiSelect
        label="Division"
        options={toOptions(options.divisions)}
        selected={filters.divisions}
        onChange={(next) => update("divisions", next)}
      />
      <MultiSelect
        label="Status"
        options={toOptions(options.statuses)}
        selected={filters.statuses}
        onChange={(next) => update("statuses", next)}
      />

      <Button variant="ghost" onClick={clearAll} disabled={isEmpty}>
        <X className="h-4 w-4" aria-hidden />
        Clear Filters
      </Button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost">
            <ListFilter className="h-4 w-4" aria-hidden />
            Saved Filters
            <ChevronDown className="h-4 w-4" aria-hidden />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="z-50 min-w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          >
            {savedFilters.length === 0 && (
              <p className="px-2 py-1.5 text-body-md text-gray-400">No saved filters yet</p>
            )}
            {savedFilters.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center justify-between rounded px-2 py-1.5 text-body-md text-gray-700 hover:bg-gray-50"
              >
                <DropdownMenu.Item
                  onSelect={() => onApplySavedFilter(saved)}
                  className="flex-1 cursor-pointer outline-none"
                >
                  {saved.name}
                </DropdownMenu.Item>
                <button
                  type="button"
                  aria-label={`Delete saved filter ${saved.name}`}
                  onClick={() => onDeleteSavedFilter(saved.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
