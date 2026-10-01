import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Cpu,
  MapPin,
  Printer,
  User,
  Check,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DetailField } from "@/components/shared/DetailField"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { orderById } from "@/data/orders"
import { customerById } from "@/data/customers"
import { channelMeta, orderStatusMeta } from "@/lib/labels"
import { categoryMeta } from "@/lib/labels"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format"

export default function OrderDetail() {
  const { id = "" } = useParams()
  const order = orderById.get(id)

  if (!order) {
    return (
      <EmptyState
        title="Không tìm thấy đơn hàng"
        action={
          <Button asChild variant="outline">
            <Link to="/orders">Về danh sách đơn hàng</Link>
          </Button>
        }
      />
    )
  }

  const customer = customerById.get(order.customerId)
  const outstanding = order.total - order.paidAmount

  return (
    <div className="space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Đơn hàng
      </Link>

      <PageHeader
        title={order.code}
        description={`Tạo ngày ${formatDate(order.createdAt)} · Phụ trách: ${order.salesperson}`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4" /> In đơn
            </Button>
            <OrderStatusBadge status={order.status} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Chiết khấu</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {item.sku} · {categoryMeta[item.category]}
                        </p>
                        {item.serials && item.serials.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.serials.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="gap-1 font-mono"
                              >
                                <Cpu className="h-3 w-3" />
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.discount ? `-${formatCurrency(item.discount)}` : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          item.unitPrice * item.quantity - item.discount
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-1.5 border-t p-4">
                <SummaryRow label="Tạm tính" value={order.subtotal} />
                {order.discount > 0 && (
                  <SummaryRow
                    label="Chiết khấu"
                    value={-order.discount}
                    muted
                  />
                )}
                <SummaryRow label="Phí vận chuyển/lắp đặt" value={order.shippingFee} />
                <SummaryRow label="Thuế VAT" value={order.tax} />
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lịch sử trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l pl-6">
                {order.timeline.map((ev, i) => {
                  const isLast = i === order.timeline.length - 1
                  return (
                    <li key={ev.at} className="relative">
                      <span
                        className={`absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background ${
                          isLast ? "bg-primary" : "bg-muted-foreground/40"
                        }`}
                      >
                        {isLast && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          {orderStatusMeta[ev.status].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(ev.at)}
                        </span>
                      </div>
                      {ev.note && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {ev.note}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" /> Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer ? (
                <Link
                  to={`/customers/${customer.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {order.customerName}
                </Link>
              ) : (
                <p className="font-medium">{order.customerName}</p>
              )}
              {customer && (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{customer.phone}</p>
                  <p className="truncate">{customer.email}</p>
                </div>
              )}
              <Separator />
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{order.shippingAddress}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thanh toán &amp; giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <DetailField label="Trạng thái TT">
                <PaymentStatusBadge status={order.paymentStatus} />
              </DetailField>
              <DetailField label="Kênh bán">
                {channelMeta[order.channel]}
              </DetailField>
              <DetailField label="Đã thanh toán">
                {formatCurrency(order.paidAmount)}
              </DetailField>
              <DetailField label="Còn lại">
                <span className={outstanding > 0 ? "text-destructive" : ""}>
                  {formatCurrency(outstanding)}
                </span>
              </DetailField>
              {order.expectedDelivery && (
                <DetailField label="Dự kiến giao" className="col-span-2">
                  {formatDate(order.expectedDelivery)}
                </DetailField>
              )}
            </CardContent>
          </Card>

          {order.note && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <p className="mt-1 text-sm">{order.note}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string
  value: number
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-muted-foreground" : ""}>
        {formatCurrency(value)}
      </span>
    </div>
  )
}
