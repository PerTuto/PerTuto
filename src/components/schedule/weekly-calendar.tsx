"use client";

import React, { useState, useEffect } from 'react';
import { getClasses, getCourses, getStudents } from '@/lib/firebase/services';
import { useAuth } from '@/hooks/use-auth';
import type { Class, Course, Student } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COURSE_COLORS = [
  { light: 'bg-blue-200 border-blue-400 text-blue-800', dark: 'dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300' },
  { light: 'bg-green-200 border-green-400 text-green-800', dark: 'dark:bg-green-900/50 dark:border-green-700 dark:text-green-300' },
  { light: 'bg-yellow-200 border-yellow-400 text-yellow-800', dark: 'dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-300' },
  { light: 'bg-purple-200 border-purple-400 text-purple-800', dark: 'dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-300' },
  { light: 'bg-pink-200 border-pink-400 text-pink-800', dark: 'dark:bg-pink-900/50 dark:border-pink-700 dark:text-pink-300' },
  { light: 'bg-orange-200 border-orange-400 text-orange-800', dark: 'dark:bg-orange-900/50 dark:border-orange-700 dark:text-orange-300' },
];

const TIMEZONE_MAP: Record<string, string> = {
  'EST': 'America/New_York',
  'EDT': 'America/New_York',
  'PST': 'America/Los_Angeles',
  'PDT': 'America/Los_Angeles',
  'CST': 'America/Chicago',
  'IST': 'Asia/Kolkata',
};


interface WeeklyCalendarProps {
  onClassClick?: (classItem: Class) => void;
}

export function WeeklyCalendar({ onClassClick }: WeeklyCalendarProps) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState<Class[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!user || !userProfile?.tenantId) return;
      setLoading(true);
      try {
        const [classesData, coursesData, studentsData] = await Promise.all([
          getClasses(userProfile.tenantId),
          getCourses(userProfile.tenantId),
          getStudents(userProfile.tenantId)
        ]);
        setClasses(classesData);
        setAvailableCourses(coursesData);
        setAvailableStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch schedule data", error);
      } finally {
        setLoading(false);
      }
    }
    if (userProfile?.tenantId) {
      fetchData();
    }
  }, [user, userProfile]);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);


  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const handlePrevWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  }

  const getStudentTime = (classItem: Class) => {
    if (!classItem.students || classItem.students.length === 0) return null;
    const firstStudentId = classItem.students[0];
    const student = availableStudents.find(s => s.id === firstStudentId);
    if (student && student.timezone && TIMEZONE_MAP[student.timezone]) {
      try {
        const timeStr = classItem.start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: TIMEZONE_MAP[student.timezone]
        });
        return `${timeStr} (${student.timezone})`;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  if (!isClient) {
    return null;
  }

  const weekClasses = classes.filter(c => c.start >= startOfWeek && c.start <= endOfWeek);

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="flex flex-col flex-1 bg-transparent border-0 shadow-none -translate-y-0 hover:-translate-y-0 hover:border-transparent hover:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">
              {startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription>
              Week of {startOfWeek.getDate()} - {endOfWeek.getDate()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToday}>Today</Button>
            <Button variant="outline" size="icon" onClick={handlePrevWeek}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden h-full">
            {days.map((day) => {
              const dayClasses = weekClasses
                .filter(c => c.start.toDateString() === day.toDateString())
                .sort((a, b) => a.start.getTime() - b.start.getTime());

              return (
                <div key={day.toISOString()} className="bg-background p-3 flex flex-col gap-3">
                  <div className="text-center font-medium">
                    <p className="text-muted-foreground text-xs">{day.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</p>
                    <p className="font-headline text-lg">{day.getDate()}</p>
                  </div>
                  <div className="space-y-3">
                    {loading ? <p className="text-xs text-muted-foreground">Loading...</p> : dayClasses.map(c => {
                      const course = availableCourses.find(item => item.id === c.courseId);

                      let colorIndex = 0;
                      if (c.courseId) {
                        let hash = 0;
                        for (let i = 0; i < c.courseId.length; i++) {
                          hash = c.courseId.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        colorIndex = Math.abs(hash) % COURSE_COLORS.length;
                      }
                      const theme = COURSE_COLORS[colorIndex];
                      const studentTime = getStudentTime(c);

                      return (
                        <Tooltip key={c.id}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => onClassClick?.(c)}
                              className={cn(
                                "p-3 rounded-lg border text-xs overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all shadow-md space-y-1",
                                theme.light,
                                theme.dark
                              )}
                            >
                              <p className="font-bold truncate">{c.title}</p>
                              {course && (
                                <p className="text-xs truncate flex items-center gap-1.5"><User className="h-3 w-3" />{course?.instructor}</p>
                              )}
                              <p className="text-xs truncate flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span>{c.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {c.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </p>
                              {c.meetLink &&
                                <Badge variant="outline" className="flex gap-1.5 items-center w-fit">
                                  <Video className="h-3 w-3" /> Meet
                                </Badge>
                              }
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{c.title}</p>
                            {studentTime && <p className="flex items-center gap-2"><Globe className="h-3 w-3" /> Student Time: {studentTime}</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    {!loading && dayClasses.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground pt-8">
                        No classes.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}