import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B5F75] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1419] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#2B5F75] text-white hover:bg-[#2B5F75]/90 shadow-sm",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        outline: "border border-white/30 text-white hover:bg-white/5",
        ghost: "text-white hover:bg-white/10",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: "text-[#2B5F75] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-10 px-6 text-sm",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
