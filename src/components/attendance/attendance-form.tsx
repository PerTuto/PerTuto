"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getClasses, getCourses, getStudents, saveAttendance } from "@/lib/firebase/services";
import type { Class, Course, Student } from "@/lib/types";

type StudentAttendance = {
  studentId: string;
  studentName: string;
  present: boolean;
};

export function AttendanceForm() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!userProfile?.tenantId) return;
      setLoading(true);
      try {
        const [classData, courseData, studentData] = await Promise.all([
          getClasses(userProfile.tenantId),
          getCourses(userProfile.tenantId),
          getStudents(userProfile.tenantId),
        ]);
        setClasses(classData);
        setCourses(courseData);
        setAllStudents(studentData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userProfile?.tenantId]);

  // When class is selected, populate student list
  useEffect(() => {
    if (!selectedClassId) {
      setAttendance([]);
      return;
    }
    const cls = classes.find((c: any) => c.id === selectedClassId);
    if (!cls) return;

    // Get students for this class
    const classStudentIds: string[] = cls.students || [];
    
    // If no students linked to the class, show all students
    const relevantStudents = classStudentIds.length > 0
      ? allStudents.filter(s => classStudentIds.includes(s.id))
      : allStudents;

    setAttendance(
      relevantStudents.map(s => ({
        studentId: s.id,
        studentName: s.name,
        present: true, // Default to present
      }))
    );
    setSaved(false);
  }, [selectedClassId, classes, allStudents]);

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev =>
      prev.map(a => a.studentId === studentId ? { ...a, present: !a.present } : a)
    );
    setSaved(false);
  };

  const markAll = (present: boolean) => {
    setAttendance(prev => prev.map(a => ({ ...a, present })));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!userProfile?.tenantId || !user?.uid || !selectedClassId) return;

    const cls = classes.find((c: any) => c.id === selectedClassId);
    setSaving(true);
    try {
      await saveAttendance(userProfile.tenantId, {
        classId: selectedClassId,
        courseId: cls?.courseId || '',
        date: new Date(selectedDate),
        records: attendance,
        markedBy: user.uid,
      });
      toast({ title: "Attendance Saved", description: `Recorded for ${attendance.length} students.` });
      setSaved(true);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      toast({ title: "Error", description: "Failed to save attendance.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendance.filter(a => a.present).length;
  const absentCount = attendance.filter(a => !a.present).length;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Class / Session</Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls: any) => {
                const course = courses.find(c => c.id === cls.courseId);
                const dateStr = cls.start instanceof Date
                  ? cls.start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                  : '';
                return (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.title} {course ? `(${course.title})` : ''} {dateStr ? `— ${dateStr}` : ''}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSaved(false); }}
          />
        </div>
      </div>

      {/* Student Checklist */}
      {attendance.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-headline">Student Attendance</CardTitle>
                <CardDescription>
                  {presentCount} present · {absentCount} absent · {attendance.length} total
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => markAll(true)}>All Present</Button>
                <Button variant="outline" size="sm" onClick={() => markAll(false)}>All Absent</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {attendance.map((record) => (
                <label
                  key={record.studentId}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={record.present}
                    onCheckedChange={() => toggleAttendance(record.studentId)}
                  />
                  <span className="flex-1 text-sm font-medium">{record.studentName}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    record.present
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {record.present ? 'Present' : 'Absent'}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-end gap-3">
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
                Save Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClassId && attendance.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No students found for this class. Add students to the class first.
          </CardContent>
        </Card>
      )}

      {!selectedClassId && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Select a class to start marking attendance.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
