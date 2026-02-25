"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import type { Student } from '@/lib/types';
import { AddStudentForm } from '@/components/students/add-student-form';
import { getStudents, getCourses, addStudent as addStudentService } from '@/lib/firebase/services';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteStudentDialog } from '@/components/students/invite-student-dialog';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteStudent, setInviteStudent] = useState<Student | null>(null);
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
    
    window.addEventListener('openInviteDialog', handleOpenInvite as EventListener);
    return () => window.removeEventListener('openInviteDialog', handleOpenInvite as EventListener);
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
    </div>
  );
}
