import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DetailFieldProps {
  label: string
  children: ReactNode
  className?: string
}

/** Label-over-value pair for detail/summary panels. */
export function DetailField({ label, children, className }: DetailFieldProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}
