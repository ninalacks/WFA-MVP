"use client";

import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import type { ResetRecord, ResetStatus, SortableColumn, SortState } from "@/types/schedule";

export interface ScheduleTableProps {
  records: ResetRecord[];
  sort: SortState;
  onSortChange: (next: SortState) => void;
  hasSchedule: boolean;
  onClearFilters: () => void;
}

const STATUS_TONE: Record<ResetStatus, "warning" | "info" | "success" | "danger"> = {
  Scheduled: "warning",
  "In Progress": "info",
  Completed: "success",
  Cancelled: "danger",
};

interface ColumnDef {
  key: SortableColumn | "crossCommodity" | "divisionsCountDisplay" | "comments";
  header: string;
  sortKey?: SortableColumn;
  render: (record: ResetRecord) => ReactNode;
}

const COLUMNS: ColumnDef[] = [
  {
    key: "crossCommodity",
    header: "Cross-Commodity",
    render: (record) =>
      record.crossCommodity ? (
        <span className="inline-flex items-center gap-1 text-blue-600" title="Cross-commodity reset">
          <Layers className="h-4 w-4" aria-hidden />
        </span>
      ) : (
        <span className="text-gray-300">--</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    sortKey: "status",
    render: (record) => <Badge tone={STATUS_TONE[record.status]}>{record.status}</Badge>,
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
    render: (record) => formatDate(record.start),
  },
  {
    key: "durationDays",
    header: "Duration",
    sortKey: "durationDays",
    render: (record) => `${record.durationDays}d`,
  },
  {
    key: "hours",
    header: "Hours",
    sortKey: "hours",
    render: (record) => (record.hours == null ? "--" : record.hours),
  },
  {
    key: "divisionsCountDisplay",
    header: "# Divisions",
    sortKey: "divisionsCount",
    render: (record) => record.divisions.length,
  },
  {
    key: "comments",
    header: "Comments",
    render: (record) => (
      <span className={record.comments ? "" : "text-gray-300"}>{record.comments ?? "--"}</span>
    ),
  },
];

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
}: ScheduleTableProps) {
  if (!hasSchedule) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-sm font-medium text-gray-700">
          No published schedule is currently available.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="max-w-sm text-sm text-gray-500">
          No resets match your current filter criteria. Try modifying or clearing filters.
        </p>
        <Button variant="secondary" onClick={onClearFilters}>
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
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {COLUMNS.map((column) => {
              const isSortable = Boolean(column.sortKey);
              const isActive = isSortable && sort.column === column.sortKey;
              return (
                <th
                  key={column.key}
                  scope="col"
                  className="sticky top-0 z-10 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-3 py-2 font-medium text-gray-600"
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(nextSortState(sort, column.sortKey!))}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
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
            })}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              {COLUMNS.map((column) => (
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
