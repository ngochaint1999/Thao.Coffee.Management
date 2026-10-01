import { useMemo, useState } from "react"
import { Coffee, Package, Plus, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
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
import { products } from "@/data/products"
import { categoryMeta } from "@/lib/labels"
import { formatCompactCurrency, formatNumber } from "@/lib/format"
import type { Product, ProductCategory } from "@/types"

type CatFilter = "all" | ProductCategory

const categoryBadgeVariant: Record<
  ProductCategory,
  "default" | "secondary" | "muted"
> = {
  machine: "default",
  grinder: "default",
  bean: "secondary",
  accessory: "muted",
  consumable: "muted",
  part: "muted",
}

export default function Products() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<CatFilter>("all")
  const debounced = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    })
  }, [debounced, cat])

  const summary = useMemo(() => {
    const assets = products.filter((p) => p.isAsset).length
    const lowStock = products.filter((p) => p.stock <= p.reorderPoint).length
    const stockValue = products.reduce(
      (s, p) => s + p.costPrice * p.stock,
      0
    )
    return { total: products.length, assets, lowStock, stockValue }
  }, [])

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: "name",
        header: "Sản phẩm",
        sortValue: (p) => p.name,
        cell: (p) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{p.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
          </div>
        ),
      },
      {
        key: "category",
        header: "Nhóm",
        sortValue: (p) => p.category,
        cell: (p) => (
          <div className="flex items-center gap-1.5">
            <Badge variant={categoryBadgeVariant[p.category]}>
              {categoryMeta[p.category]}
            </Badge>
            {p.isAsset && (
              <span
                className="text-[10px] text-muted-foreground"
                title="Tài sản vòng đời dài — quản lý theo serial"
              >
                serial
              </span>
            )}
          </div>
        ),
      },
      {
        key: "costPrice",
        header: "Giá vốn",
        align: "right",
        sortValue: (p) => p.costPrice,
        cell: (p) => (
          <span className="text-muted-foreground">
            {formatCompactCurrency(p.costPrice)}
          </span>
        ),
      },
      {
        key: "salePrice",
        header: "Giá bán",
        align: "right",
        sortValue: (p) => p.salePrice,
        cell: (p) => (
          <span className="font-medium">
            {formatCompactCurrency(p.salePrice)}
          </span>
        ),
      },
      {
        key: "stock",
        header: "Tồn kho",
        align: "right",
        sortValue: (p) => p.stock,
        cell: (p) => {
          const low = p.stock <= p.reorderPoint
          return (
            <span
              className={
                low
                  ? "inline-flex items-center gap-1 font-medium text-destructive"
                  : "font-medium"
              }
            >
              {low && <AlertTriangle className="h-3.5 w-3.5" />}
              {formatNumber(p.stock)} {p.unit}
            </span>
          )
        },
      },
      {
        key: "supplier",
        header: "Nhà cung cấp",
        sortValue: (p) => p.supplier,
        cell: (p) => (
          <span className="text-sm text-muted-foreground">{p.supplier}</span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sản phẩm"
        title="Danh mục sản phẩm"
        description="Máy pha, máy xay, hạt cà phê, phụ kiện, vật tư và linh kiện."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng sản phẩm"
          value={formatNumber(summary.total)}
          icon={Coffee}
        />
        <StatCard
          label="Tài sản (máy, quản lý serial)"
          value={formatNumber(summary.assets)}
          icon={Package}
          accent="primary"
        />
        <StatCard
          label="Sắp hết hàng"
          value={formatNumber(summary.lowStock)}
          icon={AlertTriangle}
          accent="destructive"
        />
        <StatCard
          label="Giá trị tồn kho (giá vốn)"
          value={formatCompactCurrency(summary.stockValue)}
          icon={Package}
          accent="success"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo tên hoặc SKU…"
        />
        <Select value={cat} onValueChange={(v) => setCat(v as CatFilter)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Nhóm sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhóm</SelectItem>
            {(Object.keys(categoryMeta) as ProductCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {categoryMeta[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} sản phẩm
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(p) => p.id}
        pageSize={12}
        emptyMessage="Không tìm thấy sản phẩm phù hợp."
      />
    </div>
  )
}
