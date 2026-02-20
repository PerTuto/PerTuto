import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AttendanceTracker } from "@/components/attendance/attendance-tracker";

export default function AttendancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Attendance Tracker</CardTitle>
        <CardDescription>
          Use facial recognition from video feeds to automatically mark attendance.
          This is a simulation using the AI flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceTracker />
      </CardContent>
    </Card>
  );
}
