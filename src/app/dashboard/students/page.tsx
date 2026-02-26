"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import type { Student } from '@/lib/types';
import { AddStudentForm } from '@/components/students/add-student-form';
import { getStudents, getCourses, addStudent as addStudentService, deleteStudent as deleteStudentService } from '@/lib/firebase/services';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteStudentDialog } from '@/components/students/invite-student-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteStudent, setInviteStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user || !userProfile?.tenantId) return;
    setLoading(true);
    try {
      const [studentList, courseList] = await Promise.all([
        getStudents(userProfile.tenantId),
        getCourses(userProfile.tenantId)
      ]);

      // Create Course Map
      const courseMap = new Map(courseList.map(c => [c.id, c.title]));

      // Enrich Students with Course Names instead of IDs
      const enrichedStudents = studentList.map(s => ({
        ...s,
        courses: s.courses.map(id => courseMap.get(id) || id)
      }));

      setStudents(enrichedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Could not fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, userProfile, toast]);

  useEffect(() => {
    if (userProfile?.tenantId) {
      fetchData();
    }
    
    // Listen for invite dialog triggers from the DataTable columns
    const handleOpenInvite = (e: CustomEvent<Student>) => {
        setInviteStudent(e.detail);
    };

    // Listen for delete triggers from the DataTable columns
    const handleDeleteStudent = (e: CustomEvent<Student>) => {
        setDeleteTarget(e.detail);
    };
    
    window.addEventListener('openInviteDialog', handleOpenInvite as EventListener);
    window.addEventListener('deleteStudent', handleDeleteStudent as EventListener);
    return () => {
      window.removeEventListener('openInviteDialog', handleOpenInvite as EventListener);
      window.removeEventListener('deleteStudent', handleDeleteStudent as EventListener);
    };
  }, [userProfile, fetchData]);

  const addStudent = async (studentData: Omit<Student, 'id' | 'enrolledDate' | 'progress' | 'status' | 'ownerId'>) => {
    if (!userProfile?.tenantId) return;
    try {
      const newStudent = await addStudentService(userProfile.tenantId, studentData);
      setStudents(prev => [newStudent, ...prev]);
      toast({
        title: "Student Added",
        description: `${newStudent.name} has been successfully added.`,
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Could not add student.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteStudent = async () => {
    if (!deleteTarget || !userProfile?.tenantId) return;
    try {
      await deleteStudentService(userProfile.tenantId, deleteTarget.id);
      setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
      toast({
        title: "Student Deleted",
        description: `${deleteTarget.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Could not delete student.",
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={students}
        filterColumn="name"
        facetedFilterColumn="status"
        facetedFilterOptions={["Active", "On Hold", "Graduated", "Dropped"]}
        addEntityContext={{
          addLabel: 'Add Student',
          dialogTitle: 'Add a new student',
          dialogDescription: 'Fill in the details below to add a new student.',
          dialogContent: <AddStudentForm addStudent={addStudent} />,
        }}
      />

      {inviteStudent && (
        <InviteStudentDialog 
          student={inviteStudent} 
          open={!!inviteStudent} 
          onOpenChange={(open) => {
            if (!open) setInviteStudent(null);
          }} 
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteTarget?.name}&quot; from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
