import { Link } from "react-router-dom"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Coffee className="h-7 w-7" />
      </div>
      <div>
        <p className="text-3xl font-semibold">404</p>
        <p className="mt-1 text-muted-foreground">
          Trang bạn tìm không tồn tại hoặc đang được phát triển.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Về trang tổng quan</Link>
      </Button>
    </div>
  )
}
