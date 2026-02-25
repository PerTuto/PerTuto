"use client";

import React from 'react';
import type { Class, Course } from '@/lib/types';
import { Clock, Video, User, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AgendaListViewProps {
  classes: Class[];
  courses: Course[];
  onClassClick?: (classItem: Class) => void;
  timezone: string;
}

const COURSE_COLORS = [
  { bg: 'bg-blue-500/15', border: 'border-blue-500', text: 'text-blue-700', accent: '#3b82f6' },
  { bg: 'bg-green-500/15', border: 'border-green-500', text: 'text-green-700', accent: '#22c55e' },
  { bg: 'bg-violet-500/15', border: 'border-violet-500', text: 'text-violet-700', accent: '#8b5cf6' },
  { bg: 'bg-orange-500/15', border: 'border-orange-500', text: 'text-orange-700', accent: '#f97316' },
  { bg: 'bg-pink-500/15', border: 'border-pink-500', text: 'text-pink-700', accent: '#ec4899' },
];

function getColorForCourse(courseId: string) {
  if (!courseId) return COURSE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
}

export function AgendaListView({ classes, courses, onClassClick, timezone }: AgendaListViewProps) {
  // Group classes by date
  const groupedClasses = classes.reduce((groups, classItem) => {
    const date = format(classItem.start, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(classItem);
    return groups;
  }, {} as Record<string, Class[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedClasses).sort();

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No classes scheduled</h3>
        <p className="text-muted-foreground text-sm mt-1">There are no classes for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 space-y-8">
      {sortedDates.map(dateStr => {
        const date = new Date(dateStr);
        const dateClasses = groupedClasses[dateStr].sort((a, b) => a.start.getTime() - b.start.getTime());

        return (
          <div key={dateStr} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              {format(date, 'EEEE, MMM do')}
            </h3>
            
            <div className="grid gap-3">
              {dateClasses.map(c => {
                const color = getColorForCourse(c.courseId);
                const course = courses.find(co => co.id === c.courseId);
                
                return (
                  <div 
                    key={c.id}
                    onClick={() => onClassClick?.(c)}
                    className={cn(
                      "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98]",
                      "bg-white hover:border-primary/50 shadow-sm",
                      c.rescheduleStatus === 'requested' && "border-amber-200 bg-amber-50/50"
                    )}
                  >
                    {/* Time Column */}
                    <div className="flex flex-col items-center min-w-[60px] pt-1">
                      <span className="text-sm font-bold text-foreground">
                        {format(c.start, 'h:mm')}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">
                        {format(c.start, 'a')}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-base truncate pr-6">{c.title}</h4>
                        <ChevronRight className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 opacity-50" />
                      </div>
                      
                      <div className="flex flex-wrap gap-y-1 gap-x-3 items-center text-xs text-muted-foreground">
                        {course && (
                          <span className={cn("inline-flex items-center gap-1 font-medium", color.text)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full bg-current")}></span>
                            {course.title}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round((c.end.getTime() - c.start.getTime()) / 60000)} mins
                        </span>
                        {c.meetLink && (
                          <span className="flex items-center gap-1 text-primary">
                            <Video className="w-3 h-3" />
                            Online
                          </span>
                        )}
                      </div>
                      
                      {c.rescheduleStatus === 'requested' && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-tight">
                          <Clock className="w-2.5 h-2.5" />
                          Reschedule Requested
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
