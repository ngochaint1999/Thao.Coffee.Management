import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  SlidersHorizontal,
  Warehouse as WarehouseIcon,
  AlertTriangle,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { inventory, stockMoves, warehouses } from "@/data/inventory"
import { categoryMeta } from "@/lib/labels"
import { formatDateTime, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { InventoryRow, StockMove, StockMoveType } from "@/types"

const moveMeta: Record<
  StockMoveType,
  { label: string; icon: typeof ArrowDownLeft; className: string }
> = {
  in: { label: "Nhập kho", icon: ArrowDownLeft, className: "text-success" },
  out: { label: "Xuất kho", icon: ArrowUpRight, className: "text-destructive" },
  transfer: {
    label: "Chuyển kho",
    icon: ArrowLeftRight,
    className: "text-sky-600",
  },
  adjust: {
    label: "Điều chỉnh",
    icon: SlidersHorizontal,
    className: "text-warning",
  },
}

export default function Inventory() {
  const [params, setParams] = useSearchParams()
  const tab = params.get("tab") === "moves" ? "moves" : "stock"
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query)

  const filteredStock = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return inventory
    return inventory.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
    )
  }, [debounced])

  const summary = useMemo(() => {
    const belowReorder = inventory.filter(
      (r) => r.available <= r.reorderPoint
    ).length
    const reserved = inventory.reduce((s, r) => s + r.reserved, 0)
    const incoming = inventory.reduce((s, r) => s + r.incoming, 0)
    return { belowReorder, reserved, incoming }
  }, [])

  const stockColumns = useMemo<Column<InventoryRow>[]>(
    () => [
      {
        key: "name",
        header: "Sản phẩm",
        sortValue: (r) => r.name,
        cell: (r) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{r.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{r.sku}</p>
          </div>
        ),
      },
      {
        key: "category",
        header: "Nhóm",
        sortValue: (r) => r.category,
        cell: (r) => <Badge variant="muted">{categoryMeta[r.category]}</Badge>,
      },
      {
        key: "warehouse",
        header: "Kho",
        cell: (r) => (
          <span className="text-sm text-muted-foreground">
            {r.warehouseName}
          </span>
        ),
      },
      {
        key: "onHand",
        header: "Thực tế",
        align: "right",
        sortValue: (r) => r.onHand,
        cell: (r) => formatNumber(r.onHand),
      },
      {
        key: "reserved",
        header: "Đang giữ",
        align: "right",
        sortValue: (r) => r.reserved,
        cell: (r) => (
          <span className="text-muted-foreground">
            {formatNumber(r.reserved)}
          </span>
        ),
      },
      {
        key: "available",
        header: "Có thể bán",
        align: "right",
        sortValue: (r) => r.available,
        cell: (r) => {
          const low = r.available <= r.reorderPoint
          return (
            <span
              className={cn(
                "font-medium",
                low && "inline-flex items-center gap-1 text-destructive"
              )}
            >
              {low && <AlertTriangle className="h-3.5 w-3.5" />}
              {formatNumber(r.available)}
            </span>
          )
        },
      },
      {
        key: "incoming",
        header: "Đang nhập",
        align: "right",
        sortValue: (r) => r.incoming,
        cell: (r) =>
          r.incoming > 0 ? (
            <Badge variant="secondary">+{formatNumber(r.incoming)}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
    ],
    []
  )

  const moveColumns = useMemo<Column<StockMove>[]>(
    () => [
      {
        key: "code",
        header: "Mã phiếu",
        sortValue: (m) => m.code,
        cell: (m) => <span className="font-mono text-sm">{m.code}</span>,
      },
      {
        key: "type",
        header: "Loại",
        sortValue: (m) => m.type,
        cell: (m) => {
          const meta = moveMeta[m.type]
          const Icon = meta.icon
          return (
            <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", meta.className)}>
              <Icon className="h-4 w-4" />
              {meta.label}
            </span>
          )
        },
      },
      {
        key: "product",
        header: "Sản phẩm",
        cell: (m) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{m.productName}</p>
            <p className="font-mono text-xs text-muted-foreground">{m.sku}</p>
          </div>
        ),
      },
      {
        key: "quantity",
        header: "Số lượng",
        align: "right",
        sortValue: (m) => m.quantity,
        cell: (m) => (
          <span className={cn("font-medium", m.quantity < 0 && "text-destructive")}>
            {m.quantity > 0 ? "+" : ""}
            {formatNumber(m.quantity)}
          </span>
        ),
      },
      {
        key: "route",
        header: "Kho",
        cell: (m) => (
          <span className="text-sm text-muted-foreground">
            {m.fromWarehouse ?? "—"}
            {m.toWarehouse ? ` → ${m.toWarehouse}` : ""}
          </span>
        ),
      },
      {
        key: "reference",
        header: "Tham chiếu",
        cell: (m) => <span className="text-sm">{m.reference}</span>,
      },
      {
        key: "at",
        header: "Thời gian",
        align: "right",
        sortValue: (m) => m.at,
        cell: (m) => (
          <span className="text-xs text-muted-foreground">
            {formatDateTime(m.at)}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kho"
        title="Quản lý kho"
        description="Tồn kho theo từng kho, lịch sử nhập/xuất/chuyển kho và cảnh báo tồn tối thiểu."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Số kho"
          value={formatNumber(warehouses.length)}
          icon={WarehouseIcon}
        />
        <StatCard
          label="Mặt hàng dưới mức tồn tối thiểu"
          value={formatNumber(summary.belowReorder)}
          icon={AlertTriangle}
          accent="destructive"
        />
        <StatCard
          label="Đang giữ cho đơn"
          value={formatNumber(summary.reserved)}
          icon={WarehouseIcon}
          accent="warning"
        />
        <StatCard
          label="Đang trên đường nhập"
          value={formatNumber(summary.incoming)}
          icon={ArrowDownLeft}
          accent="primary"
        />
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) =>
          setParams(v === "moves" ? { tab: "moves" } : {}, { replace: true })
        }
      >
        <TabsList>
          <TabsTrigger value="stock">Tồn kho</TabsTrigger>
          <TabsTrigger value="moves">Nhập / xuất kho</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Tìm sản phẩm trong kho…"
          />
          <DataTable
            columns={stockColumns}
            data={filteredStock}
            getRowId={(r) => `${r.productId}-${r.warehouseId}`}
            pageSize={12}
            emptyMessage="Không tìm thấy mặt hàng phù hợp."
          />
        </TabsContent>

        <TabsContent value="moves">
          <DataTable
            columns={moveColumns}
            data={stockMoves}
            getRowId={(m) => m.id}
            emptyMessage="Chưa có phiếu nhập/xuất kho."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
