"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, User } from "lucide-react";
import { trackAttendanceWithFacialRecognition, TrackAttendanceOutput } from "@/ai/flows/attendance-tracker-facial-recognition";
import { getStudents } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import type { Student } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// This is a placeholder. In a real app, you'd get this from a file upload or live feed.
const MOCK_VIDEO_DATA_URI = "data:video/mp4;base64,AAAA...VIDEO_DATA...AAAA";

export function AttendanceTracker() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TrackAttendanceOutput | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStudents() {
      if (userProfile?.tenantId) {
        try {
          const data = await getStudents(userProfile.tenantId);
          setStudents(data);
        } catch (error) {
          console.error("Failed to fetch students for attendance:", error);
        }
      }
    }
    fetchStudents();
  }, [userProfile?.tenantId]);

  const handleTrackAttendance = () => {
    if (students.length === 0) {
      toast({ title: "No students found", description: "Add students to your roster first.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      setResult(null);
      toast({ title: "Starting AI Attendance Scan...", description: "Please wait while we analyze the class video." });
      try {
        const knownFacesDataUris = students.map(s => s.avatar || "");

        const aiResult = await trackAttendanceWithFacialRecognition({
          videoDataUri: MOCK_VIDEO_DATA_URI,
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

  return (
    <div className="space-y-6">
      <Button onClick={handleTrackAttendance} disabled={isPending || students.length === 0} size="lg">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <User className="mr-2 h-4 w-4" />
        )}
        Scan Class for Attendance
      </Button>

      {result && (
        <div className="space-y-4">
          <Alert>
            <AlertTitle className="font-headline">Analysis Summary</AlertTitle>
            <AlertDescription>{result.summary}</AlertDescription>
          </Alert>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(result.attendanceRecords).map(([name, isPresent]) => {
                  const student = students.find(s => s.name === name);
                  return (
                    <TableRow key={name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student?.avatar} alt={student?.name} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isPresent ? (
                          <span className="flex items-center justify-end text-green-600 dark:text-green-400"><CheckCircle className="h-4 w-4 mr-2" /> Present</span>
                        ) : (
                          <span className="flex items-center justify-end text-red-600 dark:text-red-400"><XCircle className="h-4 w-4 mr-2" /> Absent</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
