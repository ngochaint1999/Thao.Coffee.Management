/**
 * Formatting helpers. Formatters are created once at module scope — constructing
 * an Intl.*Format on every call is surprisingly expensive in hot list/table paths.
 */

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat("vi-VN")

const compact = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const dateFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const dateTimeFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export const formatCurrency = (value: number) => vnd.format(value)
export const formatCompactCurrency = (value: number) =>
  `${compact.format(value)} ₫`
export const formatNumber = (value: number) => number.format(value)
export const formatCompact = (value: number) => compact.format(value)

export const formatDate = (value: string | Date) =>
  dateFmt.format(typeof value === "string" ? new Date(value) : value)

export const formatDateTime = (value: string | Date) =>
  dateTimeFmt.format(typeof value === "string" ? new Date(value) : value)

/** "x ngày trước" style relative label, Vietnamese. */
export function formatRelative(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.round(diffMs / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat("vi-VN", { numeric: "auto" })
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / 3_600_000)
    return rtf.format(diffHours, "hour")
  }
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day")
  return rtf.format(Math.round(diffDays / 30), "month")
}

export const formatPercent = (value: number, fractionDigits = 1) =>
  `${value.toFixed(fractionDigits)}%`

/** Deterministic initials for avatars. */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}
