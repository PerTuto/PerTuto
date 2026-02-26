"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getClasses, getCourses, getStudents, updateClass } from '@/lib/firebase/services';
import { useAuth } from '@/hooks/use-auth';
import type { Class, Course, Student, UserRole } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Clock, Video, User, Globe, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/hooks/use-settings';
import { AgendaListView } from './agenda-list-view';

// ── Constants ──────────────────────────────────────────────────
const START_HOUR = 6;   // 6 AM
const END_HOUR = 22;    // 10 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 64; // px per hour slot
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;

const COURSE_COLORS = [
  { bg: 'bg-blue-500/15', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', accent: '#3b82f6' },
  { bg: 'bg-green-500/15', border: 'border-green-500', text: 'text-green-700 dark:text-green-300', accent: '#22c55e' },
  { bg: 'bg-violet-500/15', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300', accent: '#8b5cf6' },
  { bg: 'bg-orange-500/15', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-300', accent: '#f97316' },
  { bg: 'bg-pink-500/15', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-300', accent: '#ec4899' },
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300', accent: '#06b6d4' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300', accent: '#f59e0b' },
  { bg: 'bg-rose-500/15', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-300', accent: '#f43f5e' },
];

const COMMON_TIMEZONES = [
  { label: 'Local Time', value: '' },
  { label: 'IST (India)', value: 'Asia/Kolkata' },
  { label: 'EST (New York)', value: 'America/New_York' },
  { label: 'PST (Los Angeles)', value: 'America/Los_Angeles' },
  { label: 'GMT (London)', value: 'Europe/London' },
  { label: 'GST (Dubai)', value: 'Asia/Dubai' },
  { label: 'SGT (Singapore)', value: 'Asia/Singapore' },
  { label: 'JST (Tokyo)', value: 'Asia/Tokyo' },
  { label: 'AEST (Sydney)', value: 'Australia/Sydney' },
];

// ── Types ──────────────────────────────────────────────────────
type CalendarView = 'week' | 'day';

interface WeeklyCalendarProps {
  onClassClick?: (classItem: Class) => void;
  onSlotClick?: (date: Date) => void;
  onClassDragged?: (classItem: Class, newStart: Date, newEnd: Date, durationMins: number, newStartHour: number, newStartMinute: number, tz: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────
function getColorForCourse(courseId: string) {
  if (!courseId) return COURSE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
}

function formatTimeInTz(date: Date, tz: string, hour12: boolean = true): string {
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12 };
  if (tz) opts.timeZone = tz;
  return date.toLocaleTimeString([], opts);
}

function setTzTime(baseDate: Date, hours: number, minutes: number, tz: string): Date {
  // Create a date in local time with the target hour/min
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  if (!tz) return d;

  // Calculate the offset between target format and local
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });

  // We want: formatter.format(finalDate) == "hours:minutes"
  // This is a simple iterative approach since offsets are usually in 30/15 min chunks
  let offsetMs = 0;
  for (let i = 0; i < 2; i++) {
    const parts = formatter.formatToParts(new Date(d.getTime() - offsetMs));
    let currentH = 0;
    let currentM = 0;
    for (const p of parts) {
      if (p.type === 'hour') currentH = parseInt(p.value, 10);
      if (p.type === 'minute') currentM = parseInt(p.value, 10);
    }
    if (currentH === 24) currentH = 0;
    
    const diffMins = (currentH * 60 + currentM) - (hours * 60 + minutes);
    offsetMs += diffMins * 60000;
  }
  
  return new Date(d.getTime() - offsetMs);
}

function getTimeComponentsInTz(date: Date, tz: string): { hours: number; minutes: number } {
  if (!tz) return { hours: date.getHours(), minutes: date.getMinutes() };
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(date);
  
  let hours = 0;
  let minutes = 0;
  for (const part of parts) {
    if (part.type === 'hour') hours = parseInt(part.value, 10);
    if (part.type === 'minute') minutes = parseInt(part.value, 10);
  }
  if (hours === 24) hours = 0;
  return { hours, minutes };
}

function getEventPosition(start: Date, end: Date, tz: string): { top: number; height: number } {
  const startTz = getTimeComponentsInTz(start, tz);
  const endTz = getTimeComponentsInTz(end, tz);

  const startMinutes = startTz.hours * 60 + startTz.minutes;
  let endMinutes = endTz.hours * 60 + endTz.minutes;
  
  if (endMinutes <= startMinutes && endMinutes < 60) {
    endMinutes += 24 * 60; // Approximate visual handling of midnight crossing
  }

  const offsetFromGrid = startMinutes - START_HOUR * 60;
  const durationMinutes = endMinutes - startMinutes;

  const top = (offsetFromGrid / 60) * HOUR_HEIGHT;
  const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 20); // min 20px

  return { top, height };
}

// ── Component ──────────────────────────────────────────────────
export function WeeklyCalendar({ onClassClick, onSlotClick, onClassDragged, timezone, onTimezoneChange }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  const { timeFormat } = useSettings();
  const hour12 = timeFormat === '12h';

  // Drag state
  const [dragData, setDragData] = useState<{ classItem: Class; offsetY: number } | null>(null);
  const [resizeData, setResizeData] = useState<{ classItem: Class; startY: number; originalEnd: Date } | null>(null);

  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canManage = userProfile ? (
    userProfile.role === 'super' || userProfile.role === 'admin' || userProfile.role === 'teacher' ||
    (Array.isArray(userProfile.role) && (userProfile.role as UserRole[]).some(r => ['super', 'admin', 'teacher'].includes(r)))
  ) : false;

  // ── Client check + current time ticker ──
  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-scroll to current time on mount ──
  useEffect(() => {
    if (isClient && scrollRef.current) {
      const now = new Date();
      const scrollTo = ((now.getHours() - START_HOUR) * HOUR_HEIGHT) - 100;
      scrollRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [isClient, loading]);



  // ── Data fetching ──
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
        setCourses(coursesData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch schedule data", error);
      } finally {
        setLoading(false);
      }
    }
    if (userProfile?.tenantId) fetchData();
  }, [user, userProfile]);

  // ── Date calculations ──
  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const days = useMemo(() => {
    if (view === 'day') return [new Date(currentDate)];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate, startOfWeek, view]);

  const endOfWeek = useMemo(() => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [startOfWeek]);

  // ── Navigation ──
  const navigate = useCallback((dir: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + (view === 'day' ? dir : dir * 7));
      return d;
    });
  }, [view]);

  const goToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleTzChange = useCallback((tz: string) => {
    onTimezoneChange(tz);
  }, [onTimezoneChange]);

  // ── Current time line position ──
  const currentTimePosition = useMemo(() => {
    const tzTime = getTimeComponentsInTz(currentTime, timezone);
    const minutes = tzTime.hours * 60 + tzTime.minutes;
    const offset = minutes - START_HOUR * 60;
    return (offset / 60) * HOUR_HEIGHT;
  }, [currentTime, timezone]);

  const isToday = useCallback((day: Date) => {
    const today = new Date();
    return day.toDateString() === today.toDateString();
  }, []);

  // ── Drag & Drop ──
  const handleDragStart = useCallback((e: React.DragEvent, classItem: Class) => {
    if (!canManage) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', classItem.id);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    setDragData({ classItem, offsetY });
  }, [canManage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, dayDate: Date) => {
    e.preventDefault();
    if (!dragData || !userProfile?.tenantId || !canManage) return;

    const gridRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - gridRect.top - dragData.offsetY;
    const minutesFromStart = Math.round((relativeY / HOUR_HEIGHT) * 60 / 15) * 15; // snap to 15 min
    const totalMinutes = START_HOUR * 60 + minutesFromStart;

    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;

    const duration = dragData.classItem.end.getTime() - dragData.classItem.start.getTime();
    const newStart = setTzTime(dayDate, newHour, newMinute, timezone);
    const newEnd = new Date(newStart.getTime() + duration);

    try {
      // Check if this is a recurring event
      if (dragData.classItem.recurrenceGroupId) {
        onClassDragged?.(dragData.classItem, newStart, newEnd, duration / 60000, newHour, newMinute, timezone);
      } else {
        await updateClass(userProfile.tenantId, dragData.classItem.id, {
          start: Timestamp.fromDate(newStart),
          end: Timestamp.fromDate(newEnd),
        });
        // Update local state immediately
        setClasses(prev => prev.map(c =>
          c.id === dragData.classItem.id ? { ...c, start: newStart, end: newEnd } : c
        ));
        toast({ title: "Class Moved", description: `Moved to ${newStart.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12 })}` });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to move class.", variant: "destructive" });
    }

    setDragData(null);
  }, [dragData, userProfile?.tenantId, canManage, onClassDragged, toast]);

  // ── Resize ──
  const handleResizeStart = useCallback((e: React.MouseEvent, classItem: Class) => {
    if (!canManage) return;
    e.stopPropagation();
    e.preventDefault();
    setResizeData({ classItem, startY: e.clientY, originalEnd: classItem.end });
  }, [canManage]);

  useEffect(() => {
    if (!resizeData) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - resizeData.startY;
      const deltaMinutes = Math.round((deltaY / HOUR_HEIGHT) * 60 / 15) * 15;
      const newEnd = new Date(resizeData.originalEnd.getTime() + deltaMinutes * 60 * 1000);

      setClasses(prev => prev.map(c =>
        c.id === resizeData.classItem.id ? { ...c, end: newEnd } : c
      ));
    };

    const handleMouseUp = async (e: MouseEvent) => {
      if (!userProfile?.tenantId) return;
      const deltaY = e.clientY - resizeData.startY;
      const deltaMinutes = Math.round((deltaY / HOUR_HEIGHT) * 60 / 15) * 15;
      const newEnd = new Date(resizeData.originalEnd.getTime() + deltaMinutes * 60 * 1000);

      try {
        await updateClass(userProfile.tenantId, resizeData.classItem.id, {
          end: Timestamp.fromDate(newEnd),
        });
        toast({ title: "Duration Updated", description: `Ends at ${newEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 })}` });
      } catch {
        toast({ title: "Error", description: "Failed to resize.", variant: "destructive" });
      }
      setResizeData(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeData, userProfile?.tenantId, toast]);

  // ── Click to create ──
  const handleGridClick = useCallback((e: React.MouseEvent, dayDate: Date) => {
    if (!canManage) return;
    // Only trigger if clicking directly on the grid, not on an event
    if ((e.target as HTMLElement).closest('[data-event]')) return;

    const gridRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - gridRect.top;
    const minutesFromStart = Math.round((relativeY / HOUR_HEIGHT) * 60 / 15) * 15;
    const totalMinutes = START_HOUR * 60 + minutesFromStart;

    const clickDate = new Date(dayDate);
    clickDate.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);

    onSlotClick?.(clickDate);
  }, [canManage, onSlotClick]);

  if (!isClient) return null;

  // ── Compute week range ──
  const rangeStart = view === 'day' ? currentDate : startOfWeek;
  const rangeEnd = view === 'day' ? currentDate : endOfWeek;
  const filteredClasses = classes.filter(c => {
    const d = c.start;
    if (view === 'day') return d.toDateString() === currentDate.toDateString();
    return d >= startOfWeek && d <= endOfWeek;
  });

  // ── Header info ──
  const headerLabel = view === 'day'
    ? currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : `${startOfWeek.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;

  const subLabel = view === 'week'
    ? `${startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
    : '';

  const hourLabels = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = START_HOUR + i;
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    return formatTimeInTz(d, timezone, hour12);
  });

  return (
    <div className="flex flex-col flex-1 rounded-xl border bg-background shadow-sm overflow-hidden">
      {/* ── Calendar Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold font-headline">{headerLabel}</h2>
          {subLabel && <span className="text-sm text-muted-foreground">{subLabel}</span>}
        </div>

        <div className="flex items-center gap-2">
          {/* Timezone Switcher */}
          <div className="relative">
            <select
              value={timezone}
              onChange={(e) => handleTzChange(e.target.value)}
              className="appearance-none bg-transparent border rounded-md px-2 py-1.5 text-xs pr-6 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            <Globe className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setView('day')}
              className={cn("px-3 py-1.5 text-xs font-medium transition-colors", view === 'day' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50')}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={cn("px-3 py-1.5 text-xs font-medium transition-colors border-l", view === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50')}
            >
              Week
            </button>
          </div>

          {/* Navigation */}
          <Button variant="outline" size="sm" onClick={goToday} className="text-xs">Today</Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Day Headers ── */}
      <div className="grid border-b bg-muted/20" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
        <div className="p-2 border-r" /> {/* Gutter for time labels */}
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={cn(
              "text-center py-2 border-r last:border-r-0 transition-colors",
              isToday(day) && "bg-primary/5"
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {day.toLocaleDateString(undefined, { weekday: 'short' })}
            </p>
            <p className={cn(
              "text-lg font-semibold font-headline leading-none mt-0.5",
              isToday(day) && "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
            )}>
              {day.getDate()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Time Grid (scrollable) or Agenda List ── */}
      {isMobile ? (
        <AgendaListView 
          classes={filteredClasses}
          courses={courses}
          onClassClick={onClassClick}
          timezone={timezone}
        />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <div className="grid relative" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)`, height: TOTAL_HEIGHT, minWidth: '100%' }}>
            {/* ... rest of the grid ... */}

          {/* ── Hour labels + gridlines ── */}
          <div className="relative border-r">
            {hourLabels.map((label, i) => (
              <div
                key={i}
                className="absolute w-full text-right pr-2 -translate-y-1/2"
                style={{ top: i * HOUR_HEIGHT }}
              >
                <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Day columns ── */}
          {days.map((day, dayIdx) => {
            const dayClasses = filteredClasses
              .filter(c => c.start.toDateString() === day.toDateString())
              .sort((a, b) => a.start.getTime() - b.start.getTime());

            return (
              <div
                key={day.toISOString()}
                className={cn("relative border-r last:border-r-0", isToday(day) && "bg-primary/[0.02]")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                onClick={(e) => handleGridClick(e, day)}
              >
                {/* Hour gridlines */}
                {hourLabels.map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-border/40"
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}
                {/* Half-hour dashed lines */}
                {hourLabels.map((_, i) => (
                  <div
                    key={`half-${i}`}
                    className="absolute w-full border-t border-dashed border-border/20"
                    style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                  />
                ))}

                {/* ── Event blocks ── */}
                <TooltipProvider delayDuration={200}>
                  {(() => {
                    // Collision detection grouping
                    const groups: any[][] = [];
                    let currentGroup: any[] = [];
                    let groupMaxEnd = 0;

                    const eventsWithPos = dayClasses.map(c => {
                      const pos = getEventPosition(c.start, c.end, timezone);
                      const startTz = getTimeComponentsInTz(c.start, timezone);
                      const endTz = getTimeComponentsInTz(c.end, timezone);
                      const startMin = startTz.hours * 60 + startTz.minutes;
                      let endMin = endTz.hours * 60 + endTz.minutes;
                      if (endMin <= startMin) endMin += 24 * 60;
                      return { classItem: c, pos, startMin, endMin };
                    }).sort((a, b) => a.startMin - b.startMin);

                    eventsWithPos.forEach((ev) => {
                      if (currentGroup.length === 0) {
                        currentGroup.push(ev);
                        groupMaxEnd = ev.endMin;
                      } else if (ev.startMin < groupMaxEnd) {
                        currentGroup.push(ev);
                        groupMaxEnd = Math.max(groupMaxEnd, ev.endMin);
                      } else {
                        groups.push([...currentGroup]);
                        currentGroup = [ev];
                        groupMaxEnd = ev.endMin;
                      }
                    });
                    if (currentGroup.length > 0) groups.push(currentGroup);

                    return groups.flatMap(group => {
                      return group.map((ev, idx) => {
                        const c = ev.classItem;
                        const pos = ev.pos;
                        const widthPct = 100 / group.length;
                        const leftPct = idx * widthPct;
                        
                        const color = getColorForCourse(c.courseId);
                        const course = courses.find(co => co.id === c.courseId);

                        return (
                          <Tooltip key={c.id}>
                            <TooltipTrigger asChild>
                              <div
                                data-event
                                draggable={canManage}
                                onDragStart={(e) => handleDragStart(e, c)}
                                onClick={(e) => { e.stopPropagation(); onClassClick?.(c); }}
                                className={cn(
                                  "absolute rounded-md border-l-[3px] px-2 py-1 cursor-pointer overflow-hidden transition-all",
                                  "hover:shadow-lg hover:z-20 hover:scale-[1.02]",
                                  canManage && "cursor-grab active:cursor-grabbing",
                                  color.bg, color.border, color.text,
                                  c.rescheduleStatus === 'requested' && 'ring-2 ring-amber-400 ring-offset-1'
                                )}
                                style={{ 
                                  top: pos.top, 
                                  height: pos.height, 
                                  width: `calc(${widthPct}% - 4px)`,
                                  left: `calc(${leftPct}% + 2px)`,
                                  zIndex: 10 + idx 
                                }}
                              >
                                <p className="text-[11px] font-semibold truncate leading-tight">{c.title}</p>
                                {pos.height > 40 && (
                                  <p className="text-[10px] opacity-75 truncate flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {formatTimeInTz(c.start, timezone, hour12)} – {formatTimeInTz(c.end, timezone, hour12)}
                                  </p>
                                )}
                                {pos.height > 56 && course && (
                                  <p className="text-[10px] opacity-60 truncate">{course.title}</p>
                                )}
                                {pos.height > 56 && c.recurrenceGroupId && (
                                  <Repeat className="h-2.5 w-2.5 opacity-40 mt-0.5" />
                                )}
                                {c.rescheduleStatus === 'requested' && (
                                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">⏳ Reschedule</span>
                                )}

                                {/* Resize handle */}
                                {canManage && (
                                  <div
                                    className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize hover:bg-black/10 dark:hover:bg-white/10 rounded-b-md"
                                    onMouseDown={(e) => handleResizeStart(e, c)}
                                  />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-[200px]">
                              <p className="font-semibold text-sm">{c.title}</p>
                              {course && <p className="text-xs text-muted-foreground">{course.title}</p>}
                              <p className="text-xs mt-1">
                                {formatTimeInTz(c.start, timezone, hour12)} – {formatTimeInTz(c.end, timezone, hour12)}
                              </p>
                              {c.meetLink && <p className="text-xs text-primary mt-1 flex items-center gap-1"><Video className="h-3 w-3" /> Video Meeting</p>}
                              {c.recurrenceGroupId && <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Repeat className="h-3 w-3" /> Recurring</p>}
                            </TooltipContent>
                          </Tooltip>
                        );
                      });
                    });
                  })()}
                </TooltipProvider>

                {/* ── Current time indicator ── */}
                {isToday(day) && currentTimePosition > 0 && currentTimePosition < TOTAL_HEIGHT && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none"
                    style={{ top: currentTimePosition }}
                  >
                    <div className="relative">
                      <div className="absolute -left-[5px] -top-[5px] w-[10px] h-[10px] rounded-full bg-red-500" />
                      <div className="h-[2px] bg-red-500 w-full" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading schedule...
          </div>
        </div>
      )}
    </div>
  );
}