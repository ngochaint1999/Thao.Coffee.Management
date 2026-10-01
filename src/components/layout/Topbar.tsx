import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Menu, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarBrand, SidebarNav } from "./Sidebar"
import { useTheme } from "@/components/theme-provider"

export function Topbar() {
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
          <SidebarBrand />
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm đơn hàng, khách hàng, serial…"
          className="pl-9"
          aria-label="Tìm kiếm"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Đổi giao diện sáng/tối"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative" aria-label="Thông báo">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar>
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Quản trị viên</p>
              <p className="text-xs font-normal text-muted-foreground">
                admin@coffee-erp.vn
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/">Tài khoản</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Cấu hình hệ thống</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
