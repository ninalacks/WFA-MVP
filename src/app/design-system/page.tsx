"use client"

import { useState } from "react"

import {
  MXBadge,
  MXButton,
  MXCard,
  MXDataTable,
  MXDialog,
  MXInput,
  MXSelect,
  type MXBadgeTone,
} from "@/components/mx"

interface DemoRow {
  id: string
  commodity: string
  status: "Completed" | "Modified" | "Removed"
  categoryManager: string
  start: string
}

const STATUS_TONE: Record<DemoRow["status"], MXBadgeTone> = {
  Completed: "success",
  Modified: "warning",
  Removed: "danger",
}

const DEMO_ROWS: DemoRow[] = [
  { id: "1", commodity: "Dairy", status: "Completed", categoryManager: "J. Alvarez", start: "2026-02-02" },
  { id: "2", commodity: "Frozen Foods", status: "Modified", categoryManager: "R. Chen", start: "2026-02-16" },
  { id: "3", commodity: "Snacks", status: "Removed", categoryManager: "M. Patel", start: "2026-03-02" },
]

const DIVISION_OPTIONS = [
  { value: "atlanta", label: "Atlanta" },
  { value: "columbus", label: "Columbus" },
  { value: "dallas", label: "Dallas" },
]

export default function DesignSystemPage() {
  const [division, setDivision] = useState<string | null>(null)
  const [filterName, setFilterName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <header>
        <h1 className="text-xl font-semibold text-foreground">MX Design System</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable MX-branded wrapper components built on shadcn/ui.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Buttons</h2>
        <div className="flex flex-wrap items-center gap-2">
          <MXButton variant="primary">Primary</MXButton>
          <MXButton variant="secondary">Secondary</MXButton>
          <MXButton variant="ghost">Ghost</MXButton>
          <MXButton variant="danger">Danger</MXButton>
          <MXButton variant="primary" disabled>
            Disabled
          </MXButton>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Status badges</h2>
        <div className="flex flex-wrap items-center gap-2">
          <MXBadge tone="neutral">Neutral</MXBadge>
          <MXBadge tone="info">Info</MXBadge>
          <MXBadge tone="success">Completed</MXBadge>
          <MXBadge tone="warning">Modified</MXBadge>
          <MXBadge tone="danger">Removed</MXBadge>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Dashboard cards</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MXCard title="Active Resets" description="Current fiscal year">
            <p className="text-2xl font-semibold text-foreground">128</p>
          </MXCard>
          <MXCard title="Pending Approvals" description="Awaiting category manager">
            <p className="text-2xl font-semibold text-foreground">14</p>
          </MXCard>
          <MXCard
            title="Cross-Commodity"
            description="Resets spanning multiple commodities"
            action={<MXBadge tone="info">12%</MXBadge>}
          >
            <p className="text-2xl font-semibold text-foreground">37</p>
          </MXCard>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Form fields</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-lg">
          <MXInput
            label="Filter name"
            placeholder="e.g. My Q3 Dairy View"
            value={filterName}
            onChange={(event) => setFilterName(event.target.value)}
            hint="Used to identify this saved filter later."
          />
          <MXInput label="Reset ID" defaultValue="" error="Reset ID is required" />
          <MXSelect
            label="Division"
            value={division}
            onChange={setDivision}
            options={DIVISION_OPTIONS}
            placeholder="Select a division"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Data table</h2>
        <MXDataTable
          columns={[
            { key: "commodity", header: "Commodity", render: (row) => row.commodity },
            {
              key: "status",
              header: "Status",
              render: (row) => <MXBadge tone={STATUS_TONE[row.status]}>{row.status}</MXBadge>,
            },
            { key: "categoryManager", header: "Category Manager", render: (row) => row.categoryManager },
            { key: "start", header: "Start", align: "right", render: (row) => row.start },
          ]}
          rows={DEMO_ROWS}
          getRowKey={(row) => row.id}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Dialog</h2>
        <MXButton variant="secondary" onClick={() => setDialogOpen(true)}>
          Open dialog
        </MXButton>
        <MXDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Save current filters"
          description="This will save your current filter selection for quick access later."
          footer={
            <>
              <MXButton variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </MXButton>
              <MXButton variant="primary" onClick={() => setDialogOpen(false)}>
                Save
              </MXButton>
            </>
          }
        >
          <MXInput
            label="Filter name"
            value={filterName}
            onChange={(event) => setFilterName(event.target.value)}
          />
        </MXDialog>
      </section>
    </div>
  )
}
