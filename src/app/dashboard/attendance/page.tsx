"use client";

import { AttendanceForm } from "@/components/attendance/attendance-form";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Attendance</h1>
        <p className="text-muted-foreground text-sm">
          Mark and track student attendance for class sessions.
        </p>
      </div>
      <AttendanceForm />
    </div>
  );
}
