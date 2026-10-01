import { useMemo, useState } from "react"
import { CalendarClock, CheckCircle2, Wrench, MapPin } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { StatCard } from "@/components/shared/StatCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { InstallStatusBadge } from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { installations } from "@/data/installations"
import { formatDateTime, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Installation, InstallationStatus } from "@/types"

type StatusFilter = "all" | InstallationStatus

export default function Installations() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const debounced = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return [...installations]
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
      .filter((i) => {
        if (status !== "all" && i.status !== status) return false
        if (!q) return true
        return (
          i.customerName.toLowerCase().includes(q) ||
          i.serial.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q)
        )
      })
  }, [debounced, status])

  const summary = useMemo(() => {
    const scheduled = installations.filter(
      (i) => i.status === "scheduled"
    ).length
    const inProgress = installations.filter(
      (i) => i.status === "in_progress"
    ).length
    const done = installations.filter((i) => i.status === "done").length
    return { scheduled, inProgress, done }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kỹ thuật & Hậu mãi"
        title="Lắp đặt"
        description="Lịch lắp đặt, phân công kỹ thuật viên và biên bản bàn giao theo serial."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Đã lên lịch"
          value={formatNumber(summary.scheduled)}
          icon={CalendarClock}
          accent="primary"
        />
        <StatCard
          label="Đang thực hiện"
          value={formatNumber(summary.inProgress)}
          icon={Wrench}
          accent="warning"
        />
        <StatCard
          label="Đã bàn giao"
          value={formatNumber(summary.done)}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm khách hàng, serial, mã phiếu…"
        />
        <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="scheduled">Đã lên lịch</TabsTrigger>
            <TabsTrigger value="in_progress">Đang làm</TabsTrigger>
            <TabsTrigger value="done">Đã bàn giao</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wrench}
            title="Không có phiếu lắp đặt phù hợp"
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((inst) => (
            <InstallationCard key={inst.id} inst={inst} />
          ))}
        </div>
      )}
    </div>
  )
}

function InstallationCard({ inst }: { inst: Installation }) {
  const doneCount = inst.checklist.filter((c) => c.done).length
  const progress = Math.round((doneCount / inst.checklist.length) * 100)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {inst.code}
          </span>
          <InstallStatusBadge status={inst.status} />
        </div>
        <CardTitle className="text-base">{inst.customerName}</CardTitle>
        <p className="text-sm text-muted-foreground">{inst.productName}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 font-mono">
              {inst.serial}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4 shrink-0" />
            {formatDateTime(inst.scheduledAt)}
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{inst.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="h-4 w-4 shrink-0" />
            KTV: {inst.technician}
          </div>
        </div>

        {/* Checklist progress */}
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Biên bản lắp đặt</span>
            <span className="font-medium">
              {doneCount}/{inst.checklist.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                progress === 100 ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {inst.note && (
          <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            {inst.note}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
