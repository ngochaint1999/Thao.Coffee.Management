# Coffee Admin — CRM & ERP

Hệ thống quản trị hợp nhất **CRM + ERP** cho doanh nghiệp kinh doanh **máy pha cà phê, hạt cà phê và phụ kiện**. Xây dựng theo đề xuất cấu trúc trong tài liệu nghiệp vụ, triển khai **phạm vi MVP (10 trang cốt lõi)** với kiến trúc sẵn sàng mở rộng.

Luồng giá trị trọng tâm: **Khách hàng → Đơn hàng → Sản phẩm/Kho → Serial → Lắp đặt → Bảo hành.**

## Công nghệ

- **React 18 + TypeScript** (strict)
- **Vite 5** — dev server & build, code-splitting theo route
- **Tailwind CSS 3** + **shadcn/ui** (Radix UI primitives, kiểu "new-york")
- **React Router 6** — `createBrowserRouter`, lazy routes
- **Recharts** — biểu đồ dashboard
- **lucide-react** — icon

## Bắt đầu

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build  → dist/
npm run preview  # xem thử bản build
```

## Các trang MVP

| # | Trang | Đường dẫn | Mô tả |
|---|-------|-----------|-------|
| 01 | Tổng quan | `/` | Dashboard: doanh thu, đơn hàng, cảnh báo tồn kho, máy chờ lắp, đang bảo hành |
| 02 | Khách hàng | `/customers` | Danh sách, lọc cá nhân/doanh nghiệp, tổng chi tiêu |
| 03 | Chi tiết khách hàng | `/customers/:id` | Đơn hàng, máy sở hữu, bảo hành, lịch sử tương tác |
| 04 | Đơn hàng | `/orders` | Lọc theo trạng thái, thanh toán, kênh bán |
| 05 | Chi tiết đơn hàng | `/orders/:id` | Sản phẩm, serial máy, timeline, thanh toán & giao hàng |
| 06 | Sản phẩm | `/products` | Máy, máy xay, hạt, phụ kiện, vật tư, linh kiện |
| 07 | Kho hàng | `/inventory` | Tồn kho + lịch sử nhập/xuất/chuyển kho (`?tab=moves`) |
| 08 | Serial máy | `/serials` | Vòng đời thiết bị: nhập → bán → lắp → bảo hành → sửa |
| 09 | Lắp đặt | `/installations` | Lịch lắp, phân công KTV, biên bản bàn giao (checklist) |
| 10 | Bảo hành | `/warranties` | Tiếp nhận & xử lý, gắn serial + khách hàng sở hữu |

Các module giai đoạn sau (Lead/Deal, Báo giá, Mua hàng/PO, Tài chính, Báo cáo, Hệ thống) hiển thị trong sidebar với nhãn **"Sắp ra mắt"** để thể hiện lộ trình đầy đủ.

## Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives (button, card, table, select, …)
│   ├── layout/      # AppLayout, Sidebar, Topbar, nav-config
│   └── shared/      # DataTable, StatCard, PageHeader, StatusBadge, …
├── data/            # mock data liên kết với nhau (customers, orders, serials…)
├── hooks/           # use-debounced-value
├── lib/             # utils (cn), format (Intl), labels (status → nhãn/màu)
├── pages/           # 10 trang MVP + NotFound (lazy-loaded)
└── types/           # mô hình domain
```

## Điểm nhấn kỹ thuật

- **Hiệu năng**: route-based code splitting (mỗi trang 1 chunk; Recharts chỉ tải ở Dashboard); `Intl.*Format` khởi tạo một lần ở scope module; sắp xếp/phân trang `DataTable` được `useMemo`; search có debounce.
- **Tái sử dụng**: một `DataTable<T>` generic (sort + phân trang) dùng cho mọi bảng; map `labels.ts` tập trung hóa nhãn + màu trạng thái tiếng Việt.
- **Thiết kế**: bảng màu teal theo nhận diện ngành cà phê, dark mode, responsive (sidebar thu gọn thành sheet trên mobile), skeleton khi lazy-load.
- **Đặc thù ngành**: theo dõi **serial xuyên suốt vòng đời**, phân biệt **tài sản (máy)** vs **tiêu hao (hạt, vật tư)**, bảo hành gắn trực tiếp serial + chủ sở hữu, hỗ trợ khách **B2B nhiều điểm bán / công nợ nhiều đợt**.

> Dữ liệu hiện là **mock** trong `src/data`. Khi tích hợp backend, thay các import tĩnh bằng data layer (React Query/SWR) — cấu trúc `types/` và component đã tách sẵn để chuyển đổi.
