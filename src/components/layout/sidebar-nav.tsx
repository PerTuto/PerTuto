
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

export function SidebarNav() {
  const pathname = usePathname();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/availability", label: "Availability", icon: ClipboardList },
    { href: "/students", label: "Students", icon: GraduationCap },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/courses", label: "Courses", icon: Book },
    { href: "/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/attendance", label: "Attendance", icon: Users },
  ];

  const hasRole = (role: string) => {
    if (!userProfile?.role) return false;
    if (Array.isArray(userProfile.role)) {
      return userProfile.role.includes(role as any);
    }
    return userProfile.role === role;
  };

  if (hasRole('admin')) {
    menuItems.push({ href: "/organization/users", label: "Users", icon: Users });
  }

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
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/20 bg-primary/10 flex items-center justify-center">
            <Book className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold leading-tight font-headline">PerTuto</h1>
            <p className="text-slate-400 text-xs font-normal">Workspace</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
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
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as={Link}
              href="/settings"
              isActive={pathname === "/settings"}
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
                <span className="text-xs text-muted-foreground">{user?.email}</span>
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
