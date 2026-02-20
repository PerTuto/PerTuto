import { StatCard } from "./stat-card";
import { GraduationCap, Users, Book, BarChart3 } from "lucide-react";
import { students, leads, courses } from "@/lib/data";

export function DashboardStats() {
    const totalStudents = students.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const totalCourses = courses.length;
    const averageProgress = students.length > 0
        ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
        : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Students"
                value={totalStudents.toString()}
                icon={<GraduationCap className="h-5 w-5" />}
                description="The total number of active students."
            />
            <StatCard 
                title="New Leads"
                value={newLeads.toString()}
                icon={<Users className="h-5 w-5" />}
                description="Number of new potential students."
            />
            <StatCard 
                title="Courses Offered"
                value={totalCourses.toString()}
                icon={<Book className="h-5 w-5" />}
                description="The total number of available courses."
            />
            <StatCard 
                title="Average Progress"
                value={`${averageProgress}%`}
                icon={<BarChart3 className="h-5 w-5" />}
                description="Average course completion across all students."
            />
        </div>
    )
}
