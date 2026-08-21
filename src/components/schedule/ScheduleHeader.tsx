import { formatTimestamp } from "@/lib/format";
import type { ScheduleMetadata, ScheduleView } from "@/types/schedule";

export interface ScheduleHeaderProps {
  metadata: ScheduleMetadata;
  view: ScheduleView;
}

export function ScheduleHeader({ metadata, view }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-6">
      <h1 className="font-heading text-header-xl font-semibold text-gray-900">
        {view === "Draft" ? "Draft KOMPASS Schedule" : "Published KOMPASS Schedule"}
      </h1>
      <div className="flex items-center gap-3 text-body-sm text-gray-500">
        <span>Version {metadata.version}</span>
        <span aria-hidden>&middot;</span>
        <span>Last updated {formatTimestamp(metadata.lastUpdated)}</span>
      </div>
    </div>
  );
}
