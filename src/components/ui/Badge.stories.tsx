import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: "neutral", children: "No Changes" } };
export const Info: Story = { args: { tone: "info", children: "In Progress" } };
export const Success: Story = { args: { tone: "success", children: "Completed" } };
export const Warning: Story = { args: { tone: "warning", children: "Modified" } };
export const Danger: Story = { args: { tone: "danger", children: "Removed" } };
