"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getStudents, getClasses, saveAttendance } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import type { Student, Class } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

export function AttendanceTracker() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (userProfile?.tenantId) {
        try {
          const [studentData, classData] = await Promise.all([
            getStudents(userProfile.tenantId),
            getClasses(userProfile.tenantId)
          ]);
          setStudents(studentData);
          setClasses(classData.filter(c => c.status !== 'cancelled').sort((a,b) => b.start.getTime() - a.start.getTime()));
        } catch (error) {
          console.error("Failed to fetch data for attendance:", error);
          toast({ title: "Error", description: "Could not load classes.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchData();
  }, [userProfile?.tenantId, toast]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  
  useEffect(() => {
    if (selectedClass) {
      // Initialize attendance state
      const classStudentIds = selectedClass.students || [];
      const relevantStudents = classStudentIds.length > 0 
        ? students.filter(s => classStudentIds.includes(s.id))
        : students; // fallback
        
      const initialState: Record<string, boolean> = {};
      relevantStudents.forEach(s => {
        initialState[s.id] = true; // Default to present
      });
      setAttendanceState(initialState);
    }
  }, [selectedClassId, selectedClass, students]);

  const toggleStudent = (studentId: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSubmitAttendance = async () => {
    if (!userProfile?.tenantId || !user?.uid || !selectedClass) return;

    setIsSaving(true);
    try {
      const records = Object.entries(attendanceState).map(([studentId, isPresent]) => {
        const student = students.find(s => s.id === studentId);
        return {
          studentId: studentId,
          studentName: student?.name || "Unknown",
          present: isPresent
        };
      });

      await saveAttendance(userProfile.tenantId, {
        classId: selectedClass.id,
        courseId: selectedClass.courseId,
        date: selectedClass.start,
        records,
        markedBy: user.uid
      });

      toast({ title: "Success", description: "Attendance records have been saved." });
      setSelectedClassId("");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save attendance.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const classStudentIds = selectedClass?.students || [];
  const displayStudents = selectedClass 
    ? (classStudentIds.length > 0 ? students.filter(s => classStudentIds.includes(s.id)) : students)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 max-w-xl">
        <div className="space-y-2">
          <Label className="text-base font-medium">Select Class</Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a class session to mark attendance..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title} - {format(c.start, "PPp")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedClass && (
        <div className="space-y-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Present?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No students found for this class.
                  </TableCell>
                </TableRow>
              ) : (
                displayStudents.map((student) => {
                  const isPresent = attendanceState[student.id] ?? false;
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isPresent ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {isPresent ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </TableCell>
                      <TableCell className="text-end">
                        <Switch 
                          checked={isPresent} 
                          onCheckedChange={() => toggleStudent(student.id)} 
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          {displayStudents.length > 0 && (
            <div className="p-4 flex justify-end border-t bg-muted/50">
              <Button onClick={handleSubmitAttendance} disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
