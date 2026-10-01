import { lazy } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { TooltipProvider } from "@/components/ui/tooltip"

// Route-based code splitting: each page ships in its own chunk, so the initial
// bundle stays small and heavy pages (charts) load only when visited.
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Customers = lazy(() => import("@/pages/Customers"))
const CustomerDetail = lazy(() => import("@/pages/CustomerDetail"))
const Orders = lazy(() => import("@/pages/Orders"))
const OrderDetail = lazy(() => import("@/pages/OrderDetail"))
const Products = lazy(() => import("@/pages/Products"))
const Inventory = lazy(() => import("@/pages/Inventory"))
const Serials = lazy(() => import("@/pages/Serials"))
const Installations = lazy(() => import("@/pages/Installations"))
const Warranties = lazy(() => import("@/pages/Warranties"))
const NotFound = lazy(() => import("@/pages/NotFound"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/:id", element: <CustomerDetail /> },
      { path: "orders", element: <Orders /> },
      { path: "orders/:id", element: <OrderDetail /> },
      { path: "products", element: <Products /> },
      { path: "inventory", element: <Inventory /> },
      { path: "serials", element: <Serials /> },
      { path: "installations", element: <Installations /> },
      { path: "warranties", element: <Warranties /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
