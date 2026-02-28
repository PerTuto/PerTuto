"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Book, Calendar, Loader2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getAssignments, getCourses } from "@/lib/firebase/services";
import type { Assignment, Course, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog";
import { AssignmentDetailDialog } from "@/components/assignments/assignment-detail";

type AssignmentStatus = "Pending" | "Submitted" | "Graded";

const statusColors: { [key in AssignmentStatus]: string } = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Graded: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
};

export default function AssignmentsPage() {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const canManage = userProfile ? (userProfile.role === 'super' || userProfile.role === 'admin' || userProfile.role === 'teacher' || 
                    (Array.isArray(userProfile.role) && (userProfile.role.includes('super' as UserRole) || userProfile.role.includes('admin' as UserRole) || userProfile.role.includes('teacher' as UserRole)))) : false;

  const fetchData = useCallback(async () => {
    if (userProfile?.tenantId) {
      setLoading(true);
      try {
        const [assignmentsData, coursesData] = await Promise.all([
          getAssignments(userProfile.tenantId),
          getCourses(userProfile.tenantId)
        ]);
        setAssignments(assignmentsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch assignments data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [userProfile?.tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !userProfile) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Assignments</h2>
        {userProfile?.tenantId && canManage && (
          <AddAssignmentDialog
            tenantId={userProfile.tenantId}
            courses={courses}
            onAssignmentAdded={fetchData}
          />
        )}
      </div>

      <div className="grid gap-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const course = courses.find(c => c.id === assignment.courseId);
            return (
              <Card 
                key={assignment.id} 
                className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-lg">{assignment.title}</CardTitle>
                    {course && (
                      <CardDescription className="flex items-center gap-2 pt-1">
                        <Book className="h-4 w-4" /> {course.title}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={cn("border-transparent", statusColors[assignment.status as AssignmentStatus])}>
                    {assignment.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="h-4 w-4" />
                    Due on {(assignment.dueDate && typeof assignment.dueDate === 'object' && 'toDate' in assignment.dueDate ? (assignment.dueDate as any).toDate() : new Date(assignment.dueDate)).toLocaleDateString()}
                    {assignment.submissionUrls && assignment.submissionUrls.length > 0 && (
                      <span className="ms-2 text-xs">📎 {assignment.submissionUrls.length} file(s)</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
              No assignments found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assignment Detail Dialog */}
      {selectedAssignment && userProfile?.tenantId && (
        <AssignmentDetailDialog
          assignment={selectedAssignment}
          tenantId={userProfile.tenantId}
          open={!!selectedAssignment}
          onOpenChange={(open) => { if (!open) setSelectedAssignment(null); }}
          onUpdated={() => {
            setSelectedAssignment(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
