import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full px-8 py-4 border border-foreground/20 text-foreground font-medium tracking-wide flex items-center justify-center gap-2 group transition-colors duration-500 hover:text-background",
          className
        )}
        {...props}
      >
        {/* The Noora scale-up background fill */}
        <span className="absolute inset-0 bg-foreground scale-y-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-y-100 -z-10" />
        {children}
      </Comp>
    )
  }
)
PremiumButton.displayName = "PremiumButton"
