import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

export type MXButtonVariant = "primary" | "secondary" | "ghost" | "danger"

const VARIANT_MAP: Record<MXButtonVariant, NonNullable<ComponentProps<typeof Button>["variant"]>> = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
  danger: "destructive",
}

export interface MXButtonProps extends Omit<ComponentProps<typeof Button>, "variant"> {
  variant?: MXButtonVariant
}

export function MXButton({ variant = "primary", ...props }: MXButtonProps) {
  return <Button variant={VARIANT_MAP[variant]} {...props} />
}
