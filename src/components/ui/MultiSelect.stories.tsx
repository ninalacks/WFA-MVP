import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MultiSelect } from "./MultiSelect";

const OPTIONS = [
  { value: "grocery", label: "Grocery" },
  { value: "dairy", label: "Dairy" },
  { value: "frozen", label: "Frozen" },
  { value: "bakery", label: "Bakery" },
];

function MultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>(["dairy"]);
  return (
    <MultiSelect label="Department" options={OPTIONS} selected={selected} onChange={setSelected} />
  );
}

const meta = {
  title: "UI/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { label: "Department", options: OPTIONS, selected: [], onChange: () => {} },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <MultiSelectDemo />,
};

export const NoSelection: Story = {
  args: { label: "Department", options: OPTIONS, selected: [], onChange: () => {} },
};

export const WithSelections: Story = {
  args: {
    label: "Department",
    options: OPTIONS,
    selected: ["dairy", "frozen"],
    onChange: () => {},
  },
};
