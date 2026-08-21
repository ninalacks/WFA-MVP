"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import type { ResetRecord } from "@/types/schedule";

export interface RemoveEntryDialogProps {
  record: ResetRecord | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (record: ResetRecord, internalNotes: string | null) => void;
}

export function RemoveEntryDialog({ record, onOpenChange, onConfirm }: RemoveEntryDialogProps) {
  const [internalNotes, setInternalNotes] = useState("");

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setInternalNotes("");
    }
  }

  function handleSubmit() {
    if (!record) return;
    onConfirm(record, internalNotes.trim() === "" ? null : internalNotes.trim());
    handleOpenChange(false);
  }

  return (
    <Dialog.Root open={record !== null} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="font-heading text-header-lg font-semibold text-gray-900">Remove Entry</Dialog.Title>

          <p className="mt-4 border-t border-gray-200 pt-4 text-body-md text-gray-700">
            Are you sure you want to remove <span className="font-semibold">1 entry</span> item from the schedule?
          </p>

          <div className="mt-4">
            <p className="font-heading text-header-sm font-bold text-gray-900">
              Internal Notes <span className="font-sans text-body-md font-normal text-gray-400">(only visible in the history)</span>
            </p>
            <input
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              placeholder="Internal notes (ex. explaining why the change is happening)"
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-body-md outline-none focus:border-primary"
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button variant="default" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
