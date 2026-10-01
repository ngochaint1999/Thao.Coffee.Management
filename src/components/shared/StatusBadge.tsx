import { Badge } from "@/components/ui/badge"
import {
  installStatusMeta,
  orderStatusMeta,
  paymentStatusMeta,
  serialStatusMeta,
  warrantyPriorityMeta,
  warrantyStatusMeta,
} from "@/lib/labels"
import type {
  InstallationStatus,
  OrderStatus,
  PaymentStatus,
  SerialStatus,
  WarrantyPriority,
  WarrantyStatus,
} from "@/types"

/**
 * Thin wrappers so pages render statuses consistently without repeating the
 * meta lookup + Badge wiring everywhere.
 */

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const m = orderStatusMeta[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const m = paymentStatusMeta[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export const SerialStatusBadge = ({ status }: { status: SerialStatus }) => {
  const m = serialStatusMeta[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export const InstallStatusBadge = ({
  status,
}: {
  status: InstallationStatus
}) => {
  const m = installStatusMeta[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export const WarrantyStatusBadge = ({ status }: { status: WarrantyStatus }) => {
  const m = warrantyStatusMeta[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export const WarrantyPriorityBadge = ({
  priority,
}: {
  priority: WarrantyPriority
}) => {
  const m = warrantyPriorityMeta[priority]
  return <Badge variant={m.variant}>{m.label}</Badge>
}
