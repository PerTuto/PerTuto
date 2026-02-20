"use client"

import { classes, courses } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Video } from "lucide-react";
import Link from "next/link";

const courseColorMap: { [key: string]: string } = {
  'course-1': 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300',
  'course-2': 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
  'course-3': 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-300',
  'course-4': 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-300',
};


export function UpcomingClasses() {
  const upcomingClasses = classes
    .filter(c => c.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 3);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Classes
        </CardTitle>
        <CardDescription>
            Here are the next few classes on your schedule. <Link href="/schedule" className="text-primary hover:underline">View full schedule</Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {upcomingClasses.length > 0 ? (
          <div className="space-y-4">
            {upcomingClasses.map((c) => {
              const course = courses.find(course => course.id === c.courseId);
              return (
                <div key={c.id} className={cn("p-3 rounded-lg border", courseColorMap[c.courseId] || 'bg-muted')}>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm">{course?.instructor}</p>
                  <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{c.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {c.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
