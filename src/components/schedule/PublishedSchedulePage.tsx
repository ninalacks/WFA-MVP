"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { ActionBar, type DownloadFormat } from "@/components/schedule/ActionBar";
import { FilterPanel } from "@/components/schedule/FilterPanel";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import type { CsvColumn } from "@/lib/export-csv";
import { downloadCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { filterOptionLists, resetRecords, scheduleMetadata } from "@/lib/mock/schedule-data";
import {
  deleteSavedFilter,
  getSavedFilters,
  saveFilter,
  validateSavedFilter,
} from "@/lib/saved-filters";
import { applyFilters, isFilterStateEmpty, sortRecords } from "@/lib/schedule-filters";
import type { FilterState, ResetRecord, SavedFilter, SortState } from "@/types/schedule";
import { EMPTY_FILTER_STATE } from "@/types/schedule";

const CSV_COLUMNS: CsvColumn<ResetRecord>[] = [
  { header: "ID", accessor: (record) => record.id },
  { header: "Cross-Commodity", accessor: (record) => (record.crossCommodity ? "Yes" : "No") },
  { header: "Status", accessor: (record) => record.status },
  { header: "Type", accessor: (record) => record.type },
  { header: "Department", accessor: (record) => record.department },
  { header: "Commodity", accessor: (record) => record.commodity },
  { header: "Category Manager", accessor: (record) => record.categoryManager },
  { header: "Process Manager", accessor: (record) => record.processManager },
  { header: "Core Size", accessor: (record) => record.coreSize },
  { header: "Start", accessor: (record) => formatDate(record.start) },
  { header: "Duration (days)", accessor: (record) => record.durationDays },
  { header: "Hours", accessor: (record) => record.hours ?? "" },
  { header: "Divisions", accessor: (record) => record.divisions.join("; ") },
  { header: "Comments", accessor: (record) => record.comments ?? "" },
];

export function PublishedSchedulePage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE);
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => getSavedFilters());
  const [isDownloading, setIsDownloading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredRecords = useMemo(() => applyFilters(resetRecords, filters), [filters]);
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
      <PageHeader />
      <ScheduleHeader metadata={scheduleMetadata} />
      <ActionBar
        isDownloading={isDownloading}
        onDownload={handleDownload}
        isFilterEmpty={isFilterStateEmpty(filters)}
        onSaveFilter={handleSaveFilter}
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
        <div className="mx-6 mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
          {notice}
        </div>
      )}
      <ScheduleTable
        records={sortedRecords}
        sort={sort}
        onSortChange={setSort}
        hasSchedule={scheduleMetadata.publishedStatus === "Published"}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
