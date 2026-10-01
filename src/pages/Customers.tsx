import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Plus, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatCard } from "@/components/shared/StatCard"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { customers } from "@/data/customers"
import { customerTypeMeta } from "@/lib/labels"
import {
  formatCompactCurrency,
  formatNumber,
  formatRelative,
  initials,
} from "@/lib/format"
import type { Customer, CustomerType } from "@/types"

type TypeFilter = "all" | CustomerType

export default function Customers() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<TypeFilter>("all")
  const debounced = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return customers.filter((c) => {
      if (type !== "all" && c.type !== type) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      )
    })
  }, [debounced, type])

  const summary = useMemo(() => {
    const business = customers.filter((c) => c.type === "business").length
    const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0)
    return { total: customers.length, business, totalSpent }
  }, [])

  const columns = useMemo<Column<Customer>[]>(
    () => [
      {
        key: "name",
        header: "Khách hàng",
        sortValue: (c) => c.name,
        cell: (c) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials(c.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{c.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
            </div>
          </div>
        ),
      },
      {
        key: "type",
        header: "Phân loại",
        sortValue: (c) => c.type,
        cell: (c) => (
          <Badge variant={customerTypeMeta[c.type].variant}>
            {customerTypeMeta[c.type].label}
          </Badge>
        ),
      },
      {
        key: "contact",
        header: "Liên hệ",
        cell: (c) => (
          <div className="text-sm">
            <p>{c.phone}</p>
            <p className="truncate text-xs text-muted-foreground">{c.email}</p>
          </div>
        ),
      },
      {
        key: "city",
        header: "Khu vực",
        sortValue: (c) => c.city,
        cell: (c) => c.city,
      },
      {
        key: "machines",
        header: "Máy sở hữu",
        align: "right",
        sortValue: (c) => c.machinesOwned,
        cell: (c) => formatNumber(c.machinesOwned),
      },
      {
        key: "totalSpent",
        header: "Tổng chi tiêu",
        align: "right",
        sortValue: (c) => c.totalSpent,
        cell: (c) => (
          <span className="font-medium">
            {formatCompactCurrency(c.totalSpent)}
          </span>
        ),
      },
      {
        key: "owner",
        header: "Phụ trách",
        sortValue: (c) => c.owner,
        cell: (c) => c.owner,
      },
      {
        key: "lastActivity",
        header: "Hoạt động",
        align: "right",
        sortValue: (c) => c.lastActivityAt,
        cell: (c) => (
          <span className="text-xs text-muted-foreground">
            {formatRelative(c.lastActivityAt)}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Khách hàng"
        description="Danh sách khách cá nhân và doanh nghiệp, tổng chi tiêu và người phụ trách."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Xuất Excel
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Thêm khách hàng
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng khách hàng"
          value={formatNumber(summary.total)}
          icon={Users}
        />
        <StatCard
          label="Khách doanh nghiệp (B2B)"
          value={formatNumber(summary.business)}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Tổng chi tiêu lũy kế"
          value={formatCompactCurrency(summary.totalSpent)}
          icon={Users}
          accent="success"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo tên, mã, SĐT, email…"
        />
        <Select value={type} onValueChange={(v) => setType(v as TypeFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Phân loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phân loại</SelectItem>
            <SelectItem value="business">Doanh nghiệp</SelectItem>
            <SelectItem value="individual">Cá nhân</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} khách hàng
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(c) => c.id}
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
        emptyMessage="Không tìm thấy khách hàng phù hợp."
      />
    </div>
  )
}
