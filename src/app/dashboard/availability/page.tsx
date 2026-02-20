"use client";

import { useAuth } from "@/hooks/use-auth";
import AvailabilityGrid from "@/components/availability/availability-grid";

export default function AvailabilityPage() {
    const { userProfile, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!userProfile?.tenantId) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                You must belong to an organization to set availability.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Availability</h2>
                <p className="text-muted-foreground">Manage your working hours for {userProfile.role}.</p>
            </div>

            <AvailabilityGrid />
        </div>
    );
}
