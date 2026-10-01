import type { RevenuePoint, TopProduct } from "@/types"

export const revenueSeries: RevenuePoint[] = [
  { month: "T4", revenue: 486_000_000, orders: 18 },
  { month: "T5", revenue: 612_000_000, orders: 22 },
  { month: "T6", revenue: 858_000_000, orders: 27 },
  { month: "T7", revenue: 1_124_000_000, orders: 31 },
  { month: "T8", revenue: 934_000_000, orders: 25 },
  { month: "T9", revenue: 1_268_000_000, orders: 34 },
]

export const topProducts: TopProduct[] = [
  { name: "Appia Life 2GR", category: "machine", sold: 9, revenue: 1_188_000_000 },
  { name: "Linea PB", category: "machine", sold: 4, revenue: 1_580_000_000 },
  { name: "Mazzer ZM", category: "grinder", sold: 7, revenue: 406_000_000 },
  { name: "Silvia Pro X", category: "machine", sold: 12, revenue: 474_000_000 },
  { name: "Hạt House Blend", category: "bean", sold: 420, revenue: 163_800_000 },
]

export const categoryRevenue = [
  { name: "Máy pha", value: 3_822_000_000 },
  { name: "Máy xay", value: 648_000_000 },
  { name: "Hạt cà phê", value: 412_000_000 },
  { name: "Phụ kiện & vật tư", value: 196_000_000 },
]
