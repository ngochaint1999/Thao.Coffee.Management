import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, ShieldAlert, Clock, Wrench, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
import {
  WarrantyPriorityBadge,
  WarrantyStatusBadge,
} from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { warranties } from "@/data/warranties"
import { warrantyStatusMeta } from "@/lib/labels"
import { formatDate, formatNumber } from "@/lib/format"
import type { WarrantyStatus, WarrantyTicket } from "@/types"

type StatusFilter = "all" | WarrantyStatus

export default function Warranties() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const debounced = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return [...warranties]
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
      .filter((w) => {
        if (status !== "all" && w.status !== status) return false
        if (!q) return true
        return (
          w.code.toLowerCase().includes(q) ||
          w.serial.toLowerCase().includes(q) ||
          w.customerName.toLowerCase().includes(q)
        )
      })
  }, [debounced, status])

  const summary = useMemo(() => {
    const open = warranties.filter(
      (w) => w.status !== "completed" && w.status !== "rejected"
    ).length
    const waitingPart = warranties.filter(
      (w) => w.status === "waiting_part"
    ).length
    const outOfWarranty = warranties.filter((w) => !w.underWarranty).length
    return { total: warranties.length, open, waitingPart, outOfWarranty }
  }, [])

  const columns = useMemo<Column<WarrantyTicket>[]>(
    () => [
      {
        key: "code",
        header: "Mã phiếu",
        sortValue: (w) => w.code,
        cell: (w) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{w.code}</span>
            {!w.underWarranty && (
              <Badge variant="muted" className="text-[10px]">
                Hết BH
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "serial",
        header: "Serial / Model",
        sortValue: (w) => w.serial,
        cell: (w) => (
          <div className="min-w-0">
            <Link
              to={`/serials?q=${w.serial}`}
              className="font-mono text-sm text-primary hover:underline"
            >
              {w.serial}
            </Link>
            <p className="truncate text-xs text-muted-foreground">{w.model}</p>
          </div>
        ),
      },
      {
        key: "customer",
        header: "Khách hàng",
        sortValue: (w) => w.customerName,
        cell: (w) => (
          <Link
            to={`/customers/${w.customerId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {w.customerName}
          </Link>
        ),
      },
      {
        key: "issue",
        header: "Mô tả lỗi",
        cell: (w) => (
          <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground">
            {w.issue}
          </span>
        ),
      },
      {
        key: "priority",
        header: "Ưu tiên",
        sortValue: (w) => w.priority,
        cell: (w) => <WarrantyPriorityBadge priority={w.priority} />,
      },
      {
        key: "status",
        header: "Trạng thái",
        sortValue: (w) => w.status,
        cell: (w) => <WarrantyStatusBadge status={w.status} />,
      },
      {
        key: "technician",
        header: "KTV",
        sortValue: (w) => w.technician,
        cell: (w) => <span className="text-sm">{w.technician}</span>,
      },
      {
        key: "receivedAt",
        header: "Tiếp nhận",
        align: "right",
        sortValue: (w) => w.receivedAt,
        cell: (w) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(w.receivedAt)}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kỹ thuật & Hậu mãi"
        title="Bảo hành"
        description="Tiếp nhận, chẩn đoán và xử lý bảo hành/sửa chữa gắn với serial và khách hàng sở hữu."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Tạo phiếu bảo hành
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng phiếu"
          value={formatNumber(summary.total)}
          icon={ShieldCheck}
        />
        <StatCard
          label="Đang xử lý"
          value={formatNumber(summary.open)}
          icon={Wrench}
          accent="warning"
        />
        <StatCard
          label="Chờ linh kiện"
          value={formatNumber(summary.waitingPart)}
          icon={Clock}
          accent="destructive"
        />
        <StatCard
          label="Ngoài bảo hành"
          value={formatNumber(summary.outOfWarranty)}
          icon={ShieldAlert}
          accent="primary"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm mã phiếu, serial, khách hàng…"
        />
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {(Object.keys(warrantyStatusMeta) as WarrantyStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {warrantyStatusMeta[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} phiếu
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(w) => w.id}
        pageSize={12}
        emptyMessage="Không tìm thấy phiếu bảo hành phù hợp."
      />
    </div>
  )
}
