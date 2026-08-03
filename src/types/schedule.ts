export type ResetStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface ResetRecord {
  id: string;
  crossCommodity: boolean;
  status: ResetStatus;
  type: string;
  department: string;
  commodity: string;
  categoryManager: string;
  processManager: string;
  coreSize: string;
  start: string;
  durationDays: number;
  hours: number | null;
  divisions: string[];
  comments: string | null;
  fiscalYear: number;
  period: number;
  week: number;
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
  | "type"
  | "department"
  | "commodity"
  | "categoryManager"
  | "processManager"
  | "coreSize"
  | "start"
  | "durationDays"
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

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: string;
}
