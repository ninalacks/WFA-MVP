import { useId, type ReactNode } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface MXSelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface MXSelectProps {
  label?: ReactNode
  value?: string | null
  onChange?: (value: string) => void
  options: MXSelectOption[]
  placeholder?: string
  error?: ReactNode
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export function MXSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  disabled,
  className,
  triggerClassName,
}: MXSelectProps) {
  const generatedId = useId()

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={generatedId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Select
        value={value ?? null}
        onValueChange={(next) => next && onChange?.(next)}
        disabled={disabled}
      >
        <SelectTrigger
          id={generatedId}
          aria-invalid={Boolean(error)}
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
