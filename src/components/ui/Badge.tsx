import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-mx-neutral text-mx-neutral-foreground",
  info: "bg-mx-info text-mx-info-foreground",
  success: "bg-mx-success text-mx-success-foreground",
  warning: "bg-mx-warning text-mx-warning-foreground",
  danger: "bg-mx-danger text-mx-danger-foreground",
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-body-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
