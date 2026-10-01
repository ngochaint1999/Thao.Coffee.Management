import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Cpu, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
import {
  OrderStatusBadge,
  PaymentStatusBadge,
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
import { orders } from "@/data/orders"
import { channelMeta, orderStatusMeta } from "@/lib/labels"
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/format"
import type { Order, OrderStatus } from "@/types"

type StatusFilter = "all" | OrderStatus

export default function Orders() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const debounced = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((o) => {
        if (status !== "all" && o.status !== status) return false
        if (!q) return true
        return (
          o.code.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q)
        )
      })
  }, [debounced, status])

  const summary = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0)
    const processing = orders.filter((o) =>
      ["pending", "confirmed", "processing", "shipping", "installing"].includes(
        o.status
      )
    ).length
    const outstanding = orders.reduce(
      (s, o) => s + (o.total - o.paidAmount),
      0
    )
    return { revenue, processing, outstanding }
  }, [])

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        key: "code",
        header: "Mã đơn",
        sortValue: (o) => o.code,
        cell: (o) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{o.code}</span>
            {o.hasMachine && (
              <Cpu className="h-3.5 w-3.5 text-primary" aria-label="Đơn có máy pha" />
            )}
          </div>
        ),
      },
      {
        key: "customer",
        header: "Khách hàng",
        sortValue: (o) => o.customerName,
        cell: (o) => <span className="font-medium">{o.customerName}</span>,
      },
      {
        key: "items",
        header: "Sản phẩm",
        cell: (o) => (
          <span className="text-sm text-muted-foreground">
            {o.items.length} mặt hàng
          </span>
        ),
      },
      {
        key: "channel",
        header: "Kênh",
        sortValue: (o) => o.channel,
        cell: (o) => <Badge variant="muted">{channelMeta[o.channel]}</Badge>,
      },
      {
        key: "total",
        header: "Tổng tiền",
        align: "right",
        sortValue: (o) => o.total,
        cell: (o) => (
          <span className="font-medium">{formatCurrency(o.total)}</span>
        ),
      },
      {
        key: "payment",
        header: "Thanh toán",
        sortValue: (o) => o.paymentStatus,
        cell: (o) => <PaymentStatusBadge status={o.paymentStatus} />,
      },
      {
        key: "status",
        header: "Trạng thái",
        sortValue: (o) => o.status,
        cell: (o) => <OrderStatusBadge status={o.status} />,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        align: "right",
        sortValue: (o) => o.createdAt,
        cell: (o) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(o.createdAt)}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bán hàng"
        title="Đơn hàng"
        description="Theo dõi đơn hàng, thanh toán, giao hàng và lắp đặt."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Tạo đơn hàng
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Doanh thu (chưa gồm đơn hủy)"
          value={formatCompactCurrency(summary.revenue)}
          icon={Cpu}
          accent="success"
        />
        <StatCard
          label="Đơn đang xử lý"
          value={formatNumber(summary.processing)}
          icon={Cpu}
          accent="warning"
        />
        <StatCard
          label="Công nợ phải thu"
          value={formatCompactCurrency(summary.outstanding)}
          icon={Cpu}
          accent="destructive"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm mã đơn, khách hàng…"
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
            {(
              Object.keys(orderStatusMeta) as OrderStatus[]
            ).map((s) => (
              <SelectItem key={s} value={s}>
                {orderStatusMeta[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} đơn hàng
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(o) => o.id}
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
        emptyMessage="Không tìm thấy đơn hàng phù hợp."
      />
    </div>
  )
}
