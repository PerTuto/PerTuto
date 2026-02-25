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
import { getStudents, getCourses, getAssignments } from "@/lib/firebase/services";
import type { Student, Course, Assignment } from "@/lib/types";
import { InviteStudentDialog } from "@/components/students/invite-student-dialog";
import { Button } from "@/components/ui/button";

const statusColors: { [key in Student['status']]: string } = {
    Active: "bg-green-100 text-green-800",
    'On-hold': "bg-yellow-100 text-yellow-800",
    Graduated: "bg-blue-100 text-blue-800",
    Dropped: "bg-red-100 text-red-800",
};

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const { userProfile } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!userProfile?.tenantId || !studentId) return;
      try {
        const [allStudents, allCourses, allAssignments] = await Promise.all([
          getStudents(userProfile.tenantId),
          getCourses(userProfile.tenantId),
          getAssignments(userProfile.tenantId),
        ]);
        const found = allStudents.find(s => s.id === studentId) || null;
        setStudent(found);
        setCourses(allCourses);
        setAssignments(allAssignments);
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
            <div className="text-right">
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="text-3xl font-bold font-headline text-primary">{student.progress || 0}%</div>
                <Progress value={student.progress || 0} className="w-32 mt-2 mb-4"/>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Generate Login
                </Button>
            </div>
        </CardHeader>
        {student.notes && (
            <CardContent>
                <div className="border-l-4 border-primary/50 bg-muted/20 p-4 rounded-r-lg">
                    <p className="font-semibold text-sm">Notes:</p>
                    <p className="text-muted-foreground text-sm">{student.notes}</p>
                </div>
            </CardContent>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="h-5 w-5" /> Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>
                <Badge variant="secondary">{course.duration}</Badge>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No courses enrolled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentAssignments.length > 0 ? studentAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                     <Badge 
                        variant={assignment.status === 'Graded' ? 'default' : assignment.status === 'Submitted' ? 'secondary' : 'outline'}
                     >
                        {assignment.status}
                    </Badge>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No assignments yet.</p>
              )}
          </CardContent>
        </Card>
      </div>

      <InviteStudentDialog 
        student={student}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />
    </div>
  );
}
