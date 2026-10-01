import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  AlertTriangle,
  CircleDollarSign,
  PackageX,
  ShoppingCart,
  Users,
  Wrench,
  ArrowRight,
  ShieldAlert,
  CalendarClock,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatCard } from "@/components/shared/StatCard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "@/components/shared/StatusBadge"
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/format"
import { categoryMeta } from "@/lib/labels"
import {
  categoryRevenue,
  revenueSeries,
  topProducts,
} from "@/data/dashboard"
import { orders } from "@/data/orders"
import { products } from "@/data/products"
import { installations } from "@/data/installations"
import { serials } from "@/data/serials"

const CHART_COLORS = ["#0f766e", "#0ea5e9", "#f59e0b", "#a855f7"]

export default function Dashboard() {
  const stats = useMemo(() => {
    const current = revenueSeries[revenueSeries.length - 1]
    const prev = revenueSeries[revenueSeries.length - 2]
    const revenueDelta = ((current.revenue - prev.revenue) / prev.revenue) * 100
    const orderDelta = ((current.orders - prev.orders) / prev.orders) * 100

    const lowStock = products.filter((p) => p.stock <= p.reorderPoint)
    const pendingInstalls = installations.filter(
      (i) => i.status === "scheduled" || i.status === "in_progress"
    )
    const underWarranty = serials.filter(
      (s) => s.status === "under_warranty" || s.status === "repairing"
    )

    return {
      revenue: current.revenue,
      revenueDelta: Math.round(revenueDelta * 10) / 10,
      orders: current.orders,
      orderDelta: Math.round(orderDelta * 10) / 10,
      newCustomers: 6,
      avgOrder: Math.round(current.revenue / current.orders),
      lowStock,
      pendingInstalls,
      underWarranty,
    }
  }, [])

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6),
    []
  )

  const upcomingInstalls = useMemo(
    () =>
      [...installations]
        .filter((i) => i.status !== "done" && i.status !== "cancelled")
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tổng quan"
        title="Dashboard điều hành"
        description="Bức tranh tổng thể về doanh thu, đơn hàng, kho và dịch vụ sau bán."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Doanh thu tháng này"
          value={formatCompactCurrency(stats.revenue)}
          delta={stats.revenueDelta}
          hint="so với tháng trước"
          icon={CircleDollarSign}
          accent="primary"
        />
        <StatCard
          label="Đơn hàng"
          value={formatNumber(stats.orders)}
          delta={stats.orderDelta}
          hint="so với tháng trước"
          icon={ShoppingCart}
          accent="success"
        />
        <StatCard
          label="Khách hàng mới"
          value={formatNumber(stats.newCustomers)}
          delta={20}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Giá trị đơn trung bình"
          value={formatCompactCurrency(stats.avgOrder)}
          icon={CircleDollarSign}
          hint="trên mỗi đơn trong tháng"
          accent="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu &amp; đơn hàng theo tháng</CardTitle>
            <CardDescription>6 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={revenueSeries}
                margin={{ left: 4, right: 8, top: 8 }}
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickFormatter={(v) => `${(v as number) / 1_000_000}tr`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={48}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Doanh thu"]}
                  labelClassName="text-xs"
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo nhóm</CardTitle>
            <CardDescription>Tỷ trọng theo loại sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={categoryRevenue}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                  {categoryRevenue.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts specific to the coffee-machine business */}
      <div className="grid gap-4 md:grid-cols-3">
        <AlertCard
          icon={PackageX}
          accent="destructive"
          title="Tồn kho thấp"
          count={stats.lowStock.length}
          to="/inventory"
        >
          {stats.lowStock.slice(0, 3).map((p) => (
            <li key={p.id} className="flex justify-between gap-2">
              <span className="truncate">{p.name}</span>
              <span className="shrink-0 font-medium text-destructive">
                {p.stock}/{p.reorderPoint} {p.unit}
              </span>
            </li>
          ))}
        </AlertCard>

        <AlertCard
          icon={Wrench}
          accent="warning"
          title="Máy chờ lắp đặt"
          count={stats.pendingInstalls.length}
          to="/installations"
        >
          {stats.pendingInstalls.slice(0, 3).map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span className="truncate">{i.customerName}</span>
              <span className="shrink-0 text-muted-foreground">
                {formatDate(i.scheduledAt)}
              </span>
            </li>
          ))}
        </AlertCard>

        <AlertCard
          icon={ShieldAlert}
          accent="primary"
          title="Máy đang bảo hành / sửa"
          count={stats.underWarranty.length}
          to="/warranties"
        >
          {stats.underWarranty.slice(0, 3).map((s) => (
            <li key={s.id} className="flex justify-between gap-2">
              <span className="truncate font-mono text-xs">{s.serial}</span>
              <span className="shrink-0 truncate text-muted-foreground">
                {s.customerName}
              </span>
            </li>
          ))}
        </AlertCard>
      </div>

      {/* Recent orders + top products + upcoming installs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>6 đơn mới nhất</CardDescription>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    to={`/orders/${o.id}`}
                    className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {o.customerName}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {o.code}
                      </p>
                    </div>
                    <span className="hidden text-sm font-medium sm:block">
                      {formatCurrency(o.total)}
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryMeta[p.category]} · {formatNumber(p.sold)} đã bán
                    </p>
                  </div>
                  <span className="text-xs font-medium">
                    {formatCompactCurrency(p.revenue)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <CalendarClock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Lịch lắp đặt sắp tới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingInstalls.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Không có lịch nào sắp tới.
                </p>
              )}
              {upcomingInstalls.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <Badge variant="muted" className="shrink-0">
                    {formatDate(i.scheduledAt)}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {i.customerName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {i.productName}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- local components ---------------------------- */

interface AlertCardProps {
  icon: typeof AlertTriangle
  accent: "primary" | "success" | "warning" | "destructive"
  title: string
  count: number
  to: string
  children: React.ReactNode
}

const accentBg: Record<AlertCardProps["accent"], string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
}

function AlertCard({
  icon: Icon,
  accent,
  title,
  count,
  to,
  children,
}: AlertCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg[accent]}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{count} mục cần chú ý</p>
          </div>
        </div>
        <Link
          to={to}
          className="text-xs font-medium text-primary hover:underline"
        >
          Chi tiết
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5 text-sm">{children}</ul>
      </CardContent>
    </Card>
  )
}
