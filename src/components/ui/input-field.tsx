import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputFieldProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
  labelClassName?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, label, error, helperText, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id || props.name}
            className={cn(
              "block text-sm font-medium text-gray-700",
              labelClassName
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type || "text"}
          className={cn(
            // Consistent sizing - text-base for mobile, text-sm for md and up
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2",
            "text-base md:text-sm",
            // Shadows and transitions
            "shadow-sm transition-colors",
            // File input styling
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // Placeholder
            "placeholder:text-gray-500",
            // Focus states - consistent with brand colors
            "focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue",
            // Disabled state
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            // Error state
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { InputField }
