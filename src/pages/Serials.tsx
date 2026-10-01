import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Cpu, ShieldCheck, Boxes, Wrench } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
import { SerialStatusBadge } from "@/components/shared/StatusBadge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { serials } from "@/data/serials"
import { serialStatusMeta } from "@/lib/labels"
import { formatDate, formatNumber } from "@/lib/format"
import type { MachineSerial, SerialStatus } from "@/types"

type StatusFilter = "all" | SerialStatus

export default function Serials() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [status, setStatus] = useState<StatusFilter>("all")
  const debounced = useDebouncedValue(query)

  // Keep the box in sync if we arrive via a deep link (e.g. from a customer page).
  useEffect(() => {
    const q = params.get("q")
    if (q) setQuery(q)
  }, [params])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return serials.filter((s) => {
      if (status !== "all" && s.status !== status) return false
      if (!q) return true
      return (
        s.serial.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        (s.customerName?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [debounced, status])

  const summary = useMemo(() => {
    const inStock = serials.filter((s) => s.status === "in_stock").length
    const installed = serials.filter((s) => s.status === "installed").length
    const servicing = serials.filter(
      (s) => s.status === "under_warranty" || s.status === "repairing"
    ).length
    return { total: serials.length, inStock, installed, servicing }
  }, [])

  const columns = useMemo<Column<MachineSerial>[]>(
    () => [
      {
        key: "serial",
        header: "Số serial",
        sortValue: (s) => s.serial,
        cell: (s) => (
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-mono text-sm font-medium">{s.serial}</span>
          </div>
        ),
      },
      {
        key: "model",
        header: "Thiết bị",
        sortValue: (s) => s.model,
        cell: (s) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{s.brand} {s.model}</p>
            <p className="truncate text-xs text-muted-foreground">
              {s.productName}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        sortValue: (s) => s.status,
        cell: (s) => <SerialStatusBadge status={s.status} />,
      },
      {
        key: "owner",
        header: "Khách hàng / Kho",
        cell: (s) =>
          s.customerId ? (
            <Link
              to={`/customers/${s.customerId}`}
              className="text-sm text-primary hover:underline"
            >
              {s.customerName}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              {s.warehouseName ?? "—"}
            </span>
          ),
      },
      {
        key: "order",
        header: "Đơn hàng",
        cell: (s) =>
          s.orderCode ? (
            <span className="font-mono text-xs">{s.orderCode}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        key: "installedAt",
        header: "Ngày lắp",
        sortValue: (s) => s.installedAt ?? "",
        cell: (s) => (
          <span className="text-sm text-muted-foreground">
            {s.installedAt ? formatDate(s.installedAt) : "—"}
          </span>
        ),
      },
      {
        key: "warranty",
        header: "Hết bảo hành",
        align: "right",
        sortValue: (s) => s.warrantyEndsAt ?? "",
        cell: (s) => {
          if (!s.warrantyEndsAt)
            return <span className="text-muted-foreground">—</span>
          const expired = new Date(s.warrantyEndsAt).getTime() < Date.now()
          return (
            <span
              className={
                expired
                  ? "text-sm text-muted-foreground line-through"
                  : "text-sm font-medium text-success"
              }
            >
              {formatDate(s.warrantyEndsAt)}
            </span>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kho"
        title="Serial máy"
        description="Theo dõi từng thiết bị xuyên suốt vòng đời: nhập kho → bán → lắp đặt → bảo hành → sửa chữa."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng thiết bị"
          value={formatNumber(summary.total)}
          icon={Cpu}
        />
        <StatCard
          label="Trong kho"
          value={formatNumber(summary.inStock)}
          icon={Boxes}
          accent="primary"
        />
        <StatCard
          label="Đã lắp đặt"
          value={formatNumber(summary.installed)}
          icon={ShieldCheck}
          accent="success"
        />
        <StatCard
          label="Đang bảo hành / sửa"
          value={formatNumber(summary.servicing)}
          icon={Wrench}
          accent="warning"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm serial, model, khách hàng…"
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
            {(Object.keys(serialStatusMeta) as SerialStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {serialStatusMeta[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} thiết bị
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(s) => s.id}
        pageSize={12}
        emptyMessage="Không tìm thấy serial phù hợp."
      />
    </div>
  )
}
