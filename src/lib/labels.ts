import type { BadgeProps } from "@/components/ui/badge"
import type {
  CustomerType,
  InstallationStatus,
  OrderStatus,
  PaymentStatus,
  ProductCategory,
  SalesChannel,
  SerialStatus,
  WarrantyPriority,
  WarrantyStatus,
} from "@/types"

type Variant = NonNullable<BadgeProps["variant"]>
type Meta = { label: string; variant: Variant }

export const orderStatusMeta: Record<OrderStatus, Meta> = {
  pending: { label: "Chờ xác nhận", variant: "muted" },
  confirmed: { label: "Đã xác nhận", variant: "secondary" },
  processing: { label: "Đang xử lý", variant: "warning" },
  shipping: { label: "Đang giao", variant: "warning" },
  installing: { label: "Chờ lắp đặt", variant: "warning" },
  completed: { label: "Hoàn thành", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
}

export const paymentStatusMeta: Record<PaymentStatus, Meta> = {
  unpaid: { label: "Chưa thanh toán", variant: "destructive" },
  partial: { label: "Thanh toán 1 phần", variant: "warning" },
  paid: { label: "Đã thanh toán", variant: "success" },
  refunded: { label: "Đã hoàn tiền", variant: "muted" },
}

export const channelMeta: Record<SalesChannel, string> = {
  direct: "Trực tiếp",
  online: "Online",
  partner: "Đối tác",
  b2b: "B2B",
}

export const customerTypeMeta: Record<CustomerType, Meta> = {
  individual: { label: "Cá nhân", variant: "secondary" },
  business: { label: "Doanh nghiệp", variant: "default" },
}

export const categoryMeta: Record<ProductCategory, string> = {
  machine: "Máy pha cà phê",
  grinder: "Máy xay",
  bean: "Hạt cà phê",
  accessory: "Phụ kiện",
  consumable: "Vật tư tiêu hao",
  part: "Linh kiện",
}

export const serialStatusMeta: Record<SerialStatus, Meta> = {
  in_stock: { label: "Trong kho", variant: "secondary" },
  reserved: { label: "Đã giữ", variant: "warning" },
  sold: { label: "Đã bán", variant: "default" },
  installed: { label: "Đã lắp đặt", variant: "success" },
  under_warranty: { label: "Đang bảo hành", variant: "warning" },
  repairing: { label: "Đang sửa chữa", variant: "destructive" },
  retired: { label: "Ngừng sử dụng", variant: "muted" },
}

export const installStatusMeta: Record<InstallationStatus, Meta> = {
  scheduled: { label: "Đã lên lịch", variant: "secondary" },
  in_progress: { label: "Đang thực hiện", variant: "warning" },
  done: { label: "Đã bàn giao", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
}

export const warrantyStatusMeta: Record<WarrantyStatus, Meta> = {
  received: { label: "Tiếp nhận", variant: "secondary" },
  diagnosing: { label: "Đang kiểm tra", variant: "warning" },
  repairing: { label: "Đang sửa", variant: "warning" },
  waiting_part: { label: "Chờ linh kiện", variant: "warning" },
  completed: { label: "Hoàn tất", variant: "success" },
  rejected: { label: "Từ chối", variant: "destructive" },
}

export const warrantyPriorityMeta: Record<WarrantyPriority, Meta> = {
  low: { label: "Thấp", variant: "muted" },
  normal: { label: "Bình thường", variant: "secondary" },
  high: { label: "Cao", variant: "warning" },
  urgent: { label: "Khẩn cấp", variant: "destructive" },
}
