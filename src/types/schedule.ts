export type ResetStatus = "Added" | "Modified" | "Removed";

export type UserRole = "Creator" | "Viewer";

export type ScheduleView = "Draft" | "Published";

export interface ResetRecord {
  id: string;
  crossCommodity: boolean;
  status: ResetStatus | null;
  readyToPublish: boolean;
  modifiedBy: string;
  modifiedAt: string;
  type: string;
  department: string;
  commodity: string;
  categoryManager: string;
  processManager: string;
  coreSize: string;
  start: string;
  durationWeeks: number;
  hours: number | null;
  divisions: string[];
  comments: string | null;
  internalNotes: string | null;
  fiscalYear: number;
  period: number;
  week: number;
}

export interface NewEntryDraft {
  type: string;
  crossCommodity: boolean;
  divisions: string[];
  department: string;
  commodity: string;
  categoryManager: string;
  processManager: string;
  coreSize: string;
  hours: number | null;
  comments: string | null;
  internalNotes: string | null;
  periods: PeriodWeekOption[];
}

export interface PeriodWeekOption {
  label: string;
  period: number;
  week: number;
}

export interface FilterOptionLists {
  fiscalYears: number[];
  departments: string[];
  commodities: string[];
  types: string[];
  categoryManagers: string[];
  processManagers: string[];
  periodWeeks: PeriodWeekOption[];
  divisions: string[];
  statuses: ResetStatus[];
  coreSizes: string[];
}

export interface FilterState {
  fiscalYears: number[];
  departments: string[];
  commodities: string[];
  types: string[];
  categoryManagers: string[];
  processManagers: string[];
  periodWeeks: string[];
  divisions: string[];
  statuses: ResetStatus[];
}

export const EMPTY_FILTER_STATE: FilterState = {
  fiscalYears: [],
  departments: [],
  commodities: [],
  types: [],
  categoryManagers: [],
  processManagers: [],
  periodWeeks: [],
  divisions: [],
  statuses: [],
};

export type SortableColumn =
  | "status"
  | "modifiedBy"
  | "type"
  | "department"
  | "commodity"
  | "categoryManager"
  | "processManager"
  | "coreSize"
  | "start"
  | "durationWeeks"
  | "hours"
  | "divisionsCount";

export type SortDirection = "asc" | "desc";

export interface SortState {
  column: SortableColumn | null;
  direction: SortDirection | null;
}

export interface ScheduleMetadata {
  version: string;
  lastUpdated: string;
  publishedStatus: "Published" | "Not Published";
}

export interface FieldChange {
  label: string;
  before: string;
  after: string;
}

export interface HistoryEntry {
  recordId: string;
  status: ResetStatus;
  commodity: string;
  divisions: string[];
  period: number;
  week: number;
  modifiedBy: string;
  modifiedAt: string;
  internalNotes: string | null;
  changes: FieldChange[];
}

export interface PublishLogEntry {
  version: string;
  publishedAt: string;
  entries: HistoryEntry[];
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: string;
}
