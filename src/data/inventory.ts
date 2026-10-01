import type { InventoryRow, StockMove, Warehouse } from "@/types"
import { products } from "./products"

export const warehouses: Warehouse[] = [
  { id: "W1", name: "Kho Tổng HCM", location: "KCN Tân Bình, TP. HCM" },
  { id: "W2", name: "Kho Hà Nội", location: "Long Biên, Hà Nội" },
  { id: "W3", name: "Kho Đà Nẵng", location: "Liên Chiểu, Đà Nẵng" },
]

/**
 * Inventory rows are derived from the product catalog so stock figures stay in
 * sync with the Sản phẩm page. Reserved/incoming are illustrative splits.
 */
export const inventory: InventoryRow[] = products.flatMap((p): InventoryRow[] => {
  const reserved = Math.min(p.stock, Math.round(p.stock * 0.15))
  const incoming = p.stock < p.reorderPoint ? Math.round(p.reorderPoint * 1.2) : 0
  return [
    {
      productId: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      warehouseId: "W1",
      warehouseName: "Kho Tổng HCM",
      onHand: p.stock,
      reserved,
      available: p.stock - reserved,
      incoming,
      reorderPoint: p.reorderPoint,
      unit: p.unit,
    },
  ]
})

export const stockMoves: StockMove[] = [
  {
    id: "M001",
    code: "NK-2026-0098",
    type: "in",
    productName: "Hạt Ethiopia Sidamo (1kg)",
    sku: "BN-ET-SIDAMO",
    quantity: 120,
    toWarehouse: "Kho Tổng HCM",
    reference: "PO-2026-0041",
    at: "2026-09-26T02:00:00Z",
    by: "Nguyễn Kho Vận",
  },
  {
    id: "M002",
    code: "XK-2026-0203",
    type: "out",
    productName: "Máy xay Mazzer ZM 2024",
    sku: "GR-MZ-ZM",
    quantity: 1,
    fromWarehouse: "Kho Tổng HCM",
    reference: "DH-2026-0030",
    at: "2026-09-30T03:00:00Z",
    by: "Nguyễn Kho Vận",
  },
  {
    id: "M003",
    code: "CK-2026-0017",
    type: "transfer",
    productName: "Máy pha Rancilio Silvia Pro X",
    sku: "MX-RC-SILVIA",
    quantity: 2,
    fromWarehouse: "Kho Tổng HCM",
    toWarehouse: "Kho Hà Nội",
    reference: "Cân đối tồn",
    at: "2026-09-22T06:00:00Z",
    by: "Trần Điều Phối",
  },
  {
    id: "M004",
    code: "XK-2026-0201",
    type: "out",
    productName: "Máy pha Nuova Simonelli Appia Life (2 group)",
    sku: "MX-NP-APPIA",
    quantity: 1,
    fromWarehouse: "Kho Tổng HCM",
    reference: "DH-2026-0021",
    at: "2026-07-05T01:00:00Z",
    by: "Nguyễn Kho Vận",
  },
  {
    id: "M005",
    code: "KK-2026-0006",
    type: "adjust",
    productName: "Bột vệ sinh máy Cafiza (900g)",
    sku: "CS-CLEAN-CAFIZA",
    quantity: -2,
    fromWarehouse: "Kho Tổng HCM",
    reference: "Kiểm kho tháng 9",
    at: "2026-09-29T09:00:00Z",
    by: "Trần Điều Phối",
  },
  {
    id: "M006",
    code: "NK-2026-0097",
    type: "in",
    productName: "Lõi lọc nước RO cho máy pha",
    sku: "CS-FILTER-RO",
    quantity: 30,
    toWarehouse: "Kho Tổng HCM",
    reference: "PO-2026-0039",
    at: "2026-09-15T04:00:00Z",
    by: "Nguyễn Kho Vận",
  },
]
