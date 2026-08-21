"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Dialog, DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { PeriodWeekPicker } from "@/components/schedule/PeriodWeekPicker";
import { ALL_PERIOD_WEEKS } from "@/lib/mock/schedule-data";
import type { FilterOptionLists, NewEntryDraft, PeriodWeekOption } from "@/types/schedule";

export interface NewEntryDialogProps {
  options: FilterOptionLists;
  onSubmit: (draft: NewEntryDraft) => void;
}

const ALL_DIVISIONS_LABEL = "All Divisions";

interface FormState {
  periodWeeks: PeriodWeekOption[];
  type: string;
  divisions: string[];
  crossCommodity: boolean;
  department: string;
  commodity: string;
  categoryManager: string;
  processManager: string;
  coreSize: string;
  hours: string;
  comments: string;
  internalNotes: string;
}

const EMPTY_FORM: FormState = {
  periodWeeks: [],
  type: "",
  divisions: [],
  crossCommodity: false,
  department: "",
  commodity: "",
  categoryManager: "",
  processManager: "",
  coreSize: "",
  hours: "",
  comments: "",
  internalNotes: "",
};

function FieldBox({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-body-md ${
        className ?? "min-w-[180px] flex-1"
      }`}
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
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`min-w-0 flex-1 truncate bg-transparent text-body-md outline-none ${
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

export function NewEntryDialog({ options, onSubmit }: NewEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY_FORM);
    }
  }

  const isValid = Boolean(
    form.periodWeeks.length > 0 &&
      form.type &&
      form.divisions.length > 0 &&
      form.department &&
      form.commodity &&
      form.categoryManager &&
      form.processManager &&
      form.coreSize
  );

  function handleSubmit() {
    if (!isValid) return;

    const hours = form.hours.trim() === "" ? null : Math.round(Number(form.hours));

    onSubmit({
      type: form.type,
      crossCommodity: form.crossCommodity,
      divisions: form.divisions,
      department: form.department,
      commodity: form.commodity,
      categoryManager: form.categoryManager,
      processManager: form.processManager,
      coreSize: form.coreSize,
      hours: hours === null || Number.isNaN(hours) ? null : hours,
      comments: form.comments.trim() === "" ? null : form.comments.trim(),
      internalNotes: form.internalNotes.trim() === "" ? null : form.internalNotes.trim(),
      periods: form.periodWeeks,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" aria-hidden />
          New Entry
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[920px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="font-heading text-header-lg font-semibold text-gray-900">
            Add New Entry
          </Dialog.Title>

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
            <FieldBox label="DEPARTMENT" className="min-w-0">
              <FieldSelect
                value={form.department}
                onChange={(value) => update("department", value)}
                options={options.departments}
              />
            </FieldBox>
            <FieldBox label="COMMODITY" className="min-w-0">
              <FieldSelect
                value={form.commodity}
                onChange={(value) => update("commodity", value)}
                options={options.commodities}
              />
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
