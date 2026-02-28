"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
    getStudents,
    getCourses,
    getClasses,
    getAssignments,
} from "@/lib/firebase/services";
import type { Student, Course, Class, Assignment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Calendar,
    ClipboardList,
    GraduationCap,
    Video,
    Clock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

export function StudentHome() {
    const { user, userProfile, tenantId } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const loadData = useCallback(async () => {
        if (!tenantId || !user) return;
        setLoading(true);

        try {
            // Find the student record linked to this auth user
            const allStudents = await getStudents(tenantId);
            const myStudent = allStudents.find(
                (s) => s.ownerId === user.uid || s.email === user.email
            );

            if (!myStudent) {
                setLoading(false);
                return;
            }
            setStudent(myStudent);

            // Fetch enrolled courses
            if (myStudent.courses && myStudent.courses.length > 0) {
                const allCourses = await getCourses(tenantId);
                const myCourses = allCourses.filter((c) =>
                    myStudent.courses.includes(c.id)
                );
                setCourses(myCourses);
            }

            // Fetch upcoming classes
            const allClasses = await getClasses(tenantId);
            const now = new Date();
            const myUpcoming = allClasses
                .filter((c) => {
                    const start = c.start instanceof Date ? c.start : new Date(c.start);
                    return (
                        start > now &&
                        (c.studentIds?.includes(myStudent.id) ||
                            c.students?.includes(myStudent.id))
                    );
                })
                .sort((a, b) => {
                    const aStart = a.start instanceof Date ? a.start : new Date(a.start);
                    const bStart = b.start instanceof Date ? b.start : new Date(b.start);
                    return aStart.getTime() - bStart.getTime();
                })
                .slice(0, 5);
            setUpcomingClasses(myUpcoming);

            // Fetch assignments for enrolled courses
            const allAssignments = await getAssignments(tenantId);
            const myAssignments = allAssignments
                .filter((a) => myStudent.courses.includes(a.courseId))
                .sort((a, b) => {
                    const aDue = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
                    const bDue = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
                    return aDue.getTime() - bDue.getTime();
                });
            setAssignments(myAssignments);
        } catch (error) {
            console.error("Failed to load student data:", error);
            toast({
                title: "Error",
                description: "Failed to load your dashboard data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [tenantId, user, toast]);

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

    const pendingAssignments = assignments.filter((a) => a.status === "Pending");
    const gradedAssignments = assignments.filter((a) => a.status === "Graded");

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="flex items-center gap-4 py-6">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-headline font-bold text-foreground">
                            Welcome back, {student?.name || userProfile?.fullName || "Student"}!
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {student?.curriculum && `${student.curriculum} `}
                            {student?.grade && `Grade ${student.grade} · `}
                            Here's your learning overview.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold">{courses.length}</p>
                            <p className="text-xs text-muted-foreground">Courses</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold">{upcomingClasses.length}</p>
                            <p className="text-xs text-muted-foreground">Upcoming</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-2xl font-bold">{pendingAssignments.length}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 py-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <div>
                            <p className="text-2xl font-bold">{student?.progress || 0}%</p>
                            <p className="text-xs text-muted-foreground">Progress</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* My Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" /> My Courses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {courses.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                You're not enrolled in any courses yet.
                            </p>
                        ) : (
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {course.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {course.instructor} · {course.duration}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            course.status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {course.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Upcoming Classes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingClasses.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No upcoming classes scheduled.
                            </p>
                        ) : (
                            upcomingClasses.map((cls) => {
                                const start =
                                    cls.start instanceof Date
                                        ? cls.start
                                        : new Date(cls.start);
                                return (
                                    <div
                                        key={cls.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border"
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {cls.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {start.toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}{" "}
                                                ·{" "}
                                                {start.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        {cls.meetLink && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs gap-1"
                                                asChild
                                            >
                                                <a
                                                    href={cls.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Video className="h-3 w-3" /> Join
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        <Link href="/dashboard/schedule">
                            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                                View Full Schedule →
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Assignments */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" /> My Assignments
                    </CardTitle>
                    <CardDescription>
                        {pendingAssignments.length} pending · {gradedAssignments.length} graded
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {assignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No assignments yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {assignments.slice(0, 8).map((assignment) => {
                                const dueDate =
                                    assignment.dueDate instanceof Date
                                        ? assignment.dueDate
                                        : new Date(assignment.dueDate);
                                const isPastDue =
                                    dueDate < new Date() &&
                                    assignment.status === "Pending";

                                return (
                                    <div
                                        key={assignment.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">
                                                {assignment.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Due{" "}
                                                {dueDate.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                assignment.status === "Graded"
                                                    ? "default"
                                                    : isPastDue
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {isPastDue
                                                ? "Overdue"
                                                : assignment.status}
                                        </Badge>
                                        {assignment.grade && (
                                            <span className="text-sm font-bold text-primary">
                                                {assignment.grade}
                                            </span>
                                        )}
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
