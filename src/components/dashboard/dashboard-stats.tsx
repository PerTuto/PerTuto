"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./stat-card";
import { GraduationCap, Users, Book, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats, getCourses } from "@/lib/firebase/services";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStats() {
    const { userProfile } = useAuth();
    const [stats, setStats] = useState({ students: 0, leads: 0, courses: 0, classesThisWeek: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchStats() {
            if (!userProfile?.tenantId) return;
            try {
                const [dashboardData, coursesList] = await Promise.all([
                    getDashboardStats(userProfile.tenantId),
                    getCourses(userProfile.tenantId),
                ]);

                if (mounted) {
                    setStats({
                        students: dashboardData.activeStudents,
                        leads: dashboardData.activeLeads,
                        courses: coursesList.length,
                        classesThisWeek: dashboardData.upcomingClassesThisWeek,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchStats();
        return () => { mounted = false; };
    }, [userProfile?.tenantId]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Students"
                value={stats.students.toString()}
                icon={<GraduationCap className="h-5 w-5" />}
                description="Enrolled across all courses"
            />
            <StatCard 
                title="Active Leads"
                value={stats.leads.toString()}
                icon={<Users className="h-5 w-5" />}
                description="In the sales pipeline"
            />
            <StatCard 
                title="Courses"
                value={stats.courses.toString()}
                icon={<Book className="h-5 w-5" />}
                description="Currently offered"
            />
            <StatCard 
                title="Classes This Week"
                value={stats.classesThisWeek.toString()}
                icon={<Calendar className="h-5 w-5" />}
                description="Scheduled sessions"
            />
        </div>
    )
}
