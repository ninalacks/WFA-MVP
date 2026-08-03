import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { resetRecords } from "@/lib/mock/schedule-data";

import { ScheduleTable } from "./ScheduleTable";

const meta = {
  title: "Schedule/ScheduleTable",
  component: ScheduleTable,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    records: resetRecords,
    sort: { column: null, direction: null },
    onSortChange: fn(),
    hasSchedule: true,
    onClearFilters: fn(),
  },
} satisfies Meta<typeof ScheduleTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sorted: Story = {
  args: { sort: { column: "start", direction: "asc" } },
};

export const EmptyResults: Story = {
  args: { records: [] },
};

export const NoPublishedSchedule: Story = {
  args: { records: [], hasSchedule: false },
};
