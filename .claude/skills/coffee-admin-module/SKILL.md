---
name: coffee-admin-module
description: >-
  Hướng dẫn thêm trang/tính năng mới vào Coffee Admin CRM & ERP (repo c:\Home\Thao)
  đúng kiến trúc và quy ước sẵn có. Dùng skill này khi cần thêm một trang danh sách,
  trang chi tiết, thực thể dữ liệu mới, trạng thái/badge mới, mục sidebar, hoặc khi
  review để code khớp convention của dự án (React + TS + Tailwind + shadcn/ui + Vite).
---

# Thêm module cho Coffee Admin CRM & ERP

Skill này giúp bạn (và các thành viên khác) mở rộng dự án **đồng nhất** với kiến trúc
hiện có, thay vì phát minh lại pattern. Đọc phần liên quan tới việc bạn định làm,
dùng template trong `templates/`, rồi chạy checklist cuối.

## Nguyên tắc cốt lõi (đọc trước)

1. **Tái sử dụng khối có sẵn** — đừng tự viết lại bảng, badge, format tiền/ngày.
   Dùng `DataTable`, `StatCard`, `PageHeader`, `SearchInput`, `StatusBadge`, các hàm
   trong `@/lib/format` và map nhãn trong `@/lib/labels`.
2. **Tiếng Việt cho UI**, code/identifier tiếng Anh.
3. **TypeScript strict** — `noUnusedLocals`/`noUnusedParameters` đang bật. Import thừa
   = build fail. Luôn chạy `npm run build` trước khi báo xong.
4. **Dữ liệu là mock tĩnh** trong `src/data/*.ts`, liên kết nhau qua `id`. Giữ tính
   nhất quán (vd: `order.customerId` phải trỏ tới customer có thật).
5. **Mỗi trang lazy-load** — luôn đăng ký route trong `src/App.tsx` bằng `lazy()`.
6. **Hiệu năng**: filter/sort/paginate bọc `useMemo`; search qua `useDebouncedValue`;
   không khởi tạo `Intl.*Format` trong render (đã gom ở `@/lib/format`).

## Bản đồ thư mục

```
src/
├── components/ui/        # shadcn primitives — KHÔNG sửa khi chỉ thêm trang
├── components/layout/    # AppLayout, Sidebar, Topbar, nav-config.ts (menu)
├── components/shared/    # DataTable, StatCard, PageHeader, StatusBadge, SearchInput…
├── data/                 # mock data: 1 file/thực thể, export mảng + Map `xById`
├── hooks/                # use-debounced-value
├── lib/                  # utils(cn), format(Intl), labels(trạng thái→nhãn+màu)
├── pages/                # 1 file/trang, export default, lazy-loaded
└── types/index.ts        # toàn bộ domain type
```

## Các khối tái sử dụng (API)

- **`PageHeader`** — `{ title, description?, eyebrow?, actions? }`. `eyebrow` là nhóm
  menu (vd "CRM"), `actions` là các `<Button>` góc phải.
- **`StatCard`** — `{ label, value, icon, delta?, hint?, accent? }`. `accent`:
  `"primary" | "success" | "warning" | "destructive"`. `value` là string đã format.
- **`DataTable<T>`** — `{ columns, data, getRowId, onRowClick?, pageSize?, emptyMessage? }`.
  Mỗi `Column<T>`: `{ key, header, cell:(row)=>ReactNode, sortValue?:(row)=>string|number,
  align?, className?, headerClassName? }`. Có `sortValue` ⇒ cột sort được. Sort/paginate
  đã lo sẵn, **không** tự sort trong `data`.
- **`SearchInput`** — `{ value, onChange, placeholder?, className? }` (controlled).
- **`useDebouncedValue(value, delay=250)`** — debounce ô search trước khi filter.
- **`StatusBadge`** — các wrapper: `OrderStatusBadge`, `PaymentStatusBadge`,
  `SerialStatusBadge`, `InstallStatusBadge`, `WarrantyStatusBadge`, `WarrantyPriorityBadge`.
- **`@/lib/format`** — `formatCurrency`, `formatCompactCurrency`, `formatNumber`,
  `formatDate`, `formatDateTime`, `formatRelative`, `initials`.
- **`@/lib/labels`** — map `xStatusMeta: Record<Status, {label, variant}>` + `categoryMeta`,
  `channelMeta`, `customerTypeMeta`.

## Công thức 1 — Thêm trang DANH SÁCH

1. (Nếu là thực thể mới) thêm type vào `src/types/index.ts` và file mock
   `src/data/<entity>.ts` (export mảng + `export const xById = new Map(...)`).
2. Copy `templates/ListPage.tsx.template` vào `src/pages/<Name>.tsx`, thay placeholder.
   Giữ bố cục: `PageHeader` → hàng `StatCard` (`useMemo` summary) → thanh filter
   (`SearchInput` + `Select`) → `DataTable`.
3. Đăng ký route trong `src/App.tsx`: thêm `const X = lazy(() => import("@/pages/X"))`
   và `{ path: "...", element: <X /> }`.
4. Thêm mục menu trong `src/components/layout/nav-config.ts` (icon lucide + `to`).
   Bỏ `comingSoon: true` nếu trang đã sống.

## Công thức 2 — Thêm trang CHI TIẾT

1. Dùng `src/data/<entity>.ts` export `xById: Map`. Lấy param qua `useParams()`.
2. Copy `templates/DetailPage.tsx.template` → `src/pages/<Name>Detail.tsx`.
   Có sẵn: link back, `PageHeader`, xử lý "không tìm thấy" bằng `EmptyState`,
   layout 2 cột (nội dung + sidebar `DetailField`), có thể dùng `Tabs` cho dữ liệu liên quan.
3. Route dạng `{ path: "<entity>/:id", element: <XDetail /> }` trong `App.tsx`.
4. Liên kết tới trang này từ trang danh sách qua `onRowClick={(r)=>navigate(...)}`
   hoặc `<Link>`.

## Công thức 3 — Thêm TRẠNG THÁI / BADGE mới

1. Mở rộng union type trong `src/types/index.ts`.
2. Thêm entry vào map tương ứng trong `src/lib/labels.ts`
   (`{ label: "Tiếng Việt", variant: "success|warning|destructive|secondary|muted|default" }`).
   TS sẽ báo đỏ chỗ nào chưa khai báo đủ — đó là tính năng, không phải lỗi.
3. Nếu cần badge, thêm wrapper trong `src/components/shared/StatusBadge.tsx`.
4. Variant màu mới (nếu có) khai báo ở `src/components/ui/badge.tsx` + biến CSS
   trong `src/index.css`.

## Công thức 4 — Thêm biểu đồ (Dashboard)

Dùng `recharts` đã có. Bọc trong `<ResponsiveContainer>`, đặt dữ liệu ở `src/data/dashboard.ts`.
Recharts nặng (~384kB) — chỉ import ở trang thực sự cần (hiện chỉ Dashboard) để không
phình bundle các trang khác.

## Checklist trước khi báo "xong"

- [ ] `npm run build` xanh (gồm `tsc --noEmit`) — không còn import/biến thừa.
- [ ] Route đã đăng ký trong `App.tsx` và mở được bằng URL trực tiếp.
- [ ] Mục sidebar đúng (bỏ `comingSoon` nếu đã làm).
- [ ] Dùng lại `DataTable/StatCard/format/labels`, không copy logic trùng.
- [ ] Filter/sort bọc `useMemo`; search có debounce.
- [ ] Mock data trỏ đúng `id` liên kết (customer/order/serial…).
- [ ] Responsive: thử thu hẹp màn hình (sidebar → sheet, lưới xuống 1 cột).
- [ ] Dark mode không vỡ (dùng token `bg-card`, `text-muted-foreground`… thay vì màu cứng).

## Chống mẫu (tránh)

- ❌ Tự dựng `<table>` thủ công thay vì `DataTable`.
- ❌ Hardcode chuỗi trạng thái/màu trong page thay vì tra `labels.ts`.
- ❌ `new Intl.NumberFormat(...)` trong component — dùng `@/lib/format`.
- ❌ Màu cứng (`text-[#0f766e]`) — dùng token `text-primary`.
- ❌ Quên lazy route ⇒ phình initial bundle.
