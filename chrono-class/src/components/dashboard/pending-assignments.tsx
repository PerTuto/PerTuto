"use client"

import { assignments, courses } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClipboardList, Book, Calendar } from "lucide-react";
import Link from "next/link";

const statusColors: { [key in "Pending" | "Submitted" | "Graded"]: string } = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Graded: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
};

export function PendingAssignments() {
  const pendingAssignments = assignments.filter(a => a.status === 'Pending').slice(0, 5);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Pending Assignments
        </CardTitle>
        <CardDescription>A list of assignments that are due soon.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {pendingAssignments.length > 0 ? (
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const course = courses.find(c => c.id === assignment.courseId);
              const dueDateObj = assignment.dueDate instanceof Date ? assignment.dueDate : new Date(assignment.dueDate);
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
                            <Calendar className="h-3 w-3" /> Due on {dueDateObj.toLocaleDateString()}
                        </p>
                    </div>
                     <Badge className={cn("border-transparent text-xs", statusColors[assignment.status])}>
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
