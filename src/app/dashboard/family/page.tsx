"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getChildrenForParent, getCourses, getClasses, getAssignments } from "@/lib/firebase/services";
import { Student, Course, Class, Assignment } from "@/lib/types";
import { ParentFinances } from "@/components/dashboard/parent-finances";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, ClipboardList, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";

export default function FamilyPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedChild = children.find(c => c.id === selectedChildId) || null;

  const fetchData = useCallback(async () => {
    if (!user || !userProfile?.tenantId) return;
    setLoading(true);
    try {
      const childList = await getChildrenForParent(userProfile.tenantId, user.uid);
      setChildren(childList);
      if (childList.length > 0) {
        setSelectedChildId(childList[0].id);
      }

      const [courseList, classList, assignmentList] = await Promise.all([
        getCourses(userProfile.tenantId),
        getClasses(userProfile.tenantId),
        getAssignments(userProfile.tenantId),
      ]);
      setCourses(courseList);
      setClasses(classList);
      setAssignments(assignmentList);
    } catch (error: any) {
      console.error("Error loading family data:", error);
      toast({ title: "Error", description: "Could not load your children's data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, userProfile, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2 font-headline">No Children Linked</h2>
        <p className="text-muted-foreground max-w-md">
          It looks like no students have been linked to your account yet. 
          Please contact your tutoring organization&apos;s admin to link your children.
        </p>
      </div>
    );
  }

  // Filter data by selected child
  const childCourses = courses.filter(c => 
    selectedChild?.courses?.includes(c.id) || c.studentIds?.includes(selectedChildId)
  );
  const childClasses = classes.filter(cl => 
    cl.studentIds?.includes(selectedChildId) || (cl.courseId && childCourses.some(cc => cc.id === cl.courseId))
  );
  const childAssignments = assignments.filter(a =>
    selectedChild?.courses?.includes(a.courseId)
  );

  // Upcoming classes (next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingClasses = childClasses
    .filter(cl => {
      const classDate = cl.start instanceof Date ? cl.start : new Date(cl.start);
      return classDate >= now && classDate <= nextWeek;
    })
    .sort((a, b) => {
      const dateA = a.start instanceof Date ? a.start : new Date(a.start);
      const dateB = b.start instanceof Date ? b.start : new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });

  // Assignment stats
  const pendingAssignments = childAssignments.filter(a => a.status === "Pending");
  const gradedAssignments = childAssignments.filter(a => a.status === "Graded");
  const overdueAssignments = pendingAssignments.filter(a => {
    const due = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
    return due < now;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Family Portal</h1>
        <p className="text-muted-foreground">
          View your children&apos;s academic progress and manage payments.
        </p>
      </div>

      {/* Child Switcher */}
      {children.length > 1 && (
        <Tabs value={selectedChildId} onValueChange={setSelectedChildId}>
          <TabsList>
            {children.map(child => (
              <TabsTrigger key={child.id} value={child.id} className="gap-2">
                <GraduationCap className="h-4 w-4" />
                {child.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Single child header */}
      {children.length === 1 && selectedChild && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{selectedChild.name}</CardTitle>
                <CardDescription>{selectedChild.email} · {selectedChild.status}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {selectedChild && (
        <>
          {/* Quick Stats Row */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{childCourses.length}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{upcomingClasses.length}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
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
                  <p className="text-2xl font-bold">{gradedAssignments.length}</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column: Academic Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Schedule
                  </CardTitle>
                  <CardDescription>Next 7 days for {selectedChild.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingClasses.length > 0 ? (
                    <div className="divide-y">
                      {upcomingClasses.map(cl => {
                        const classDate = cl.start instanceof Date ? cl.start : new Date(cl.start);
                        return (
                          <div key={cl.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                            <div>
                              <p className="text-sm font-medium">{cl.title || "Class Session"}</p>
                              <p className="text-xs text-muted-foreground">
                                {classDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                {' · '}
                                {classDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <Badge variant="outline">{cl.status || "Scheduled"}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No upcoming classes scheduled this week.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Assignments
                  </CardTitle>
                  <CardDescription>
                    {pendingAssignments.length} pending
                    {overdueAssignments.length > 0 && ` · ${overdueAssignments.length} overdue`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {childAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {childAssignments.slice(0, 8).map(assignment => {
                        const dueDate = assignment.dueDate instanceof Date ? assignment.dueDate : new Date(assignment.dueDate);
                        const isOverdue = dueDate < now && assignment.status === "Pending";
                        return (
                          <div key={assignment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{assignment.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Due {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </p>
                            </div>
                            <Badge
                              variant={assignment.status === "Graded" ? "default" : isOverdue ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {isOverdue ? "Overdue" : assignment.status}
                            </Badge>
                            {assignment.grade && (
                              <span className="text-sm font-bold text-primary">{assignment.grade}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No assignments yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Enrolled Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {childCourses.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {childCourses.map(course => (
                        <div key={course.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.instructor} · {course.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No courses enrolled yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Financial Overview */}
            <div className="space-y-6">
              <ParentFinances children={children} selectedChild={selectedChild} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
