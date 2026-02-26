"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { VoiceAssistant } from "@/components/voice-assistant";
import { type UserRole } from "@/lib/types";

// Source of truth for route permissions
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/leads": ["super", "admin", "executive"],
  "/dashboard/financials": ["super", "admin", "executive"],
  "/dashboard/organization/users": ["super", "admin", "executive"],
  "/dashboard/testimonials": ["super", "admin", "executive"],
  "/dashboard/resources": ["super", "admin", "executive"],
  "/dashboard/website": ["super"],
  "/dashboard/platform/tenants": ["super"],
  "/dashboard/availability": ["super", "admin", "teacher"],
  "/dashboard/attendance": ["super", "admin", "teacher"],
  "/dashboard/students": ["super", "admin", "executive", "teacher"],
  "/dashboard/family": ["parent"],
};

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    } 
    
    if (!userProfile && pathname !== "/welcome") {
      router.push("/welcome");
      return;
    }

    // Role-based route guard
    if (userProfile?.role) {
      const userRoles = Array.isArray(userProfile.role) 
        ? userProfile.role 
        : [userProfile.role];
      const isSuper = userRoles.includes("super" as UserRole);
      
      let isAuthorized = true;

      for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pathname.startsWith(routePrefix)) {
          if (!isSuper && !allowedRoles.some(role => userRoles.includes(role as UserRole))) {
            isAuthorized = false;
            break;
          }
        }
      }

      if (!isAuthorized) {
        console.warn(`Unauthorized access attempt to ${pathname} by role ${userProfile.role}`);
        router.replace("/dashboard");
      }
    }
  }, [user, userProfile, loading, router, pathname]);

  if (
    loading ||
    (!user && pathname !== "/login") ||
    (!userProfile && pathname !== "/welcome")
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pathname === "/welcome") {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground font-sans">
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <VoiceAssistant />
    </TooltipProvider>
  );
}
