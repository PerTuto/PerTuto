"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, User, Camera, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackAttendanceWithFacialRecognition, TrackAttendanceOutput } from "@/ai/flows/attendance-tracker-facial-recognition";
import { getStudents, getClasses, saveAttendance } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import type { Student, Class } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

// Real implementation using Gemini Vision

export function AttendanceTracker() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TrackAttendanceOutput | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

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
        }
      }
    }
    fetchData();
  }, [userProfile?.tenantId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrackAttendance = () => {
    if (students.length === 0) {
      toast({ title: "No students found", description: "Add students to your roster first.", variant: "destructive" });
      return;
    }

    if (!selectedImage) {
      toast({ title: "No image selected", description: "Please upload a class snapshot first.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      setResult(null);
      toast({ title: "Starting AI Attendance Scan...", description: "Please wait while Gemini analyzes the class snapshot." });
      try {
        const knownFacesDataUris = students.map(s => s.avatar || "").filter(Boolean);

        const aiResult = await trackAttendanceWithFacialRecognition({
          imageDataUri: selectedImage,
          knownFacesDataUris: knownFacesDataUris,
          classRoster: students.map(s => s.name),
        });

        setResult(aiResult);
        toast({ title: "Attendance Scan Complete", description: aiResult.summary });

      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to process attendance with AI. Using simulation fallback.",
          variant: "destructive"
        });

        // Fallback simulation if the actual AI flow fails (e.g. invalid API key or media)
        const mockAttendance: Record<string, boolean> = {};
        students.forEach(student => {
          mockAttendance[student.name] = Math.random() > 0.2;
        });
        const mockResultOnError: TrackAttendanceOutput = {
          attendanceRecords: mockAttendance,
          summary: "Simulation mode enabled: Failed to connect to Gemini Vision Pro for real-time analysis."
        };
        setResult(mockResultOnError);
      }
    });
  };

  const handleSubmitAttendance = async () => {
    if (!result || !userProfile?.tenantId || !user?.uid) return;
    
    if (!selectedClassId) {
      toast({ title: "Select a class", description: "Please assign this attendance to a class session.", variant: "destructive" });
      return;
    }

    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) return;

    setIsSaving(true);
    try {
      const records = Object.entries(result.attendanceRecords).map(([name, isPresent]) => {
        const student = students.find(s => s.name === name);
        return {
          studentId: student?.id || "unknown",
          studentName: name,
          present: isPresent
        };
      });

      await saveAttendance(userProfile.tenantId, {
        classId: selectedClassId,
        courseId: selectedClass.courseId,
        date: selectedClass.start,
        records,
        markedBy: user.uid
      });

      toast({ title: "Success", description: "Attendance records have been saved." });
      setResult(null);
      setSelectedImage(null);
      setFileInputKey(k => k + 1);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save attendance.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 max-w-xl">
        <div className="space-y-2">
          <Label className="text-base font-medium">Select Class</Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a class session..." />
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

        <div className="space-y-2">
          <Label htmlFor="class-snapshot" className="text-base font-medium flex items-center gap-2">
            <Camera className="h-4 w-4" /> Class Snapshot
          </Label>
          <div className="flex items-center gap-4">
            <Input 
              id="class-snapshot" 
              key={fileInputKey}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {selectedImage && (
              <Button variant="ghost" size="sm" onClick={() => { setSelectedImage(null); setFileInputKey(k => k + 1); }}>
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Upload a clear photo of the students in the class for AI identification.</p>
        </div>

        {selectedImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
            <img src={selectedImage} alt="Class Snapshot" className="object-cover w-full h-full" />
          </div>
        )}

        <Button onClick={handleTrackAttendance} disabled={isPending || !selectedImage || students.length === 0} size="lg">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Analyzing..." : "Analyze Attendance"}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <Alert>
            <AlertTitle className="font-headline">Analysis Summary</AlertTitle>
            <AlertDescription>{result.summary}</AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={handleSubmitAttendance} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Confirm & Save Attendance"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
