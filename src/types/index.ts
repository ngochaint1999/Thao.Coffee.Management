/**
 * Domain model for the Coffee CRM & ERP admin.
 * Types mirror the business entities described in the proposal (PDF):
 * Khách hàng → Đơn hàng → Sản phẩm/Kho → Serial → Lắp đặt → Bảo hành.
 */

export type ID = string

/* ----------------------------------- CRM ---------------------------------- */

export type CustomerType = "individual" | "business"

export interface Customer {
  id: ID
  code: string
  name: string
  type: CustomerType
  /** Người liên hệ (với khách doanh nghiệp) */
  contactPerson?: string
  phone: string
  email: string
  address: string
  city: string
  /** Nhân viên phụ trách */
  owner: string
  tags: string[]
  totalSpent: number
  ordersCount: number
  machinesOwned: number
  createdAt: string
  lastActivityAt: string
  note?: string
}

export interface Interaction {
  id: ID
  customerId: ID
  type: "call" | "email" | "meeting" | "note" | "visit"
  title: string
  content: string
  at: string
  by: string
}

/* --------------------------------- Products -------------------------------- */

export type ProductCategory =
  | "machine" // máy pha cà phê
  | "grinder" // máy xay
  | "bean" // hạt cà phê
  | "accessory" // phụ kiện
  | "consumable" // vật tư tiêu hao
  | "part" // linh kiện

export interface MachineAttributes {
  brand: string
  model: string
  powerW: number
  groups: number // số group
  voltage: string
  warrantyMonths: number
}

export interface BeanAttributes {
  origin: string
  roastLevel: "light" | "medium" | "medium-dark" | "dark"
  blend: string
  weightGram: number
  shelfLifeDays: number
}

export interface Product {
  id: ID
  sku: string
  name: string
  category: ProductCategory
  /** Tài sản vòng đời dài (máy) vs. tiêu hao (hạt, vật tư) */
  isAsset: boolean
  unit: string
  costPrice: number
  salePrice: number
  stock: number
  reorderPoint: number
  supplier: string
  image?: string
  machine?: MachineAttributes
  bean?: BeanAttributes
}

/* ---------------------------------- Orders --------------------------------- */

export type OrderStatus =
  | "pending" // chờ xác nhận
  | "confirmed" // đã xác nhận
  | "processing" // đang xử lý
  | "shipping" // đang giao
  | "installing" // chờ/đang lắp đặt
  | "completed" // hoàn thành
  | "cancelled" // đã hủy

export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded"
export type SalesChannel = "direct" | "online" | "partner" | "b2b"

export interface OrderItem {
  productId: ID
  sku: string
  name: string
  category: ProductCategory
  quantity: number
  unitPrice: number
  discount: number
  /** Serial gán cho item (với máy) */
  serials?: string[]
}

export interface OrderStatusEvent {
  status: OrderStatus
  at: string
  note?: string
}

export interface Order {
  id: ID
  code: string
  customerId: ID
  customerName: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shippingFee: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paidAmount: number
  channel: SalesChannel
  hasMachine: boolean
  createdAt: string
  expectedDelivery?: string
  salesperson: string
  shippingAddress: string
  timeline: OrderStatusEvent[]
  note?: string
}

/* ------------------------------- Inventory -------------------------------- */

export interface Warehouse {
  id: ID
  name: string
  location: string
}

export interface InventoryRow {
  productId: ID
  sku: string
  name: string
  category: ProductCategory
  warehouseId: ID
  warehouseName: string
  onHand: number // thực tế
  reserved: number // đang giữ cho đơn
  available: number // có thể bán
  incoming: number // đang nhập
  reorderPoint: number
  unit: string
}

export type StockMoveType = "in" | "out" | "transfer" | "adjust"

export interface StockMove {
  id: ID
  code: string
  type: StockMoveType
  productName: string
  sku: string
  quantity: number
  fromWarehouse?: string
  toWarehouse?: string
  reference: string // đơn hàng / PO liên quan
  at: string
  by: string
}

/* --------------------------------- Serials -------------------------------- */

export type SerialStatus =
  | "in_stock" // trong kho
  | "reserved" // đã giữ cho đơn
  | "sold" // đã bán
  | "installed" // đã lắp đặt
  | "under_warranty" // đang bảo hành
  | "repairing" // đang sửa chữa
  | "retired" // ngừng sử dụng

export interface MachineSerial {
  id: ID
  serial: string
  productId: ID
  productName: string
  model: string
  brand: string
  status: SerialStatus
  warehouseName?: string
  customerId?: ID
  customerName?: string
  orderCode?: string
  importedAt: string
  soldAt?: string
  installedAt?: string
  warrantyEndsAt?: string
  technician?: string
}

/* ------------------------------ Installations ----------------------------- */

export type InstallationStatus =
  | "scheduled" // đã lên lịch
  | "in_progress" // đang thực hiện
  | "done" // đã bàn giao
  | "cancelled"

export interface Installation {
  id: ID
  code: string
  orderCode: string
  customerId: ID
  customerName: string
  address: string
  serial: string
  productName: string
  scheduledAt: string
  completedAt?: string
  technician: string
  status: InstallationStatus
  checklist: { label: string; done: boolean }[]
  note?: string
}

/* -------------------------------- Warranty -------------------------------- */

export type WarrantyStatus =
  | "received" // tiếp nhận
  | "diagnosing" // đang kiểm tra
  | "repairing" // đang sửa
  | "waiting_part" // chờ linh kiện
  | "completed" // hoàn tất
  | "rejected" // từ chối (hết hạn/ngoài phạm vi)

export type WarrantyPriority = "low" | "normal" | "high" | "urgent"

export interface WarrantyTicket {
  id: ID
  code: string
  serial: string
  productName: string
  model: string
  customerId: ID
  customerName: string
  issue: string
  status: WarrantyStatus
  priority: WarrantyPriority
  underWarranty: boolean
  receivedAt: string
  resolvedAt?: string
  technician: string
  partsUsed: { name: string; quantity: number }[]
  note?: string
}

/* ------------------------------- Dashboard -------------------------------- */

export interface RevenuePoint {
  month: string
  revenue: number
  orders: number
}

export interface TopProduct {
  name: string
  category: ProductCategory
  sold: number
  revenue: number
}
