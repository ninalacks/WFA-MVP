"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover } from "radix-ui";

import type { PeriodWeekOption } from "@/types/schedule";

export interface PeriodWeekPickerProps {
  value: PeriodWeekOption[];
  onChange: (value: PeriodWeekOption[]) => void;
  options: PeriodWeekOption[];
  years: number[];
}

export function formatPeriodWeekSelection(selected: PeriodWeekOption[], allOptions: PeriodWeekOption[]): string {
  if (selected.length === 0) return "";

  const weeksByPeriod = new Map<number, number[]>();
  for (const option of selected) {
    const list = weeksByPeriod.get(option.period) ?? [];
    list.push(option.week);
    weeksByPeriod.set(option.period, list);
  }

  const totalWeeksByPeriod = new Map<number, number>();
  for (const option of allOptions) {
    totalWeeksByPeriod.set(option.period, (totalWeeksByPeriod.get(option.period) ?? 0) + 1);
  }

  const periods = Array.from(weeksByPeriod.keys()).sort((a, b) => a - b);

  return periods
    .map((period) => {
      const weeks = (weeksByPeriod.get(period) ?? []).slice().sort((a, b) => a - b);

      if (weeks.length === (totalWeeksByPeriod.get(period) ?? 0)) {
        return `P${period} All Weeks`;
      }

      const ranges: string[] = [];
      let start = weeks[0];
      let prev = weeks[0];
      for (let i = 1; i <= weeks.length; i++) {
        const current = weeks[i];
        if (current !== prev + 1) {
          ranges.push(start === prev ? `${start}` : `${start}–${prev}`);
          start = current;
        }
        prev = current;
      }

      return `P${period} W${ranges.join(", ")}`;
    })
    .join(", ");
}

export function PeriodWeekPicker({ value, onChange, options, years }: PeriodWeekPickerProps) {
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());

  const yearIndex = years.indexOf(year);
  const canGoPrev = yearIndex > 0;
  const canGoNext = yearIndex >= 0 && yearIndex < years.length - 1;

  const periods = Array.from(new Set(options.map((option) => option.period))).sort((a, b) => a - b);
  const weeksByPeriod = new Map<number, PeriodWeekOption[]>();
  for (const option of options) {
    const list = weeksByPeriod.get(option.period) ?? [];
    list.push(option);
    weeksByPeriod.set(option.period, list);
  }

  const selectedLabels = new Set(value.map((option) => option.label));

  function isWeekSelected(option: PeriodWeekOption) {
    return selectedLabels.has(option.label);
  }

  function isPeriodActive(period: number) {
    return (weeksByPeriod.get(period) ?? []).some((option) => isWeekSelected(option));
  }

  function isPeriodFullySelected(period: number) {
    const weeks = weeksByPeriod.get(period) ?? [];
    return weeks.length > 0 && weeks.every((option) => isWeekSelected(option));
  }

  function toggleWeek(option: PeriodWeekOption) {
    if (isWeekSelected(option)) {
      onChange(value.filter((selected) => selected.label !== option.label));
    } else {
      onChange([...value, option]);
    }
  }

  function togglePeriod(period: number) {
    const weeks = weeksByPeriod.get(period) ?? [];
    if (isPeriodFullySelected(period)) {
      onChange(value.filter((selected) => selected.period !== period));
    } else {
      const withoutPeriod = value.filter((selected) => selected.period !== period);
      onChange([...withoutPeriod, ...weeks]);
    }
  }

  const label = formatPeriodWeekSelection(value, options);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex min-w-[180px] flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm"
        >
          <span className="shrink-0 text-xs font-semibold tracking-wide text-gray-700">DATE</span>
          <span className="h-4 w-px shrink-0 bg-gray-300" aria-hidden />
          <span className={`min-w-0 flex-1 truncate ${label ? "text-gray-700" : "text-gray-400 italic"}`}>
            {label || "--- Select a Value ---"}
          </span>
          <Calendar className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-64 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-center gap-4 border-b border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={() => canGoPrev && setYear(years[yearIndex - 1])}
              disabled={!canGoPrev}
              className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="text-sm font-semibold text-primary">{year}</span>
            <button
              type="button"
              onClick={() => canGoNext && setYear(years[yearIndex + 1])}
              disabled={!canGoNext}
              className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="flex px-4 pt-2 text-xs font-semibold text-gray-500">
            <span className="w-16">Period:</span>
            <span>Week:</span>
          </div>

          <div className="max-h-64 overflow-y-auto px-4 pt-1 pb-3">
            {periods.map((period) => (
              <div key={period} className="flex items-center gap-3 py-1.5">
                <button
                  type="button"
                  onClick={() => togglePeriod(period)}
                  className={`w-16 rounded px-1.5 py-0.5 text-left text-sm font-medium ${
                    isPeriodActive(period) ? "bg-accent text-accent-foreground" : "text-primary hover:text-accent-foreground"
                  }`}
                >
                  {period}
                </button>
                <div className="flex flex-1 gap-2">
                  {(weeksByPeriod.get(period) ?? []).map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => toggleWeek(option)}
                      className={`flex h-6 w-6 items-center justify-center rounded text-sm ${
                        isWeekSelected(option)
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-primary hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {option.week}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
