import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Cpu,
  CircleDollarSign,
  Pencil,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DetailField } from "@/components/shared/DetailField"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  SerialStatusBadge,
  WarrantyStatusBadge,
} from "@/components/shared/StatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { customerById, interactions } from "@/data/customers"
import { orders } from "@/data/orders"
import { serials } from "@/data/serials"
import { warranties } from "@/data/warranties"
import { customerTypeMeta } from "@/lib/labels"
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  initials,
} from "@/lib/format"

export default function CustomerDetail() {
  const { id = "" } = useParams()
  const customer = customerById.get(id)

  const data = useMemo(() => {
    if (!customer) return null
    return {
      orders: orders.filter((o) => o.customerId === customer.id),
      machines: serials.filter((s) => s.customerId === customer.id),
      warranties: warranties.filter((w) => w.customerId === customer.id),
      interactions: interactions
        .filter((i) => i.customerId === customer.id)
        .sort((a, b) => b.at.localeCompare(a.at)),
    }
  }, [customer])

  if (!customer || !data) {
    return (
      <EmptyState
        title="Không tìm thấy khách hàng"
        description="Khách hàng có thể đã bị xóa hoặc đường dẫn không đúng."
        action={
          <Button asChild variant="outline">
            <Link to="/customers">Về danh sách khách hàng</Link>
          </Button>
        }
      />
    )
  }

  const type = customerTypeMeta[customer.type]

  return (
    <div className="space-y-6">
      <Link
        to="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Khách hàng
      </Link>

      <PageHeader
        title={customer.name}
        description={`${customer.code} · Phụ trách: ${customer.owner}`}
        actions={
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" /> Chỉnh sửa
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Profile sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 text-base">
                  <AvatarFallback>{initials(customer.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{customer.name}</p>
                  <Badge variant={type.variant} className="mt-1">
                    {type.label}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <dl className="space-y-3">
                {customer.contactPerson && (
                  <DetailField label="Người liên hệ">
                    {customer.contactPerson}
                  </DetailField>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {customer.address}, {customer.city}
                  </span>
                </div>
              </dl>

              {customer.tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-1.5">
                    {customer.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              {customer.note && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">Ghi chú</p>
                  <p className="mt-1 text-sm">{customer.note}</p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <MiniStat
              icon={ShoppingCart}
              label="Đơn"
              value={formatNumber(customer.ordersCount)}
            />
            <MiniStat
              icon={Cpu}
              label="Máy"
              value={formatNumber(customer.machinesOwned)}
            />
            <MiniStat
              icon={CircleDollarSign}
              label="Chi tiêu"
              value={formatCurrency(customer.totalSpent).replace("₫", "")}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">
              Đơn hàng ({data.orders.length})
            </TabsTrigger>
            <TabsTrigger value="machines">
              Máy sở hữu ({data.machines.length})
            </TabsTrigger>
            <TabsTrigger value="warranties">
              Bảo hành ({data.warranties.length})
            </TabsTrigger>
            <TabsTrigger value="activity">Tương tác</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-0">
                {data.orders.length === 0 ? (
                  <EmptyState title="Chưa có đơn hàng" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                        <TableHead>Thanh toán</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell>
                            <Link
                              to={`/orders/${o.id}`}
                              className="font-mono text-sm font-medium text-primary hover:underline"
                            >
                              {o.code}
                            </Link>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(o.createdAt)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(o.total)}
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge status={o.paymentStatus} />
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={o.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="machines">
            <Card>
              <CardContent className="p-0">
                {data.machines.length === 0 ? (
                  <EmptyState title="Khách chưa sở hữu máy nào" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hết bảo hành</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.machines.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell>
                            <Link
                              to={`/serials?q=${m.serial}`}
                              className="font-mono text-sm text-primary hover:underline"
                            >
                              {m.serial}
                            </Link>
                          </TableCell>
                          <TableCell className="text-sm">
                            {m.brand} {m.model}
                          </TableCell>
                          <TableCell>
                            <SerialStatusBadge status={m.status} />
                          </TableCell>
                          <TableCell className="text-sm">
                            {m.warrantyEndsAt
                              ? formatDate(m.warrantyEndsAt)
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranties">
            <Card>
              <CardContent className="p-0">
                {data.warranties.length === 0 ? (
                  <EmptyState title="Chưa có phiếu bảo hành" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã phiếu</TableHead>
                        <TableHead>Mô tả lỗi</TableHead>
                        <TableHead>Tiếp nhận</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.warranties.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-mono text-sm">
                            {w.code}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm">
                            {w.issue}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(w.receivedAt)}
                          </TableCell>
                          <TableCell>
                            <WarrantyStatusBadge status={w.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lịch sử tương tác</CardTitle>
              </CardHeader>
              <CardContent>
                {data.interactions.length === 0 ? (
                  <EmptyState title="Chưa có tương tác" />
                ) : (
                  <ol className="relative space-y-5 border-l pl-6">
                    {data.interactions.map((it) => (
                      <li key={it.id} className="relative">
                        <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{it.title}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDateTime(it.at)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {it.content}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {it.by}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingCart
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-semibold leading-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
