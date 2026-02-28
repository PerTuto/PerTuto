"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Book, Calendar, ClipboardList, Mail, Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { getStudents, getCourses, getAssignments, getStudentPerformanceTrends, getStudentSubjectStrengths } from "@/lib/firebase/services";
import type { Student, Course, Assignment, PerformanceTrend, SubjectStrength } from "@/lib/types";
import { InviteStudentDialog } from "@/components/students/invite-student-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceLineChart, SubjectRadarChart } from "@/components/analytics/performance-charts";
import { TrendingUp, Award, Target, MessageSquare } from "lucide-react";

const statusColors: { [key in Student['status']]: string } = {
    Active: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500 border-green-200 dark:border-green-500/20",
    'On-hold': "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20",
    Graduated: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
    Dropped: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500 border-red-200 dark:border-red-500/20",
};

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const { userProfile } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);
  const [strengths, setStrengths] = useState<SubjectStrength[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!userProfile?.tenantId || !studentId) return;
      try {
        const [allStudents, allCourses, allAssignments, studentTrends, studentStrengths] = await Promise.all([
          getStudents(userProfile.tenantId),
          getCourses(userProfile.tenantId),
          getAssignments(userProfile.tenantId),
          getStudentPerformanceTrends(userProfile.tenantId, studentId),
          getStudentSubjectStrengths(userProfile.tenantId, studentId)
        ]);
        const found = allStudents.find(s => s.id === studentId) || null;
        setStudent(found);
        setCourses(allCourses);
        setAssignments(allAssignments);
        setTrends(studentTrends);
        setStrengths(studentStrengths);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userProfile?.tenantId, studentId]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center">
        <p className="text-xl font-semibold">Student Not Found</p>
        <p className="text-muted-foreground mt-2">This student doesn't exist or you don't have access.</p>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => student.courses?.includes(c.id));
  const studentAssignments = assignments.filter(a => student.courses?.includes(a.courseId));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <CardTitle className="font-headline text-3xl">{student.name}</CardTitle>
                    <Badge className={cn("text-sm", statusColors[student.status])}>{student.status}</Badge>
                </div>
                {student.email && (
                  <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" /> {student.email}
                  </CardDescription>
                )}
                <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> Enrolled on {new Date(student.enrolledDate).toLocaleDateString()}
                </CardDescription>
            </div>
            <div className="text-end">
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="text-3xl font-bold font-headline text-primary">{student.progress || 0}%</div>
                <Progress value={student.progress || 0} className="w-32 mt-2 mb-4"/>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                >
                    <BookOpen className="w-4 h-4 me-2" />
                    Generate Login
                </Button>
            </div>
        </CardHeader>
        {student.notes && (
            <CardContent>
                <div className="border-s-4 border-primary/50 bg-muted/20 p-4 rounded-e-lg">
                    <p className="font-semibold text-sm">Notes:</p>
                    <p className="text-muted-foreground text-sm">{student.notes}</p>
                </div>
            </CardContent>
        )}
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-12 rounded-xl border border-slate-200 dark:border-white/5">
          <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white">Performance</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{course.title}</p>
                      <p className="text-sm text-slate-500 dark:text-white/40">{course.instructor}</p>
                    </div>
                    <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 border-none text-slate-600 dark:text-white/60">{course.duration}</Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic">No courses enrolled.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentAssignments.length > 0 ? studentAssignments.slice(0, 5).map(assignment => (
                    <div key={assignment.id} className="flex items-center justify-between p-2">
                        <div className="flex gap-3 items-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <div>
                                <p className="font-medium text-sm text-slate-900 dark:text-white">{assignment.title}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                         <Badge 
                            variant="outline"
                            className={cn(
                                "text-[10px] h-5",
                                assignment.status === 'Graded' ? "border-emerald-500/20 text-emerald-500" : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40"
                            )}
                         >
                            {assignment.status}
                        </Badge>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground italic">No activity yet.</p>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceLineChart 
                        data={trends} 
                        title="Score Progression" 
                    />
                </div>
                <div className="">
                    <SubjectRadarChart 
                        data={strengths} 
                        title="Skill Breakdown" 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Growth</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">+14% <span className="text-xs text-emerald-500 font-bold ml-1">↑</span></p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Award className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Percentile</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">88th</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Accuracy</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">92.4%</p>
                    </div>
                </div>
            </div>

            <Card className="bg-primary/5 border-primary/20 border-dashed">
                <CardHeader>
                    <CardTitle className="text-primary text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> AI Counselor Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed italic">
                        "Student exhibits exceptional command over Mathematics but shows declining performance in Physics (Waves & Optics). Recommend 2 focused remediation sessions on wave interference patterns before the mid-term exams."
                    </p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="assignments">
             <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Detailed Submission History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {studentAssignments.map(a => (
                            <div key={a.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50 dark:bg-white/5">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900 dark:text-white">{a.title}</p>
                                    <p className="text-xs text-muted-foreground">Submitted: {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-end space-y-1">
                                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Graded</Badge>
                                    <p className="text-xs font-black text-muted-foreground">85/100</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>

      <InviteStudentDialog 
        student={student}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />
    </div>
  );
}
