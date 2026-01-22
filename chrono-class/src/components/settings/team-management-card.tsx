"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { InviteUserDialog } from "@/components/tenant/invite-user-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Users } from "lucide-react";
import { getTenantById } from "@/lib/firebase/services";

export function TeamManagementCard() {
    const { userProfile } = useAuth();
    const [tenantName, setTenantName] = useState("Your Organization");

    useEffect(() => {
        async function fetchTenantName() {
            if (userProfile?.tenantId) {
                try {
                    const tenant = await getTenantById(userProfile.tenantId);
                    if (tenant?.name) {
                        setTenantName(tenant.name);
                    }
                } catch (e) {
                    console.error("Failed to fetch tenant name", e);
                }
            }
        }
        fetchTenantName();
    }, [userProfile?.tenantId]);

    const hasRole = (role: string) => {
        if (!userProfile?.role) return false;
        if (Array.isArray(userProfile.role)) return userProfile.role.includes(role as any);
        return userProfile.role === role;
    };

    // Show for admins and super users who have a tenantId
    const canManageTeam = userProfile?.tenantId &&
        (hasRole('admin') || hasRole('super'));

    if (!canManageTeam) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Management
                </CardTitle>
                <CardDescription>
                    Invite new team members to {tenantName}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Invite New Users</p>
                        <p className="text-sm text-muted-foreground">
                            Generate an invite link for teachers or admins to join.
                        </p>
                    </div>
                    <InviteUserDialog tenantId={userProfile.tenantId!} tenantName={tenantName} />
                </div>
            </CardContent>
        </Card>
    );
}
