import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Target,
  FileText,
  ShoppingCart,
  RotateCcw,
  Coffee,
  Tags,
  BadgeDollarSign,
  Warehouse,
  ArrowLeftRight,
  Cpu,
  ClipboardCheck,
  Truck,
  Wrench,
  ShieldCheck,
  CalendarClock,
  LifeBuoy,
  Receipt,
  Scale,
  FileBarChart,
  Settings,
  UserCog,
  History,
} from "lucide-react"

export interface NavItem {
  label: string
  to?: string
  icon: LucideIcon
  /** Chưa thuộc phạm vi MVP — hiển thị nhưng vô hiệu hóa */
  comingSoon?: boolean
  badge?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/**
 * Sidebar mirrors the proposed structure (PDF §4). MVP pages are active links;
 * post-MVP pages are shown as "Sắp ra mắt" so stakeholders see the full roadmap.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }],
  },
  {
    label: "CRM",
    items: [
      { label: "Khách hàng", to: "/customers", icon: Users },
      { label: "Khách hàng tiềm năng", icon: UserPlus, comingSoon: true },
      { label: "Cơ hội bán hàng", icon: Target, comingSoon: true },
      { label: "Báo giá", icon: FileText, comingSoon: true },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      { label: "Đơn hàng", to: "/orders", icon: ShoppingCart },
      { label: "Đổi trả / hoàn tiền", icon: RotateCcw, comingSoon: true },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      { label: "Sản phẩm", to: "/products", icon: Coffee },
      { label: "Danh mục", icon: Tags, comingSoon: true },
      { label: "Bảng giá", icon: BadgeDollarSign, comingSoon: true },
    ],
  },
  {
    label: "Kho",
    items: [
      { label: "Tồn kho", to: "/inventory", icon: Warehouse },
      { label: "Nhập / xuất kho", to: "/inventory?tab=moves", icon: ArrowLeftRight },
      { label: "Serial máy", to: "/serials", icon: Cpu },
      { label: "Kiểm kho", icon: ClipboardCheck, comingSoon: true },
    ],
  },
  {
    label: "Mua hàng",
    items: [
      { label: "Nhà cung cấp", icon: Truck, comingSoon: true },
      { label: "Đơn mua hàng", icon: FileText, comingSoon: true },
    ],
  },
  {
    label: "Kỹ thuật & Hậu mãi",
    items: [
      { label: "Lắp đặt", to: "/installations", icon: Wrench },
      { label: "Bảo hành", to: "/warranties", icon: ShieldCheck },
      { label: "Bảo trì", icon: CalendarClock, comingSoon: true },
      { label: "Ticket hỗ trợ", icon: LifeBuoy, comingSoon: true },
    ],
  },
  {
    label: "Tài chính",
    items: [
      { label: "Thu / chi", icon: Receipt, comingSoon: true },
      { label: "Công nợ", icon: Scale, comingSoon: true },
      { label: "Hóa đơn", icon: FileText, comingSoon: true },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Báo cáo", icon: FileBarChart, comingSoon: true },
      { label: "Người dùng & phân quyền", icon: UserCog, comingSoon: true },
      { label: "Cấu hình", icon: Settings, comingSoon: true },
      { label: "Nhật ký hoạt động", icon: History, comingSoon: true },
    ],
  },
]
