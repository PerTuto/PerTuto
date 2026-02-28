"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClipboardList, Book, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getAssignments, getCourses } from "@/lib/firebase/services";
import type { Assignment, Course } from "@/lib/types";

const statusColors: { [key in "Pending" | "Submitted" | "Graded"]: string } = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20",
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
  Graded: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500 border-green-200 dark:border-green-500/20",
};

export function PendingAssignments() {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!userProfile?.tenantId) return;
      try {
        const [a, c] = await Promise.all([
          getAssignments(userProfile.tenantId),
          getCourses(userProfile.tenantId),
        ]);
        setAssignments(a);
        setCourses(c);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userProfile?.tenantId]);

  const pendingAssignments = assignments.filter(a => a.status === 'Pending').slice(0, 5);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Pending Assignments
        </CardTitle>
        <CardDescription>Assignments that are due soon.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : pendingAssignments.length > 0 ? (
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const course = courses.find(c => c.id === assignment.courseId);
              
              // Robust Date Parsing
              let dueDate: Date;
              if (assignment.dueDate instanceof Date) {
                  dueDate = assignment.dueDate;
              } else if (assignment.dueDate && typeof (assignment.dueDate as any).toDate === 'function') {
                  dueDate = (assignment.dueDate as any).toDate();
              } else {
                  dueDate = new Date(assignment.dueDate);
              }

              return (
                <div key={assignment.id} className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="font-medium">{assignment.title}</p>
                        {course && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Book className="h-3 w-3" /> {course.title}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" /> Due on {dueDate.toLocaleDateString()}
                        </p>
                    </div>
                     <Badge className={cn("border-transparent text-xs", statusColors[assignment.status as keyof typeof statusColors])}>
                        {assignment.status}
                    </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium">No Pending Assignments</p>
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
