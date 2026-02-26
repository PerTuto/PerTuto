"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
    getCourses,
    getClasses,
    getStudents,
    getAssignments,
} from "@/lib/firebase/services";
import type { Student, Course, Class, Assignment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BookOpen,
    Calendar,
    ClipboardList,
    Users,
    Video,
    Clock,
    Plus,
    CheckSquare,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";

export function TeacherHome() {
    const { user, userProfile, tenantId } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [todayClasses, setTodayClasses] = useState<Class[]>([]);
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [myStudents, setMyStudents] = useState<Student[]>([]);
    const [ungradedAssignments, setUngradedAssignments] = useState<Assignment[]>([]);

    const loadData = useCallback(async () => {
        if (!tenantId || !user) return;
        setLoading(true);

        try {
            // 1. Get teacher's courses
            const allCourses = await getCourses(tenantId);
            const teacherCourses = allCourses.filter(
                (c) => c.instructorId === user.uid || c.instructor === userProfile?.fullName
            );
            setMyCourses(teacherCourses);

            // 2. Get today's classes
            const allClasses = await getClasses(tenantId);
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

            const teacherCourseIds = teacherCourses.map((c) => c.id);
            const today = allClasses
                .filter((c) => {
                    const start = c.start instanceof Date ? c.start : new Date(c.start);
                    return (
                        start >= todayStart &&
                        start <= todayEnd &&
                        (c.ownerId === user.uid || teacherCourseIds.includes(c.courseId))
                    );
                })
                .sort((a, b) => {
                    const aStart = a.start instanceof Date ? a.start : new Date(a.start);
                    const bStart = b.start instanceof Date ? b.start : new Date(b.start);
                    return aStart.getTime() - bStart.getTime();
                });
            setTodayClasses(today);

            // 3. Get unique students across teacher's courses
            const allStudents = await getStudents(tenantId);
            const studentIdSet = new Set<string>();
            teacherCourses.forEach((c) => {
                c.studentIds?.forEach((id) => studentIdSet.add(id));
            });
            setMyStudents(allStudents.filter((s) => studentIdSet.has(s.id)));

            // 4. Get ungraded assignments
            const allAssignments = await getAssignments(tenantId);
            const ungraded = allAssignments.filter(
                (a) =>
                    teacherCourseIds.includes(a.courseId) &&
                    (a.status === "Submitted" || a.status === "Pending")
            );
            setUngradedAssignments(ungraded);
        } catch (error) {
            console.error("Failed to load teacher data:", error);
            toast({
                title: "Error",
                description: "Failed to load dashboard data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [tenantId, user, userProfile, toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-xl" />
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/20">
                <CardContent className="flex items-center gap-4 py-6">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-violet-500/10 text-violet-600">
                        <BookOpen className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-headline font-bold text-foreground">
                            {getGreeting()}, {userProfile?.fullName || "Teacher"}!
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            You have {todayClasses.length} class{todayClasses.length !== 1 ? "es" : ""} today
                            {ungradedAssignments.length > 0 && ` · ${ungradedAssignments.length} assignments to review`}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold">{todayClasses.length}</p>
                            <p className="text-xs text-muted-foreground">Today's Classes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <BookOpen className="h-5 w-5 text-violet-500" />
                        <div>
                            <p className="text-2xl font-bold">{myCourses.length}</p>
                            <p className="text-xs text-muted-foreground">My Courses</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <Users className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold">{myStudents.length}</p>
                            <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <ClipboardList className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-2xl font-bold">{ungradedAssignments.length}</p>
                            <p className="text-xs text-muted-foreground">To Grade</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/schedule">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" /> Schedule Class
                    </Button>
                </Link>
                <Link href="/dashboard/assignments">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ClipboardList className="h-4 w-4" /> Create Assignment
                    </Button>
                </Link>
                <Link href="/dashboard/attendance">
                    <Button variant="outline" size="sm" className="gap-2">
                        <CheckSquare className="h-4 w-4" /> Mark Attendance
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Today's Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Today's Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {todayClasses.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No classes scheduled for today. 🎉
                            </p>
                        ) : (
                            todayClasses.map((cls) => {
                                const start = cls.start instanceof Date ? cls.start : new Date(cls.start);
                                const end = cls.end instanceof Date ? cls.end : new Date(cls.end);
                                return (
                                    <div
                                        key={cls.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border"
                                    >
                                        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-violet-500/10 text-violet-600">
                                            <span className="text-xs font-bold">
                                                {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{cls.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                                {" — "}
                                                {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </p>
                                        </div>
                                        {cls.meetLink && (
                                            <Button size="sm" className="text-xs gap-1" asChild>
                                                <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                                                    <Video className="h-3 w-3" /> Start
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* My Students */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" /> My Students
                        </CardTitle>
                        <CardDescription>{myStudents.length} across {myCourses.length} courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myStudents.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No students enrolled in your courses yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {myStudents.slice(0, 8).map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback className="text-xs">
                                                {student.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate">{student.name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {student.courses.length} course{student.courses.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {myStudents.length > 8 && (
                            <Link href="/dashboard/students">
                                <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                                    View All {myStudents.length} Students →
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Pending Grading */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" /> Pending Grading
                    </CardTitle>
                    <CardDescription>
                        {ungradedAssignments.length} assignment{ungradedAssignments.length !== 1 ? "s" : ""} awaiting review
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {ungradedAssignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            All caught up! No assignments pending review. ✅
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {ungradedAssignments.slice(0, 6).map((assignment) => {
                                const dueDate = assignment.dueDate instanceof Date
                                    ? assignment.dueDate
                                    : new Date(assignment.dueDate);

                                return (
                                    <div key={assignment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{assignment.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Due {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={assignment.status === "Submitted" ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {assignment.status}
                                        </Badge>
                                        <Link href="/dashboard/assignments">
                                            <Button size="sm" variant="outline" className="text-xs">
                                                Grade
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <Link href="/dashboard/assignments">
                        <Button variant="ghost" size="sm" className="w-full mt-4 text-xs">
                            View All Assignments →
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
