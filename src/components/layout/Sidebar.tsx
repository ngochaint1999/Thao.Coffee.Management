import { memo } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import { navGroups, type NavItem } from "./nav-config"

function isItemActive(item: NavItem, pathname: string, search: string) {
  if (!item.to) return false
  const [path, query] = item.to.split("?")
  if (path === "/") return pathname === "/"
  const pathMatches = pathname === path || pathname.startsWith(path + "/")
  if (!pathMatches) return false
  // Distinguish sibling links that share a path but differ by query (e.g. ?tab=moves)
  if (query) return search.includes(query)
  return !search.includes("tab=")
}

interface SidebarNavProps {
  onNavigate?: () => void
}

/** The scrollable nav body — shared between the desktop rail and mobile sheet. */
function SidebarNavBase({ onNavigate }: SidebarNavProps) {
  const { pathname, search } = useLocation()

  return (
    <nav className="flex flex-col gap-5 px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isItemActive(item, pathname, search)
              const Icon = item.icon

              if (item.comingSoon) {
                return (
                  <li key={item.label}>
                    <span
                      className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/35"
                      title="Thuộc giai đoạn mở rộng sau MVP"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="rounded bg-sidebar-border/60 px-1.5 py-0.5 text-[9px] font-medium uppercase">
                        Sắp ra mắt
                      </span>
                    </span>
                  </li>
                )
              }

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to!}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-white shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export const SidebarNav = memo(SidebarNavBase)

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-white">
        <Coffee className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white">Coffee Admin</p>
        <p className="text-[11px] text-sidebar-foreground/50">CRM &amp; ERP</p>
      </div>
    </div>
  )
}

/** Desktop fixed rail. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarBrand />
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        <SidebarNav />
      </div>
      <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-sidebar-foreground/45">
        Phiên bản MVP · 10 trang cốt lõi
      </div>
    </aside>
  )
}
