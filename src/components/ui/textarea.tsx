import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono",
        "text-foreground placeholder:text-muted-foreground",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50",
        "hover:border-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
