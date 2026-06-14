import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Consistent sizing - text-base for mobile, text-sm for md and up
        "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2",
        "text-base md:text-sm",
        // Shadows and transitions
        "shadow-sm transition-colors",
        // Placeholder
        "placeholder:text-gray-500",
        // Focus states - consistent with brand colors
        "focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue",
        // Disabled state
        "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
