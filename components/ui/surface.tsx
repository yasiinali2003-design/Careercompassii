import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const surfaceVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#1a1d23] border-white/10",
        elevated: "bg-[#242830] border-white/20 shadow-lg",
        interactive: "bg-[#1a1d23] border-white/10 hover:border-white/30 hover:bg-[#242830] cursor-pointer",
        highlight: "bg-[#2B5F75]/10 border-[#2B5F75]/30",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {
  asChild?: boolean
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(surfaceVariants({ variant, padding }), className)}
        {...props}
      />
    )
  }
)
Surface.displayName = "Surface"

export { Surface, surfaceVariants }
