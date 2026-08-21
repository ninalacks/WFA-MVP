import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/shadcn-badge"
import { cn } from "@/lib/utils"

export type MXBadgeTone = "neutral" | "info" | "success" | "warning" | "danger"

const TONE_CLASSES: Record<MXBadgeTone, string> = {
  neutral: "bg-mx-neutral text-mx-neutral-foreground",
  info: "bg-mx-info text-mx-info-foreground",
  success: "bg-mx-success text-mx-success-foreground",
  warning: "bg-mx-warning text-mx-warning-foreground",
  danger: "bg-mx-danger text-mx-danger-foreground",
}

export interface MXBadgeProps extends Omit<ComponentProps<typeof Badge>, "variant"> {
  tone?: MXBadgeTone
}

export function MXBadge({ tone = "neutral", className, ...props }: MXBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", TONE_CLASSES[tone], className)}
      {...props}
    />
  )
}
