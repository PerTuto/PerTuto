"use client";

import { useAuth } from "@/hooks/use-auth";
import { StudentHome } from "@/components/dashboards/student-home";
import { TeacherHome } from "@/components/dashboards/teacher-home";
import { QuickAdd } from "@/components/dashboard/quick-add";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UpcomingClasses } from "@/components/schedule/upcoming-classes";
import { PendingAssignments } from "@/components/dashboard/pending-assignments";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-xl" />
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const role = Array.isArray(userProfile?.role)
        ? userProfile.role[0]
        : userProfile?.role;

    // Student Portal
    if (role === "student") {
        return <StudentHome />;
    }

    // Parent Portal — redirect to the Family page
    if (role === "parent") {
        redirect("/dashboard/family");
    }

    // Teacher Portal
    if (role === "teacher") {
        return <TeacherHome />;
    }

    // Admin / Executive / Super — existing dashboard
    return (
        <div className="space-y-6">
            <QuickAdd />
            <DashboardStats />
            <Separator />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <UpcomingClasses />
                    <PendingAssignments />
                </div>
                <div>
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
