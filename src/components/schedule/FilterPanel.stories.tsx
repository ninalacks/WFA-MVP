import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { filterOptionLists } from "@/lib/mock/schedule-data";
import { EMPTY_FILTER_STATE } from "@/types/schedule";
import type { FilterState } from "@/types/schedule";

import { FilterPanel } from "./FilterPanel";

function FilterPanelDemo() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE);
  return (
    <FilterPanel
      options={filterOptionLists}
      filters={filters}
      onChange={setFilters}
      savedFilters={[]}
      onApplySavedFilter={() => {}}
      onDeleteSavedFilter={() => {}}
    />
  );
}

const meta = {
  title: "Schedule/FilterPanel",
  component: FilterPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    options: filterOptionLists,
    filters: EMPTY_FILTER_STATE,
    onChange: fn(),
    savedFilters: [],
    onApplySavedFilter: fn(),
    onDeleteSavedFilter: fn(),
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <FilterPanelDemo />,
};

export const WithSavedFilters: Story = {
  args: {
    savedFilters: [
      {
        id: "1",
        name: "My Grocery Q3",
        filters: EMPTY_FILTER_STATE,
        createdAt: new Date().toISOString(),
      },
    ],
  },
};
