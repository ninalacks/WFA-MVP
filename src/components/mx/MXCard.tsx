import type { ComponentProps, ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface MXCardProps extends Omit<ComponentProps<typeof Card>, "title"> {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export function MXCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  size = "sm",
  ...props
}: MXCardProps) {
  const hasHeader = title || description || action

  return (
    <Card className={cn(className)} size={size} {...props}>
      {hasHeader && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
