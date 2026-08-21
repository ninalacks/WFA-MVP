"use client";

import { Check, ChevronDown } from "lucide-react";
import { Checkbox, Popover } from "radix-ui";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 max-h-64 w-56 overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
        >
          {options.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-gray-400">No options available</p>
          )}
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Checkbox.Root
                  checked={checked}
                  onCheckedChange={() => toggle(option.value)}
                  className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-white" aria-hidden />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                {option.label}
              </label>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
