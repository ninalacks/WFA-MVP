import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface MXDataTableColumn<T> {
  key: string
  header: ReactNode
  align?: "left" | "center" | "right"
  render: (row: T) => ReactNode
}

export interface MXDataTableProps<T> {
  columns: MXDataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  emptyMessage?: ReactNode
  className?: string
}

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

export function MXDataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No data available.",
  className,
}: MXDataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-md ring-1 ring-foreground/10", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn("h-8 bg-muted/50 py-1.5", ALIGN_CLASSES[column.align ?? "left"])}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("py-1.5", ALIGN_CLASSES[column.align ?? "left"])}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
