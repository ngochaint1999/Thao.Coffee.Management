import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { PageSkeleton } from "@/components/shared/PageSkeleton"

export function AppLayout() {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 lg:px-8">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
