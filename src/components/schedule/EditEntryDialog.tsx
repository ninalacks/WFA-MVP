"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { PeriodWeekPicker } from "@/components/schedule/PeriodWeekPicker";
import { CURRENT_USER } from "@/lib/mock/creators";
import { ALL_PERIOD_WEEKS } from "@/lib/mock/schedule-data";
import type { FilterOptionLists, PeriodWeekOption, ResetRecord } from "@/types/schedule";

export interface EditEntryDialogProps {
  record: ResetRecord | null;
  options: FilterOptionLists;
  onOpenChange: (open: boolean) => void;
  onSubmit: (record: ResetRecord) => void;
}

const ALL_DIVISIONS_LABEL = "All Divisions";

interface FormState {
  periodWeeks: PeriodWeekOption[];
  type: string;
  divisions: string[];
  crossCommodity: boolean;
  categoryManager: string;
  processManager: string;
  coreSize: string;
  hours: string;
  comments: string;
  internalNotes: string;
}

function formStateFromRecord(record: ResetRecord): FormState {
  const initialPeriodWeek = ALL_PERIOD_WEEKS.find(
    (option) => option.period === record.period && option.week === record.week
  );
  return {
    periodWeeks: initialPeriodWeek ? [initialPeriodWeek] : [],
    type: record.type,
    divisions: record.divisions,
    crossCommodity: record.crossCommodity,
    categoryManager: record.categoryManager,
    processManager: record.processManager,
    coreSize: record.coreSize,
    hours: record.hours == null ? "" : String(record.hours),
    comments: record.comments ?? "",
    internalNotes: record.internalNotes ?? "",
  };
}

function FieldBox({
  label,
  icon,
  children,
  className,
  disabled,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-body-md ${
        disabled ? "bg-gray-100" : "bg-white"
      } ${className ?? "min-w-[180px] flex-1"}`}
    >
      <span className="shrink-0 text-body-xs font-semibold tracking-wide text-gray-700">{label}</span>
      <span className="h-4 w-px shrink-0 bg-gray-300" aria-hidden />
      {children}
      {icon}
    </label>
  );
}

function FieldSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={`min-w-0 flex-1 truncate bg-transparent text-body-md outline-none disabled:cursor-not-allowed ${
        value ? "text-gray-700" : "text-gray-400 italic"
      }`}
    >
      <option value="" disabled hidden>
        --- Select a Value ---
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function FieldMultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}) {
  const allSelected = options.length > 0 && value.length === options.length;

  function toggleOption(option: string, checked: boolean) {
    onChange(checked ? [...value, option] : value.filter((item) => item !== option));
  }

  const label = allSelected ? ALL_DIVISIONS_LABEL : value.length > 0 ? value.join(", ") : "";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`flex min-w-0 flex-1 items-center justify-between gap-1 truncate bg-transparent text-left text-body-md outline-none ${
            value.length ? "text-gray-700" : "text-gray-400 italic"
          }`}
        >
          <span className="truncate">{label || "--- Select a Value ---"}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 max-h-64 min-w-[200px] overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
        >
          <DropdownMenu.CheckboxItem
            checked={allSelected}
            onCheckedChange={(checked) => onChange(checked ? options : [])}
            onSelect={(event) => event.preventDefault()}
            className="cursor-pointer rounded px-2 py-1.5 text-body-md text-gray-700 outline-none select-none hover:bg-gray-50 data-[state=checked]:font-medium"
          >
            {ALL_DIVISIONS_LABEL}
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
          {options.map((option) => (
            <DropdownMenu.CheckboxItem
              key={option}
              checked={value.includes(option)}
              onCheckedChange={(checked) => toggleOption(option, checked)}
              onSelect={(event) => event.preventDefault()}
              className="cursor-pointer rounded px-2 py-1.5 text-body-md text-gray-700 outline-none select-none hover:bg-gray-50"
            >
              {option}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function EditEntryDialog({ record, options, onOpenChange, onSubmit }: EditEntryDialogProps) {
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    setForm(record ? formStateFromRecord(record) : null);
  }, [record]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
  }

  const isValid = Boolean(
    form &&
      form.periodWeeks.length > 0 &&
      form.type &&
      form.divisions.length > 0 &&
      form.categoryManager &&
      form.processManager &&
      form.coreSize
  );

  function handleSubmit() {
    if (!record || !form || !isValid) return;

    const [earliestPeriodWeek] = [...form.periodWeeks].sort((a, b) =>
      a.period === b.period ? a.week - b.week : a.period - b.period
    );
    if (!earliestPeriodWeek) return;

    const hours = form.hours.trim() === "" ? null : Math.round(Number(form.hours));
    const divisions = form.divisions;
    const comments = form.comments.trim() === "" ? null : form.comments.trim();
    const internalNotes = form.internalNotes.trim() === "" ? null : form.internalNotes.trim();
    const normalizedHours = hours === null || Number.isNaN(hours) ? null : hours;

    const hasChanges =
      form.type !== record.type ||
      form.crossCommodity !== record.crossCommodity ||
      form.categoryManager !== record.categoryManager ||
      form.processManager !== record.processManager ||
      form.coreSize !== record.coreSize ||
      normalizedHours !== record.hours ||
      comments !== record.comments ||
      internalNotes !== record.internalNotes ||
      divisions.length !== record.divisions.length ||
      divisions.some((division) => !record.divisions.includes(division)) ||
      form.periodWeeks.length !== 1 ||
      earliestPeriodWeek.period !== record.period ||
      earliestPeriodWeek.week !== record.week;

    onSubmit({
      ...record,
      status: hasChanges ? "Modified" : record.status,
      modifiedBy: hasChanges ? CURRENT_USER : record.modifiedBy,
      modifiedAt: hasChanges ? new Date().toISOString() : record.modifiedAt,
      type: form.type,
      crossCommodity: form.crossCommodity,
      categoryManager: form.categoryManager,
      processManager: form.processManager,
      coreSize: form.coreSize,
      hours: normalizedHours,
      divisions,
      comments,
      internalNotes,
      durationWeeks: form.periodWeeks.length,
      period: earliestPeriodWeek.period,
      week: earliestPeriodWeek.week,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog.Root open={record !== null} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[920px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="font-heading text-header-lg font-semibold text-gray-900">Edit</Dialog.Title>

          {record && form && (
            <>
              <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                <PeriodWeekPicker
                  value={form.periodWeeks}
                  onChange={(value) => update("periodWeeks", value)}
                  options={ALL_PERIOD_WEEKS}
                  years={options.fiscalYears}
                />
                <FieldBox label="TYPE">
                  <FieldSelect value={form.type} onChange={(value) => update("type", value)} options={options.types} />
                </FieldBox>
                <FieldBox label="DIVISION">
                  <FieldMultiSelect
                    value={form.divisions}
                    onChange={(value) => update("divisions", value)}
                    options={options.divisions}
                  />
                </FieldBox>
              </div>

              <label className="mt-4 flex items-center gap-2 text-body-md text-gray-700">
                <input
                  type="checkbox"
                  checked={form.crossCommodity}
                  onChange={(event) => update("crossCommodity", event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                This is a cross-commodity reset
              </label>

              <div className="mt-4 grid grid-cols-4 gap-3 border-t border-gray-200 pt-4">
                <FieldBox label="DEPARTMENT" className="min-w-0" disabled>
                  <FieldSelect value={record.department} onChange={() => {}} options={[record.department]} disabled />
                </FieldBox>
                <FieldBox label="COMMODITY" className="min-w-0" disabled>
                  <FieldSelect value={record.commodity} onChange={() => {}} options={[record.commodity]} disabled />
                </FieldBox>
                <FieldBox label="CM" className="min-w-0">
                  <FieldSelect
                    value={form.categoryManager}
                    onChange={(value) => update("categoryManager", value)}
                    options={options.categoryManagers}
                  />
                </FieldBox>
                <FieldBox label="PM" className="min-w-0">
                  <FieldSelect
                    value={form.processManager}
                    onChange={(value) => update("processManager", value)}
                    options={options.processManagers}
                  />
                </FieldBox>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <FieldBox label="POG SIZE">
                  <FieldSelect
                    value={form.coreSize}
                    onChange={(value) => update("coreSize", value)}
                    options={options.coreSizes}
                  />
                </FieldBox>
                <FieldBox label="HOURS">
                  <input
                    type="number"
                    min={0}
                    max={24}
                    step={1}
                    value={form.hours}
                    onChange={(event) => update("hours", event.target.value.replace(/[.,].*$/, ""))}
                    onKeyDown={(event) => {
                      if (event.key === "." || event.key === ",") event.preventDefault();
                    }}
                    placeholder="Enter a value"
                    className="min-w-0 flex-1 bg-transparent text-body-md text-gray-700 outline-none placeholder:text-gray-400 placeholder:italic"
                  />
                </FieldBox>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="font-heading text-header-sm font-bold text-gray-900">Comments</p>
                <input
                  value={form.comments}
                  onChange={(event) => update("comments", event.target.value)}
                  placeholder="Comments"
                  className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-body-md outline-none focus:border-primary"
                />
              </div>

              <div className="mt-4">
                <p className="font-heading text-header-sm font-bold text-gray-900">
                  Internal Notes <span className="font-sans text-body-md font-normal text-gray-400">(only visible in the history)</span>
                </p>
                <input
                  value={form.internalNotes}
                  onChange={(event) => update("internalNotes", event.target.value)}
                  placeholder="Internal notes (ex. explaining why the change is happening)"
                  className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-body-md outline-none focus:border-primary"
                />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <Dialog.Close asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button variant="default" onClick={handleSubmit} disabled={!isValid}>
                  Submit
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
