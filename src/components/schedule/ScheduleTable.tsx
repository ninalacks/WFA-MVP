"use client";

import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/Switch";
import { filterOptionLists } from "@/lib/mock/schedule-data";
import type { ResetRecord, ResetStatus, SortableColumn, SortState } from "@/types/schedule";

const TOTAL_DIVISIONS = filterOptionLists.divisions.length;

export interface ScheduleTableProps {
  records: ResetRecord[];
  sort: SortState;
  onSortChange: (next: SortState) => void;
  hasSchedule: boolean;
  onClearFilters: () => void;
  readOnly?: boolean;
  onEditRecord?: (record: ResetRecord) => void;
  onRemoveRecord?: (record: ResetRecord) => void;
  onToggleReadiness?: (record: ResetRecord, readyToPublish: boolean) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string, checked: boolean) => void;
  onToggleSelectAll?: (checked: boolean) => void;
}

const STATUS_TONE: Record<ResetStatus, "info" | "success" | "danger"> = {
  Added: "success",
  Modified: "info",
  Removed: "danger",
};

interface ColumnDef {
  key: SortableColumn | "crossCommodity" | "divisionsCountDisplay" | "comments";
  header: string;
  sortKey?: SortableColumn;
  render: (record: ResetRecord) => ReactNode;
}

const COLUMNS: ColumnDef[] = [
  {
    key: "status",
    header: "Status",
    sortKey: "status",
    render: (record) =>
      record.status ? (
        <Badge tone={STATUS_TONE[record.status]}>{record.status}</Badge>
      ) : (
        <span className="text-gray-300">--</span>
      ),
  },
  {
    key: "modifiedBy",
    header: "Modified By",
    sortKey: "modifiedBy",
    render: (record) => record.modifiedBy,
  },
  { key: "type", header: "Type", sortKey: "type", render: (record) => record.type },
  {
    key: "department",
    header: "Department",
    sortKey: "department",
    render: (record) => record.department,
  },
  {
    key: "commodity",
    header: "Commodity",
    sortKey: "commodity",
    render: (record) => record.commodity,
  },
  {
    key: "categoryManager",
    header: "Category Manager",
    sortKey: "categoryManager",
    render: (record) => record.categoryManager,
  },
  {
    key: "processManager",
    header: "Process Manager",
    sortKey: "processManager",
    render: (record) => record.processManager,
  },
  {
    key: "coreSize",
    header: "Core Size",
    sortKey: "coreSize",
    render: (record) => record.coreSize,
  },
  {
    key: "start",
    header: "Start",
    sortKey: "start",
    render: (record) => `P${record.period}W${record.week}`,
  },
  {
    key: "durationWeeks",
    header: "Duration",
    sortKey: "durationWeeks",
    render: (record) => `${record.durationWeeks} wk${record.durationWeeks === 1 ? "" : "s"}`,
  },
  {
    key: "hours",
    header: "Hours",
    sortKey: "hours",
    render: (record) => (record.hours == null ? "--" : Math.round(record.hours)),
  },
  {
    key: "divisionsCountDisplay",
    header: "Nr of divisions",
    sortKey: "divisionsCount",
    render: (record) =>
      record.divisions.length >= TOTAL_DIVISIONS ? "All" : record.divisions.length,
  },
  {
    key: "comments",
    header: "Comments",
    render: (record) => (
      <span className={record.comments ? "" : "text-gray-300"}>{record.comments ?? "--"}</span>
    ),
  },
];

const STATUS_COLUMN_INDEX = COLUMNS.findIndex((column) => column.key === "status");
const COLUMNS_BEFORE_STATUS = COLUMNS.slice(0, STATUS_COLUMN_INDEX);
const COLUMNS_FROM_STATUS = COLUMNS.slice(STATUS_COLUMN_INDEX);

const HEADER_WRAP_THRESHOLD = 12;

function headerCellClassName(header: string): string {
  const wrap = header.length > HEADER_WRAP_THRESHOLD ? "max-w-[130px]" : "whitespace-nowrap";
  return `sticky top-0 z-10 ${wrap} border-b border-gray-200 bg-gray-50 px-3 py-2 text-left align-middle text-body-sm leading-tight font-medium text-gray-600`;
}

function ColumnHeader({
  column,
  sort,
  onSortChange,
}: {
  column: ColumnDef;
  sort: SortState;
  onSortChange: (next: SortState) => void;
}) {
  const isSortable = Boolean(column.sortKey);
  const isActive = isSortable && sort.column === column.sortKey;
  return (
    <th scope="col" className={headerCellClassName(column.header)}>
      {isSortable ? (
        <button
          type="button"
          onClick={() => onSortChange(nextSortState(sort, column.sortKey!))}
          className="flex items-center gap-1 text-left hover:text-gray-900"
        >
          {column.header}
          {isActive &&
            (sort.direction === "asc" ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            ))}
        </button>
      ) : (
        column.header
      )}
    </th>
  );
}

function SelectAllCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-gray-300"
      aria-label="Select all rows"
    />
  );
}

function nextSortState(current: SortState, column: SortableColumn): SortState {
  if (current.column !== column) {
    return { column, direction: "asc" };
  }
  if (current.direction === "asc") {
    return { column, direction: "desc" };
  }
  return { column: null, direction: null };
}

export function ScheduleTable({
  records,
  sort,
  onSortChange,
  hasSchedule,
  onClearFilters,
  readOnly = false,
  onEditRecord,
  onRemoveRecord,
  onToggleReadiness,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ScheduleTableProps) {
  if (!hasSchedule) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-body-md font-medium text-gray-700">
          No published schedule is currently available.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="max-w-sm text-body-md text-gray-500">
          No resets match your current filter criteria. Try modifying or clearing filters.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div
      id="schedule-table-print"
      className="max-h-[calc(100vh-320px)] flex-1 overflow-auto px-6 pb-6"
    >
      <table className="w-full border-separate border-spacing-0 text-left text-body-md">
        <thead>
          <tr>
            {!readOnly && (
              <th
                scope="col"
                className="sticky top-0 z-10 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-3 py-2 text-body-sm font-medium text-gray-600"
              >
                <SelectAllCheckbox
                  checked={records.length > 0 && records.every((record) => selectedIds?.has(record.id))}
                  indeterminate={
                    records.some((record) => selectedIds?.has(record.id)) &&
                    !records.every((record) => selectedIds?.has(record.id))
                  }
                  onChange={(checked) => onToggleSelectAll?.(checked)}
                />
              </th>
            )}
            {COLUMNS_BEFORE_STATUS.map((column) => (
              <ColumnHeader key={column.key} column={column} sort={sort} onSortChange={onSortChange} />
            ))}
            {!readOnly && (
              <>
                <th scope="col" className={headerCellClassName("Edit")}>
                  Edit
                </th>
                <th scope="col" className={headerCellClassName("Remove")}>
                  Remove
                </th>
                <th scope="col" className={headerCellClassName("Publishing Readiness")}>
                  Publishing Readiness
                </th>
              </>
            )}
            {COLUMNS_FROM_STATUS.map((column) => (
              <ColumnHeader key={column.key} column={column} sort={sort} onSortChange={onSortChange} />
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              {!readOnly && (
                <td className="border-b border-gray-100 px-3 py-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(record.id) ?? false}
                    onChange={(event) => onToggleSelect?.(record.id, event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label={`Select ${record.id}`}
                  />
                </td>
              )}
              {COLUMNS_BEFORE_STATUS.map((column) => (
                <td key={column.key} className="border-b border-gray-100 px-3 py-2 text-gray-700">
                  {column.render(record)}
                </td>
              ))}
              {!readOnly && (
                <>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-700">
                    <button
                      type="button"
                      onClick={() => onEditRecord?.(record)}
                      disabled={record.status === "Removed"}
                      className="text-kroger-accent-more-prominent hover:text-kroger-accent-most-prominent disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300"
                      aria-label={`Edit ${record.id}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-700">
                    <button
                      type="button"
                      onClick={() => onRemoveRecord?.(record)}
                      disabled={record.status === "Removed"}
                      className="text-kroger-negative-less-prominent hover:text-kroger-negative-more-prominent disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300"
                      aria-label={`Remove ${record.id}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-700">
                    <Switch
                      checked={record.readyToPublish}
                      onCheckedChange={(checked) => onToggleReadiness?.(record, checked)}
                      disabled={record.status === "Removed"}
                      aria-label={`Mark ${record.id} ${record.readyToPublish ? "not ready" : "ready"} to publish`}
                    />
                  </td>
                </>
              )}
              {COLUMNS_FROM_STATUS.map((column) => (
                <td key={column.key} className="border-b border-gray-100 px-3 py-2 text-gray-700">
                  {column.render(record)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
