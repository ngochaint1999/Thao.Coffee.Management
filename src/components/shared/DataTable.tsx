import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight, ChevronsUpDown, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "./EmptyState"

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Returning a value here makes the column sortable. */
  sortValue?: (row: T) => string | number
  align?: "left" | "right" | "center"
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  pageSize?: number
  emptyMessage?: string
}

type SortState = { key: string; dir: "asc" | "desc" } | null

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const

/**
 * Generic, dependency-light data table with client-side sorting + pagination.
 * Sorting/paging are memoized so large lists don't re-sort on unrelated renders.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  pageSize = 10,
  emptyMessage = "Không có dữ liệu phù hợp.",
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sort) return data
    const col = columns.find((c) => c.key === sort.key)
    if (!col?.sortValue) return data
    const factor = sort.dir === "asc" ? 1 : -1
    // Copy before sort — never mutate the source array.
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * factor
      }
      return String(av).localeCompare(String(bv), "vi") * factor
    })
  }, [data, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = useMemo(
    () => sorted.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [sorted, safePage, pageSize]
  )

  function toggleSort(key: string) {
    setPage(0)
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" }
      if (prev.dir === "asc") return { key, dir: "desc" }
      return null
    })
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card">
        <EmptyState icon={Inbox} title={emptyMessage} />
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => {
              const isSorted = sort?.key === col.key
              return (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.align && alignClass[col.align],
                    col.headerClassName
                  )}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
                        isSorted && "text-foreground",
                        col.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {col.header}
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => (
            <TableRow
              key={getRowId(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(col.align && alignClass[col.align], col.className)}
                >
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            {safePage * pageSize + 1}–
            {Math.min((safePage + 1) * pageSize, sorted.length)} / {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-foreground">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
