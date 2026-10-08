import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Consistent sizing - text-base for mobile, text-sm for md and up
          "flex h-10 w-full rounded-md border px-3 py-2",
          "text-base md:text-sm",
          // Shadows and transitions
          "shadow-sm transition-colors",
          // File input styling
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          // Focus states - consistent with brand colors
          "focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Light mode
          "bg-white border-gray-300 text-gray-900",
          // Dark mode support
          "dark:bg-gray-800 dark:border-gray-600 dark:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
