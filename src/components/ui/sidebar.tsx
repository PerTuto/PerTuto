"use client"

import * as React from "react"
import Link, { LinkProps } from 'next/link';
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"aside">
>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "hidden border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 mt-auto p-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

type SidebarMenuButtonProps = 
  | (React.ComponentProps<"button"> & { as?: "button" }) 
  | (React.ComponentProps<typeof Link> & { as: typeof Link });

const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  SidebarMenuButtonProps & {
    isActive?: boolean
  }
>(
  (
    {
      as: Comp = 'button',
      isActive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    
    const buttonClasses = cn(
      "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm font-medium outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50",
      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      className
    );
    
    const href = 'href' in props ? (props as any).href : undefined;

    if (Comp === 'button' || !href) {
        return (
            <button ref={ref as React.Ref<HTMLButtonElement>} className={buttonClasses} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
                {children}
            </button>
        )
    }

    return (
       <Link className={buttonClasses} {...(props as React.ComponentProps<typeof Link>)} ref={ref as React.Ref<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
}
