import React from 'react'
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  variant?: 'default' | 'primary' | 'success' | 'danger'
}

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, label, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: {
      unchecked: "border-gray-300 bg-white",
      checked: "border-blue-800 bg-blue-500",
      indicator: "text-white"
    },
    primary: {
      unchecked: "border-gray-400 bg-white dark:bg-[#151515] dark:border-white/20",
      checked: "border-gray-400 bg-white",
      indicator: "text-black dark:text-white"
    },
    success: {
      unchecked: "border-green-300 bg-white",
      checked: "border-green-600 bg-green-600",
      indicator: "text-white"
    },
    danger: {
      unchecked: "border-red-300 bg-white",
      checked: "border-red-600 bg-red-600",
      indicator: "text-white"
    }
  }

  const currentVariant = variantStyles[variant]

  return (
    <div className="flex items-center space-x-2">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "h-4 w-4 rounded border   transition-all duration-200 ease-in-out",
          "focus:outline-none focus-visible:outline-none",
          "data-[state=checked]:border-gray-500 data-[state=indeterminate]:border-blue-500",
          currentVariant.unchecked,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator 
          className={cn(
            "flex items-center justify-center",
            currentVariant.indicator
          )}
        >
          <Check className="h-4 w-4"  />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {label && (
        <label 
          htmlFor={props.id} 
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
    </div>
  )
})

CustomCheckbox.displayName = 'CustomCheckbox'

export default CustomCheckbox