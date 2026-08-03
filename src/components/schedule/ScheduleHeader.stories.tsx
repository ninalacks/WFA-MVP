import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { scheduleMetadata } from "@/lib/mock/schedule-data";

import { ScheduleHeader } from "./ScheduleHeader";

const meta = {
  title: "Schedule/ScheduleHeader",
  component: ScheduleHeader,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof ScheduleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { metadata: scheduleMetadata },
};
