import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Signed percentage vs previous period */
  delta?: number
  hint?: string
  accent?: "primary" | "success" | "warning" | "destructive"
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  accent = "primary",
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
          {delta !== undefined ? (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                positive ? "text-success" : "text-destructive"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {positive ? "+" : ""}
              {delta}%
              {hint && (
                <span className="font-normal text-muted-foreground">{hint}</span>
              )}
            </p>
          ) : (
            hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            accentClasses[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
