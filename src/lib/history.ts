import { filterOptionLists } from "@/lib/mock/schedule-data";
import type { FieldChange, ResetRecord, ResetStatus } from "@/types/schedule";

const TOTAL_DIVISIONS = filterOptionLists.divisions.length;

export function formatDivisions(divisions: string[]): string {
  return divisions.length >= TOTAL_DIVISIONS ? "All Divisions" : divisions.join(", ");
}

const HISTORY_FIELDS: { label: string; value: (record: ResetRecord) => string | null }[] = [
  { label: "Department", value: (record) => record.department },
  { label: "Commodity", value: (record) => record.commodity },
  { label: "Category Manager", value: (record) => record.categoryManager },
  { label: "Process Manager", value: (record) => record.processManager },
  { label: "Core Size", value: (record) => record.coreSize },
  { label: "Period", value: (record) => String(record.period) },
  { label: "Week", value: (record) => String(record.week) },
  { label: "Hours", value: (record) => (record.hours == null ? null : String(record.hours)) },
  { label: "Type", value: (record) => record.type },
  { label: "Divisions", value: (record) => formatDivisions(record.divisions) },
];

const NO_VALUE = "No Value";
const REMOVED_VALUE = "Removed";

export function buildFieldChanges(
  record: ResetRecord,
  previous: ResetRecord | undefined,
  status: ResetStatus
): FieldChange[] {
  if (status === "Removed") {
    const source = previous ?? record;
    return HISTORY_FIELDS.map((field) => ({
      label: field.label,
      before: field.value(source) ?? NO_VALUE,
      after: REMOVED_VALUE,
    })).filter((change) => change.before !== NO_VALUE);
  }

  if (status === "Added" || !previous) {
    return HISTORY_FIELDS.map((field) => ({
      label: field.label,
      before: NO_VALUE,
      after: field.value(record) ?? NO_VALUE,
    })).filter((change) => change.after !== NO_VALUE);
  }

  return HISTORY_FIELDS.map((field) => ({
    label: field.label,
    before: field.value(previous) ?? NO_VALUE,
    after: field.value(record) ?? NO_VALUE,
  })).filter((change) => change.before !== change.after);
}
