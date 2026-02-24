
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Book,
  Calendar,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UserCog,
  Clock,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PerTutoLogo } from "@/components/brand/logo";
import type { UserRole } from "@/lib/types";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[]; // Empty = visible to all
};

const ALL_ROLES: UserRole[] = ['super', 'admin', 'executive', 'teacher', 'parent', 'student'];

const menuItems: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [] },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar, roles: ['super', 'admin', 'teacher'] },
  { href: "/dashboard/availability", label: "Availability", icon: Clock, roles: ['super', 'admin', 'teacher'] },
  { href: "/dashboard/students", label: "Students", icon: GraduationCap, roles: ['super', 'admin', 'executive', 'teacher'] },
  { href: "/dashboard/leads", label: "Leads", icon: Users, roles: ['super', 'admin', 'executive'] },
  { href: "/dashboard/courses", label: "Courses", icon: Book, roles: ['super', 'admin', 'teacher'] },
  { href: "/dashboard/assignments", label: "Assignments", icon: ClipboardList, roles: ['super', 'admin', 'teacher'] },
  { href: "/dashboard/attendance", label: "Attendance", icon: Users, roles: ['super', 'admin', 'teacher'] },
  { href: "/dashboard/organization/users", label: "Team", icon: UserCog, roles: ['super', 'admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const hasRole = (role: string): boolean => {
    if (!userProfile?.role) return false;
    if (Array.isArray(userProfile.role)) {
      return userProfile.role.includes(role as UserRole);
    }
    return userProfile.role === role;
  };

  const visibleItems = menuItems.filter((item) => {
    // Empty roles array = visible to all
    if (item.roles.length === 0) return true;
    // Super sees everything
    if (hasRole('super')) return true;
    // Check if user has any of the required roles
    return item.roles.some((role) => hasRole(role));
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/login");
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <PerTutoLogo size="sm" variant="icon" className="text-sidebar-primary" />
          <div className="flex flex-col">
            <h1 className="text-sidebar-foreground text-base font-bold leading-tight font-headline">PerTuto</h1>
            <p className="text-sidebar-foreground/60 text-xs font-normal">Workspace</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                as={Link}
                href={item.href}
                isActive={pathname === item.href}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2 bg-sidebar-border" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as={Link}
              href="/dashboard/settings"
              isActive={pathname === "/dashboard/settings"}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="size-8">
                <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/user1/40/40`} alt={userProfile?.fullName || 'User'} data-ai-hint="person portrait" />
                <AvatarFallback>{userProfile?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-semibold">{userProfile?.fullName || 'User'}</span>
                <span className="text-xs text-sidebar-foreground/50">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
