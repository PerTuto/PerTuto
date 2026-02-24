"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./stat-card";
import { GraduationCap, Users, Book, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getStudents, getLeads, getCourses, getClasses } from "@/lib/firebase/services";

export function DashboardStats() {
    const { userProfile } = useAuth();
    const [stats, setStats] = useState({ students: 0, leads: 0, courses: 0, classesThisWeek: 0 });

    useEffect(() => {
        async function fetchStats() {
            if (!userProfile?.tenantId) return;
            try {
                const [students, leads, courses, classes] = await Promise.all([
                    getStudents(userProfile.tenantId),
                    getLeads(userProfile.tenantId),
                    getCourses(userProfile.tenantId),
                    getClasses(userProfile.tenantId),
                ]);

                // Count classes this week
                const now = new Date();
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 7);

                const classesThisWeek = classes.filter((c: any) => {
                    const start = c.start instanceof Date ? c.start : new Date(c.start);
                    return start >= weekStart && start < weekEnd;
                }).length;

                setStats({
                    students: students.length,
                    leads: leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length,
                    courses: courses.length,
                    classesThisWeek,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        }
        fetchStats();
    }, [userProfile?.tenantId]);

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
