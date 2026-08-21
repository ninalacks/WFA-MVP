import { useId, type ComponentProps, type ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface MXInputProps extends ComponentProps<typeof Input> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export function MXInput({ label, hint, error, id, className, ...props }: MXInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Input
        id={inputId}
        aria-invalid={Boolean(error) || props["aria-invalid"]}
        className={cn(className)}
        {...props}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
