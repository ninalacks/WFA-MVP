import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { filterOptionLists } from "@/lib/mock/schedule-data";

import { ActionBar } from "./ActionBar";

const meta = {
  title: "Schedule/ActionBar",
  component: ActionBar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    isDownloading: false,
    onDownload: fn(),
    isFilterEmpty: false,
    onSaveFilter: fn(),
    filterOptionLists,
    onAddEntry: fn(),
    showPublishActions: true,
    canPublish: true,
    onPublish: fn(),
    onReadyToPublish: fn(),
    showViewToggle: true,
    view: "Draft",
    onViewChange: fn(),
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Downloading: Story = {
  args: { isDownloading: true },
};

export const NoFiltersApplied: Story = {
  args: { isFilterEmpty: true },
};

export const PublishDisabled: Story = {
  args: { canPublish: false },
};

export const ReadOnly: Story = {
  args: { readOnly: true, showPublishActions: false },
};
