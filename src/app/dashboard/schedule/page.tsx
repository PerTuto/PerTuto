"use client";

import { WeeklyCalendar } from "@/components/schedule/weekly-calendar";
import { ClassDialog } from "@/components/schedule/class-dialog";
import { useState, useMemo } from "react";
import { type Class, ClassStatus } from "@/lib/types";
import { AIQuickAdd } from "@/components/schedule/ai-quick-add";
import { parse, addHours, format, startOfWeek, addDays } from "date-fns";

export default function SchedulePage() {
    const [selectedClass, setSelectedClass] = useState<Class | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [calendarKey, setCalendarKey] = useState(0);

    const handleClassClick = (classItem: Class) => {
        setSelectedClass(classItem);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedClass(undefined);
        setIsDialogOpen(true);
    };

    const handleSaved = () => {
        setIsDialogOpen(false);
        setCalendarKey(prev => prev + 1);
    };

    const handleAIResult = (result: any) => {
        // Map "Monday", "Tuesday" etc to the date in current week
        const daysRequested = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIdx = daysRequested.indexOf(result.dayOfWeek);

        let targetDate = new Date();
        if (dayIdx !== -1) {
            const start = startOfWeek(new Date(), { weekStartsOn: 0 });
            targetDate = addDays(start, dayIdx);
        }

        // Parse Time: "2:00 PM"
        let startTime = new Date(targetDate);
        try {
            const parsedToken = parse(result.time, 'h:mm a', new Date());
            startTime.setHours(parsedToken.getHours(), parsedToken.getMinutes(), 0, 0);
        } catch (e) {
            startTime.setHours(14, 0, 0, 0); // Default to 2 PM
        }

        const endTime = addHours(startTime, 1);

        const pseudoClass: Partial<Class> = {
            title: result.className,
            start: startTime,
            end: endTime,
            status: ClassStatus.Scheduled,
            students: [],
            // courseId will be handled by the dialog if we can find a match or leave empty
        };

        setSelectedClass(pseudoClass as Class); // Cast since we handle missing fields in Dialog
        setIsDialogOpen(true);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Schedule</h1>
                    <p className="text-muted-foreground text-sm">Manage class sessions and AI planning.</p>
                </div>

                <div className="flex items-center gap-3">
                    <AIQuickAdd onResult={handleAIResult} />
                    <ClassDialog
                        onSaved={handleSaved}
                    />
                </div>

                <ClassDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    classToEdit={selectedClass}
                    onSaved={handleSaved}
                    trigger={<div className="hidden" />}
                />
            </div>
            <WeeklyCalendar key={calendarKey} onClassClick={handleClassClick} />
        </div>
    );
}
