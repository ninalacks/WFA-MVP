"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { formatDivisions } from "@/lib/history";
import { formatDate, formatTimestamp } from "@/lib/format";
import { filterOptionLists } from "@/lib/mock/schedule-data";
import type { HistoryEntry, PublishLogEntry, ResetStatus } from "@/types/schedule";

const TOTAL_DIVISIONS = filterOptionLists.divisions.length;

const STATUS_TONE: Record<ResetStatus, "info" | "success" | "danger"> = {
  Added: "success",
  Modified: "info",
  Removed: "danger",
};

const STATUS_BORDER: Record<ResetStatus, string> = {
  Added: "border-l-mx-success",
  Modified: "border-l-mx-info",
  Removed: "border-l-mx-danger",
};

const PAGE_SIZE = 5;
const TRUNCATE_COUNT = 4;

export interface HistoryViewProps {
  publishLog: PublishLogEntry[];
  onBack: () => void;
}

function summarizeDivisions(entries: HistoryEntry[]): string[] {
  const all = new Set<string>();
  for (const entry of entries) {
    for (const division of entry.divisions) all.add(division);
  }
  if (all.size >= TOTAL_DIVISIONS) return ["All Divisions"];
  return Array.from(all);
}

function TruncatedList({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return <span className="text-gray-400">None</span>;
  const shown = expanded ? items : items.slice(0, TRUNCATE_COUNT);
  const hasMore = items.length > TRUNCATE_COUNT;
  return (
    <span>
      {shown.join(", ")}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-1 text-body-xs font-medium text-primary hover:underline"
        >
          {expanded ? "(view less)" : "(view more)"}
        </button>
      )}
    </span>
  );
}

function EntryCard({
  entry,
  priorEntries,
  compact = false,
}: {
  entry: HistoryEntry;
  priorEntries: HistoryEntry[];
  compact?: boolean;
}) {
  const [showPrior, setShowPrior] = useState(false);

  return (
    <div className={`rounded-md border border-l-4 border-gray-200 bg-white p-4 ${STATUS_BORDER[entry.status]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={STATUS_TONE[entry.status]}>{entry.status}</Badge>
        <span className="font-heading text-body-md font-semibold text-gray-900">{entry.commodity}</span>
        <span className="text-body-sm text-gray-500">{formatDivisions(entry.divisions)}</span>
        <span className="text-body-sm text-gray-500">
          P{entry.period}W{entry.week}
        </span>
      </div>
      <div className="mt-1 text-body-xs text-gray-500">
        {formatTimestamp(entry.modifiedAt)} by {entry.modifiedBy}
      </div>

      {!compact && entry.changes.length > 0 && (
        <div className="mt-3">
          <div className="text-body-xs font-semibold text-gray-700">Changes made:</div>
          <ul className="mt-1 space-y-1">
            {entry.changes.map((change) => (
              <li key={change.label} className="text-body-sm text-gray-700">
                <span className="font-medium">{change.label}:</span> {change.before} →{" "}
                <span className="font-medium text-primary">{change.after}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && entry.internalNotes && (
        <div className="mt-2 text-body-sm text-gray-600">
          <span className="font-medium">Internal Notes:</span> {entry.internalNotes}
        </div>
      )}

      {!compact && priorEntries.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowPrior((prev) => !prev)}
            className="text-body-xs font-medium text-primary hover:underline"
          >
            See all previous changes made to this entry
          </button>
          {showPrior && (
            <div className="mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
              {priorEntries.map((prior, index) => (
                <EntryCard key={`${prior.recordId}-${index}`} entry={prior} priorEntries={[]} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PublishGroup({
  logEntry,
  isNewest,
  olderLogs,
  expandAll,
}: {
  logEntry: PublishLogEntry;
  isNewest: boolean;
  olderLogs: PublishLogEntry[];
  expandAll: boolean;
}) {
  const [expanded, setExpanded] = useState(isNewest);
  const isExpanded = expandAll || expanded;

  const commodities = Array.from(new Set(logEntry.entries.map((entry) => entry.commodity)));
  const divisions = summarizeDivisions(logEntry.entries);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" aria-hidden />
          )}
          <span className="font-heading text-body-md font-semibold text-gray-900">
            {isNewest ? "Most Recently Published Changes - Summary" : "Published Changes - Summary"}
          </span>
        </div>
        <span className="text-body-sm text-gray-500">Last Published: {formatDate(logEntry.publishedAt)}</span>
      </button>

      <div className="grid grid-cols-1 gap-3 border-t border-gray-100 px-4 py-3 sm:grid-cols-3">
        <div>
          <div className="text-body-xs font-medium text-gray-500">Total Changes</div>
          <div className="text-body-md font-semibold text-gray-900">{logEntry.entries.length}</div>
        </div>
        <div>
          <div className="text-body-xs font-medium text-gray-500">Affected Commodities</div>
          <div className="text-body-sm text-gray-700">
            <TruncatedList items={commodities} />
          </div>
        </div>
        <div>
          <div className="text-body-xs font-medium text-gray-500">Affected Divisions</div>
          <div className="text-body-sm text-gray-700">
            <TruncatedList items={divisions} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4">
          {logEntry.entries.map((entry, index) => (
            <EntryCard
              key={`${entry.recordId}-${index}`}
              entry={entry}
              priorEntries={olderLogs
                .flatMap((log) => log.entries)
                .filter((prior) => prior.recordId === entry.recordId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoryView({ publishLog, onBack }: HistoryViewProps) {
  const [expandAll, setExpandAll] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const sortedLogs = [...publishLog].reverse();
  const visibleLogs = showAll ? sortedLogs : sortedLogs.slice(0, PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-body-sm font-medium text-primary hover:underline"
          >
            ← Back to Schedule
          </button>
          <h1 className="font-heading text-header-md font-bold text-gray-900">History of Changes</h1>
        </div>
        {sortedLogs.length > 0 && (
          <Button variant="outline" onClick={() => setExpandAll((prev) => !prev)}>
            {expandAll ? "Collapse All Details" : "Expand All Details"}
          </Button>
        )}
      </div>

      {sortedLogs.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 px-4 py-8 text-center text-body-md text-gray-500">
          No published changes yet.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {visibleLogs.map((logEntry, index) => (
              <PublishGroup
                key={logEntry.version}
                logEntry={logEntry}
                isNewest={index === 0}
                olderLogs={sortedLogs.slice(index + 1)}
                expandAll={expandAll}
              />
            ))}
          </div>
          {!showAll && sortedLogs.length > PAGE_SIZE && (
            <Button variant="outline" onClick={() => setShowAll(true)} className="self-center">
              View All ({sortedLogs.length})
            </Button>
          )}
        </>
      )}
    </div>
  );
}
