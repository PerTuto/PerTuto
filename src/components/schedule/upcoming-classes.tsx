"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Video, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getClasses, getCourses } from "@/lib/firebase/services";
import type { Course } from "@/lib/types";

export function UpcomingClasses() {
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!userProfile?.tenantId) return;
      try {
        const [c, co] = await Promise.all([
          getClasses(userProfile.tenantId),
          getCourses(userProfile.tenantId),
        ]);
        setClasses(c);
        setCourses(co);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userProfile?.tenantId]);

  const now = new Date();
  const upcomingClasses = classes
    .filter(c => {
      const start = c.start instanceof Date ? c.start : new Date(c.start);
      return start > now;
    })
    .sort((a, b) => {
      const aStart = a.start instanceof Date ? a.start : new Date(a.start);
      const bStart = b.start instanceof Date ? b.start : new Date(b.start);
      return aStart.getTime() - bStart.getTime();
    })
    .slice(0, 3);

  const formatTime = (date: any) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Classes
        </CardTitle>
        <CardDescription>
            Next few classes on your schedule.{' '}
            <Link href="/dashboard/schedule" className="text-primary hover:underline">View full schedule</Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="space-y-4">
            {upcomingClasses.map((c) => {
              const course = courses.find(course => course.id === c.courseId);
              return (
                <div key={c.id} className="p-3 rounded-lg border bg-muted/30">
                  <p className="font-semibold">{c.title}</p>
                  {course && <p className="text-sm text-muted-foreground">{course.instructor || course.title}</p>}
                  <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(c.start)} - {formatTime(c.end)}</span>
                      </div>
                      {c.meetLink && <Badge variant="outline" className="flex gap-1.5 items-center"><Video className="h-3 w-3" /> Meet</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium">No Upcoming Classes</p>
            <p className="text-sm text-muted-foreground">Your schedule is clear for now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
