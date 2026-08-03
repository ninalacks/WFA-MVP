import { formatTimestamp } from "@/lib/format";
import type { ScheduleMetadata } from "@/types/schedule";

export interface ScheduleHeaderProps {
  metadata: ScheduleMetadata;
}

export function ScheduleHeader({ metadata }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-6">
      <h1 className="text-2xl font-semibold text-gray-900">Published KOMPASS Schedule</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>Version {metadata.version}</span>
        <span aria-hidden>&middot;</span>
        <span>Last updated {formatTimestamp(metadata.lastUpdated)}</span>
      </div>
    </div>
  );
}
