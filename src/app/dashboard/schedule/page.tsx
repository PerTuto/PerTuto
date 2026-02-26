"use client";

import { WeeklyCalendar } from "@/components/schedule/weekly-calendar";
import { ClassDialog } from "@/components/schedule/class-dialog";
import { RescheduleRequestDialog } from "@/components/schedule/reschedule-request-dialog";
import { RecurringEditPrompt, type RecurringEditChoice } from "@/components/schedule/recurring-edit-prompt";
import { useState, useEffect } from "react";
import { type Class, ClassStatus, type UserRole } from "@/lib/types";
import { AIQuickAdd } from "@/components/schedule/ai-quick-add";
import { ICalImport } from "@/components/schedule/ical-import";
import { parse, addHours, startOfWeek, addDays } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { updateClass, updateFutureClassesInSeries, updateSingleClassDetached } from "@/lib/firebase/services";
import { Timestamp } from "firebase/firestore";

export default function SchedulePage() {
    const { userProfile, user } = useAuth();
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = useState<Class | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [calendarKey, setCalendarKey] = useState(0);

    // Recurring edit prompt state
    const [recurringPromptOpen, setRecurringPromptOpen] = useState(false);
    const [pendingDrag, setPendingDrag] = useState<{ classItem: Class; newStart: Date; newEnd: Date; durationMins: number; newStartHour: number; newStartMinute: number; timezone: string } | null>(null);
    const [timezone, setTimezone] = useState('');

    // Load timezone from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('pertuto-calendar-tz');
        if (saved) setTimezone(saved);
    }, []);

    const handleTzChange = (tz: string) => {
        setTimezone(tz);
        localStorage.setItem('pertuto-calendar-tz', tz);
    };

    const canManage = userProfile ? (userProfile.role === 'super' || userProfile.role === 'admin' || userProfile.role === 'teacher' ||
                      (Array.isArray(userProfile.role) && (userProfile.role.includes('super' as UserRole) || userProfile.role.includes('admin' as UserRole) || userProfile.role.includes('teacher' as UserRole)))) : false;

    const isStudentOrParent = userProfile ? (userProfile.role === 'student' || userProfile.role === 'parent') : false;

    const handleClassClick = (classItem: Class) => {
        setSelectedClass(classItem);
        if (canManage) {
            setIsDialogOpen(true);
        }
    };

    const handleSlotClick = (date: Date) => {
        // Pre-fill a new class at the clicked time
        const endTime = addHours(date, 1);
        const pseudoClass: Partial<Class> = {
            title: '',
            start: date,
            end: endTime,
            status: ClassStatus.Scheduled,
            students: [],
        };
        setSelectedClass(pseudoClass as Class);
        setIsDialogOpen(true);
    };

    const handleClassDragged = async (classItem: Class, newStart: Date, newEnd: Date, durationMins: number, newStartHour: number, newStartMinute: number, timezone: string) => {
        // If it's a recurring event, show the prompt
        if (classItem.recurrenceGroupId) {
            setPendingDrag({ classItem, newStart, newEnd, durationMins, newStartHour, newStartMinute, timezone });
            setRecurringPromptOpen(true);
        } else {
            // Single (non-recurring) event: update directly
            if (!userProfile?.tenantId) return;
            try {
                await updateClass(userProfile.tenantId, classItem.id, {
                    start: Timestamp.fromDate(newStart),
                    end: Timestamp.fromDate(newEnd),
                });
                toast({ title: "Event Moved", description: `"${classItem.title}" rescheduled successfully.` });
                setCalendarKey(prev => prev + 1);
            } catch (error: any) {
                toast({ title: "Error", description: error.message || "Failed to reschedule.", variant: "destructive" });
            }
        }
    };

    const handleRecurringChoice = async (choice: RecurringEditChoice) => {
        setRecurringPromptOpen(false);
        if (!pendingDrag || !userProfile?.tenantId) return;

        const { classItem, newStart, newEnd, durationMins, newStartHour, newStartMinute } = pendingDrag;

        try {
            if (choice === 'this') {
                await updateSingleClassDetached(userProfile.tenantId, classItem.id, {
                    start: Timestamp.fromDate(newStart),
                    end: Timestamp.fromDate(newEnd),
                });
                toast({ title: "Event Updated", description: "Only this event was changed." });
            } else if (choice === 'future') {
                await updateFutureClassesInSeries(
                    userProfile.tenantId,
                    classItem.recurrenceGroupId!,
                    classItem.start,
                    { startHour: newStartHour, startMinute: newStartMinute, durationMins, timezone: pendingDrag.timezone }
                );
                toast({ title: "Series Updated", description: "This and all future events were shifted." });
            }
            setCalendarKey(prev => prev + 1); // Refresh calendar
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update.", variant: "destructive" });
        }

        setPendingDrag(null);
    };

    const handleSaved = () => {
        setIsDialogOpen(false);
        setCalendarKey(prev => prev + 1);
    };

    const handleRescheduleRequested = () => {
        setSelectedClass(undefined);
        setCalendarKey(prev => prev + 1);
    };

    const handleAIResult = (result: any) => {
        const daysRequested = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIdx = daysRequested.indexOf(result.dayOfWeek);

        let targetDate = new Date();
        if (dayIdx !== -1) {
            const start = startOfWeek(new Date(), { weekStartsOn: 0 });
            targetDate = addDays(start, dayIdx);
        }

        let startTime = new Date(targetDate);
        try {
            const parsedToken = parse(result.time, 'h:mm a', new Date());
            startTime.setHours(parsedToken.getHours(), parsedToken.getMinutes(), 0, 0);
        } catch (e) {
            startTime.setHours(14, 0, 0, 0);
        }

        const endTime = addHours(startTime, 1);
        const pseudoClass: Partial<Class> = {
            title: result.className,
            start: startTime,
            end: endTime,
            status: ClassStatus.Scheduled,
            students: [],
        };

        setSelectedClass(pseudoClass as Class);
        setIsDialogOpen(true);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Top Bar - minimal, Apple-like */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Schedule</h1>
                    <p className="text-muted-foreground text-sm">Click any time slot to create a class. Drag to reschedule.</p>
                </div>

                <div className="flex items-center gap-3">
                    {canManage && (
                        <>
                            <ICalImport onImportComplete={() => setCalendarKey(prev => prev + 1)} />
                            <AIQuickAdd onResult={handleAIResult} />
                            <ClassDialog onSaved={handleSaved} />
                        </>
                    )}
                </div>

                {/* Hidden dialog trigger for programmatic open */}
                {canManage && (
                    <ClassDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        classToEdit={selectedClass}
                        onSaved={handleSaved}
                        timezone={timezone}
                        trigger={<div className="hidden" />}
                    />
                )}
            </div>

            {/* The Calendar */}
            <WeeklyCalendar
                key={calendarKey}
                onClassClick={handleClassClick}
                onSlotClick={canManage ? handleSlotClick : undefined}
                onClassDragged={handleClassDragged}
                timezone={timezone}
                onTimezoneChange={handleTzChange}
            />

            {/* Recurring Edit Prompt */}
            <RecurringEditPrompt
                open={recurringPromptOpen}
                onChoice={handleRecurringChoice}
                eventTitle={pendingDrag?.classItem.title}
            />

            {/* Reschedule Section — students/parents */}
            {selectedClass && isStudentOrParent && userProfile?.tenantId && (
                <div className="max-w-md">
                    {selectedClass.rescheduleStatus === 'requested' ? (
                        <div className="p-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                ⏳ Reschedule request is pending for &quot;{selectedClass.title}&quot;.
                            </p>
                        </div>
                    ) : selectedClass.rescheduleStatus === 'approved' ? (
                        <div className="p-4 rounded-lg border border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                ✅ Reschedule approved for &quot;{selectedClass.title}&quot;!
                            </p>
                        </div>
                    ) : (
                        <RescheduleRequestDialog
                            classItem={selectedClass}
                            tenantId={userProfile.tenantId}
                            onRequested={handleRescheduleRequested}
                        />
                    )}
                </div>
            )}

            {/* Teacher reschedule approval */}
            {selectedClass && canManage && selectedClass.rescheduleStatus === 'requested' && userProfile?.tenantId && (
                <div className="max-w-md">
                    <RescheduleRequestDialog
                        classItem={selectedClass}
                        tenantId={userProfile.tenantId}
                        onRequested={handleRescheduleRequested}
                    />
                </div>
            )}
        </div>
    );
}
