import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

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
