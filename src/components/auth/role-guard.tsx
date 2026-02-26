"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/dashboard" }: RoleGuardProps) {
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    const isAuthorized = (): boolean => {
        if (!userProfile?.role) return false;
        const userRoles = Array.isArray(userProfile.role) ? userProfile.role : [userProfile.role];
        
        // Super bypasses all guards
        if (userRoles.includes("super" as UserRole)) return true;
        
        return allowedRoles.some((role) => userRoles.includes(role));
    };

    useEffect(() => {
        if (!loading) {
            if (!userProfile || !isAuthorized()) {
                console.warn(`RoleGuard: Access denied for role ${userProfile?.role}. Redirecting to ${redirectTo}`);
                router.replace(redirectTo);
            }
        }
    }, [userProfile, loading, allowedRoles, router, redirectTo]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!userProfile || !isAuthorized()) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
