"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { ActionBar, type DownloadFormat } from "@/components/schedule/ActionBar";
import { EditEntryDialog } from "@/components/schedule/EditEntryDialog";
import { FilterPanel } from "@/components/schedule/FilterPanel";
import { HistoryView } from "@/components/schedule/HistoryView";
import { RemoveEntryDialog } from "@/components/schedule/RemoveEntryDialog";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import type { CsvColumn } from "@/lib/export-csv";
import { downloadCsv } from "@/lib/export-csv";
import { nextScheduleVersion } from "@/lib/format";
import { buildFieldChanges } from "@/lib/history";
import { CURRENT_USER } from "@/lib/mock/creators";
import { publishLog as initialPublishLog } from "@/lib/mock/publish-log";
import { filterOptionLists, resetRecords, scheduleMetadata } from "@/lib/mock/schedule-data";
import {
  deleteSavedFilter,
  getSavedFilters,
  saveFilter,
  validateSavedFilter,
} from "@/lib/saved-filters";
import { applyFilters, isFilterStateEmpty, sortRecords } from "@/lib/schedule-filters";
import type {
  FilterState,
  HistoryEntry,
  NewEntryDraft,
  PublishLogEntry,
  ResetRecord,
  SavedFilter,
  ScheduleMetadata,
  ScheduleView,
  SortState,
  UserRole,
} from "@/types/schedule";
import { EMPTY_FILTER_STATE } from "@/types/schedule";

function nextRecordId(records: ResetRecord[]): string {
  const maxId = records.reduce((max, record) => {
    const match = /^RS-(\d+)$/.exec(record.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `RS-${maxId + 1}`;
}

const CSV_COLUMNS: CsvColumn<ResetRecord>[] = [
  { header: "ID", accessor: (record) => record.id },
  { header: "Cross-Commodity", accessor: (record) => (record.crossCommodity ? "Yes" : "No") },
  { header: "Status", accessor: (record) => record.status ?? "" },
  { header: "Type", accessor: (record) => record.type },
  { header: "Department", accessor: (record) => record.department },
  { header: "Commodity", accessor: (record) => record.commodity },
  { header: "Category Manager", accessor: (record) => record.categoryManager },
  { header: "Process Manager", accessor: (record) => record.processManager },
  { header: "Core Size", accessor: (record) => record.coreSize },
  { header: "Start", accessor: (record) => `P${record.period}W${record.week}` },
  { header: "Duration (weeks)", accessor: (record) => record.durationWeeks },
  { header: "Hours", accessor: (record) => record.hours ?? "" },
  { header: "Divisions", accessor: (record) => record.divisions.join("; ") },
  { header: "Comments", accessor: (record) => record.comments ?? "" },
];

function toPublishedSnapshot(records: ResetRecord[]): ResetRecord[] {
  return records.filter((record) => record.status !== "Removed").map((record) => ({ ...record, status: null }));
}

export function PublishedSchedulePage() {
  const [role, setRole] = useState<UserRole>("Creator");
  const [view, setView] = useState<ScheduleView>("Draft");
  const [draftRecords, setDraftRecords] = useState<ResetRecord[]>(resetRecords);
  const [publishedRecords, setPublishedRecords] = useState<ResetRecord[]>(() =>
    toPublishedSnapshot(resetRecords)
  );
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE);
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => getSavedFilters());
  const [isDownloading, setIsDownloading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [recordPendingRemoval, setRecordPendingRemoval] = useState<ResetRecord | null>(null);
  const [recordBeingEdited, setRecordBeingEdited] = useState<ResetRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [metadata, setMetadata] = useState<ScheduleMetadata>(scheduleMetadata);
  const [publishLog, setPublishLog] = useState<PublishLogEntry[]>(initialPublishLog);
  const [showingHistory, setShowingHistory] = useState(false);

  const effectiveView: ScheduleView = role === "Viewer" ? "Published" : view;
  const isReadOnly = effectiveView === "Published";
  const records = isReadOnly ? publishedRecords : draftRecords;

  const filteredRecords = useMemo(() => applyFilters(records, filters), [records, filters]);
  const sortedRecords = useMemo(() => sortRecords(filteredRecords, sort), [filteredRecords, sort]);

  function handleFiltersChange(next: FilterState) {
    setFilters(next);
    setNotice(null);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTER_STATE);
    setNotice(null);
  }

  function handleSaveFilter(name: string) {
    saveFilter(name, filters);
    setSavedFilters(getSavedFilters());
    setNotice(`Filter "${name}" saved.`);
  }

  function handleApplySavedFilter(saved: SavedFilter) {
    const { filters: validated, removedCount } = validateSavedFilter(saved.filters, filterOptionLists);
    setFilters(validated);
    setNotice(
      removedCount > 0
        ? `Some values in "${saved.name}" are no longer available and were removed.`
        : `Filter "${saved.name}" applied.`
    );
  }

  function handleDeleteSavedFilter(id: string) {
    deleteSavedFilter(id);
    setSavedFilters(getSavedFilters());
  }

  function handleAddEntry(draft: NewEntryDraft) {
    const [earliestPeriodWeek] = [...draft.periods].sort((a, b) =>
      a.period === b.period ? a.week - b.week : a.period - b.period
    );
    if (!earliestPeriodWeek) return;

    const newRecord: ResetRecord = {
      id: nextRecordId(draftRecords),
      crossCommodity: draft.crossCommodity,
      status: "Added",
      readyToPublish: false,
      modifiedBy: CURRENT_USER,
      modifiedAt: new Date().toISOString(),
      type: draft.type,
      department: draft.department,
      commodity: draft.commodity,
      categoryManager: draft.categoryManager,
      processManager: draft.processManager,
      coreSize: draft.coreSize,
      start: new Date().toISOString().slice(0, 10),
      durationWeeks: draft.periods.length,
      hours: draft.hours,
      divisions: draft.divisions,
      comments: draft.comments,
      internalNotes: draft.internalNotes,
      fiscalYear: filterOptionLists.fiscalYears[0],
      period: earliestPeriodWeek.period,
      week: earliestPeriodWeek.week,
    };
    setDraftRecords((prev) => [newRecord, ...prev]);
    setNotice(`Reset ${newRecord.id} added.`);
  }

  function handleRequestRemove(record: ResetRecord) {
    setRecordPendingRemoval(record);
  }

  function handleRequestEdit(record: ResetRecord) {
    setRecordBeingEdited(record);
  }

  function handleConfirmEdit(updated: ResetRecord) {
    setDraftRecords((prev) => prev.map((existing) => (existing.id === updated.id ? updated : existing)));
    setNotice(`Reset ${updated.id} updated.`);
  }

  function handleConfirmRemove(record: ResetRecord, internalNotes: string | null) {
    setDraftRecords((prev) =>
      prev.map((existing) =>
        existing.id === record.id
          ? {
              ...existing,
              status: "Removed",
              modifiedBy: CURRENT_USER,
              modifiedAt: new Date().toISOString(),
              readyToPublish: false,
              internalNotes: internalNotes ?? existing.internalNotes,
            }
          : existing
      )
    );
    setSelectedIds((prev) => {
      if (!prev.has(record.id)) return prev;
      const next = new Set(prev);
      next.delete(record.id);
      return next;
    });
    setNotice(`Reset ${record.id} removed.`);
  }

  function handleToggleReadiness(record: ResetRecord, readyToPublish: boolean) {
    setDraftRecords((prev) =>
      prev.map((existing) => (existing.id === record.id ? { ...existing, readyToPublish } : existing))
    );
  }

  function handleToggleSelect(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function handleToggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(sortedRecords.map((record) => record.id)) : new Set());
  }

  function handleReadyToPublish() {
    setDraftRecords((prev) =>
      prev.map((record) =>
        record.modifiedBy === CURRENT_USER && record.status !== "Removed"
          ? { ...record, readyToPublish: true }
          : record
      )
    );
  }

  function handlePublish() {
    const selected = draftRecords.filter((record) => selectedIds.has(record.id));
    const remaining = draftRecords.filter((record) => !selectedIds.has(record.id));
    const nextVersion = nextScheduleVersion(metadata.version);
    const publishedAt = new Date().toISOString();

    const entries: HistoryEntry[] = selected
      .filter((record) => record.status !== null)
      .map((record) => {
        const previous = publishedRecords.find((published) => published.id === record.id);
        return {
          recordId: record.id,
          status: record.status as HistoryEntry["status"],
          commodity: record.commodity,
          divisions: record.divisions,
          period: record.period,
          week: record.week,
          modifiedBy: record.modifiedBy,
          modifiedAt: record.modifiedAt,
          internalNotes: record.internalNotes,
          changes: buildFieldChanges(record, previous, record.status as HistoryEntry["status"]),
        };
      });

    let nextPublished: ResetRecord[] = publishedRecords.map((published) => ({
      ...published,
      status: null,
    }));
    for (const record of selected) {
      if (record.status === "Removed") {
        nextPublished = nextPublished.filter((published) => published.id !== record.id);
      } else {
        const cleaned: ResetRecord = { ...record, readyToPublish: false };
        const idx = nextPublished.findIndex((published) => published.id === record.id);
        nextPublished =
          idx >= 0
            ? nextPublished.map((published, i) => (i === idx ? cleaned : published))
            : [cleaned, ...nextPublished];
      }
    }

    const settledDraft = selected
      .filter((record) => record.status !== "Removed")
      .map((record) => ({ ...record, status: null, readyToPublish: false }));

    setPublishedRecords(nextPublished);
    setDraftRecords([...remaining, ...settledDraft]);
    setSelectedIds(new Set());
    setMetadata((prev) => ({ ...prev, version: nextVersion, lastUpdated: publishedAt }));
    if (entries.length > 0) {
      setPublishLog((prev) => [...prev, { version: nextVersion, publishedAt, entries }]);
    }
    setNotice("Changes published.");
  }

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole);
    setSelectedIds(new Set());
    setNotice(null);
  }

  function handleViewChange(nextView: ScheduleView) {
    setView(nextView);
    setSelectedIds(new Set());
    setNotice(null);
  }

  function handleDownload(format: DownloadFormat) {
    setIsDownloading(true);
    setTimeout(() => {
      if (format === "excel") {
        downloadCsv("kompass-schedule.csv", CSV_COLUMNS, sortedRecords);
      } else {
        window.print();
      }
      setIsDownloading(false);
    }, 500);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <PageHeader role={role} onRoleChange={handleRoleChange} />
      <ScheduleHeader metadata={metadata} view={effectiveView} />
      {showingHistory ? (
        <HistoryView publishLog={publishLog} onBack={() => setShowingHistory(false)} />
      ) : (
        <>
          <ActionBar
            isDownloading={isDownloading}
            onDownload={handleDownload}
            isFilterEmpty={isFilterStateEmpty(filters)}
            onSaveFilter={handleSaveFilter}
            filterOptionLists={filterOptionLists}
            onAddEntry={handleAddEntry}
            readOnly={isReadOnly}
            showPublishActions={role === "Creator" && !isReadOnly}
            canPublish={selectedIds.size > 0}
            onPublish={handlePublish}
            onReadyToPublish={handleReadyToPublish}
            showViewToggle={role === "Creator"}
            view={effectiveView}
            onViewChange={handleViewChange}
            onOpenHistory={() => setShowingHistory(true)}
          />
          <FilterPanel
            options={filterOptionLists}
            filters={filters}
            onChange={handleFiltersChange}
            savedFilters={savedFilters}
            onApplySavedFilter={handleApplySavedFilter}
            onDeleteSavedFilter={handleDeleteSavedFilter}
          />
          {notice && (
            <div className="mx-6 mt-3 rounded-md border border-accent bg-mx-info px-3 py-2 text-body-md text-mx-info-foreground">
              {notice}
            </div>
          )}
          <ScheduleTable
            records={sortedRecords}
            sort={sort}
            onSortChange={setSort}
            hasSchedule={metadata.publishedStatus === "Published"}
            onClearFilters={handleClearFilters}
            readOnly={isReadOnly}
            onEditRecord={handleRequestEdit}
            onRemoveRecord={handleRequestRemove}
            onToggleReadiness={handleToggleReadiness}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </>
      )}
      <RemoveEntryDialog
        record={recordPendingRemoval}
        onOpenChange={(open) => {
          if (!open) setRecordPendingRemoval(null);
        }}
        onConfirm={handleConfirmRemove}
      />
      <EditEntryDialog
        record={recordBeingEdited}
        options={filterOptionLists}
        onOpenChange={(open) => {
          if (!open) setRecordBeingEdited(null);
        }}
        onSubmit={handleConfirmEdit}
      />
    </div>
  );
}
