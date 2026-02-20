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

export function RoleGuard({ children, allowedRoles, redirectTo = "/" }: RoleGuardProps) {
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!userProfile || !allowedRoles.includes(userProfile.role)) {
                router.push(redirectTo);
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

    if (!userProfile || !allowedRoles.includes(userProfile.role)) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
