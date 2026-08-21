"use client";

import { useState } from "react";
import { ChevronDown, Download, History, Loader2, Star } from "lucide-react";
import { Dialog, DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { NewEntryDialog } from "@/components/schedule/NewEntryDialog";
import type { FilterOptionLists, NewEntryDraft, ScheduleView } from "@/types/schedule";

export type DownloadFormat = "excel" | "pdf";

export interface ActionBarProps {
  isDownloading: boolean;
  onDownload: (format: DownloadFormat) => void;
  isFilterEmpty: boolean;
  onSaveFilter: (name: string) => void;
  filterOptionLists: FilterOptionLists;
  onAddEntry: (draft: NewEntryDraft) => void;
  readOnly?: boolean;
  showPublishActions?: boolean;
  canPublish?: boolean;
  onPublish?: () => void;
  onReadyToPublish?: () => void;
  showViewToggle?: boolean;
  view?: ScheduleView;
  onViewChange?: (view: ScheduleView) => void;
  onOpenHistory?: () => void;
}

export function ActionBar({
  isDownloading,
  onDownload,
  isFilterEmpty,
  onSaveFilter,
  filterOptionLists,
  onAddEntry,
  readOnly = false,
  showPublishActions = false,
  canPublish = false,
  onPublish,
  onReadyToPublish,
  showViewToggle = false,
  view,
  onViewChange,
  onOpenHistory,
}: ActionBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  function handleSave() {
    const name = filterName.trim();
    if (!name) return;
    onSaveFilter(name);
    setFilterName("");
    setSaveDialogOpen(false);
  }

  return (
    <div className="flex items-center gap-2 px-6 py-3">
      {!readOnly && <NewEntryDialog options={filterOptionLists} onSubmit={onAddEntry} />}

      {showPublishActions && (
        <>
          <Button variant="default" onClick={onReadyToPublish}>
            Ready to Publish
          </Button>
          <Button
            variant="default"
            onClick={onPublish}
            disabled={!canPublish}
            title={canPublish ? undefined : "Select at least one change to publish"}
          >
            Publish Changes
          </Button>
        </>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="default" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            {isDownloading ? "Downloading..." : "Download"}
            <ChevronDown className="h-4 w-4" aria-hidden />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="z-50 min-w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          >
            <DropdownMenu.Item
              onSelect={() => onDownload("excel")}
              className="cursor-pointer rounded px-2 py-1.5 text-body-md text-gray-700 outline-none hover:bg-gray-50"
            >
              Excel (.csv)
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => onDownload("pdf")}
              className="cursor-pointer rounded px-2 py-1.5 text-body-md text-gray-700 outline-none hover:bg-gray-50"
            >
              PDF (print)
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog.Root open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline" disabled={isFilterEmpty} title={isFilterEmpty ? "Apply at least one filter to save" : undefined}>
            <Star className="h-4 w-4" aria-hidden />
            Save Filter
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-xl">
            <Dialog.Title className="font-heading text-header-sm font-bold text-gray-900">
              Save current filters
            </Dialog.Title>
            <input
              autoFocus
              value={filterName}
              onChange={(event) => setFilterName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSave()}
              placeholder="Filter name"
              className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-body-md focus:border-primary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="default" onClick={handleSave} disabled={!filterName.trim()}>
                Save
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Button variant="ghost" onClick={onOpenHistory}>
        <History className="h-4 w-4" aria-hidden />
        History
      </Button>

      {showViewToggle && view && (
        <div className="ml-auto flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 text-body-sm">
          {(["Draft", "Published"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onViewChange?.(option)}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                view === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
