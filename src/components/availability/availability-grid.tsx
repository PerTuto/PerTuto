"use client";

import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, endOfWeek } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Clock, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { getAvailability, setAvailability, getClassesForTeacher } from "@/lib/firebase/services";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AvailabilitySlot, Class } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Helpers ──
function timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(m: number): string {
    return `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
}

function formatDisplayTime(time: string, hour12: boolean): string {
    const [h, m] = time.split(':').map(Number);
    if (!hour12) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function AvailabilityGrid() {
    const { user, userProfile } = useAuth();
    const { timeFormat } = useSettings();
    const hour12 = timeFormat === '12h';
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newSlot, setNewSlot] = useState({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
    });
    const { toast } = useToast();

    useEffect(() => {
        if (user && userProfile?.tenantId) {
            loadData();
        }
    }, [user, userProfile]);

    async function loadData() {
        if (!user || !userProfile?.tenantId) return;
        setLoading(true);
        try {
            const [availData, classData] = await Promise.all([
                getAvailability(userProfile.tenantId, user.uid),
                getClassesForTeacher(userProfile.tenantId, user.uid)
            ]);
            setSlots(availData);
            setTeacherClasses(classData);
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to load availability", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    // Group classes by day of week for the current week
    const classesByDay = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

        const grouped: Record<number, Class[]> = {};
        teacherClasses
            .filter(c => c.start >= weekStart && c.start <= weekEnd && c.status !== 'cancelled')
            .forEach(c => {
                const day = c.start.getDay();
                if (!grouped[day]) grouped[day] = [];
                grouped[day].push(c);
            });

        // Sort each day by start time
        Object.values(grouped).forEach(arr => arr.sort((a, b) => a.start.getTime() - b.start.getTime()));
        return grouped;
    }, [teacherClasses]);

    async function handleAddSlot() {
        if (!user || !userProfile?.tenantId) return;

        if (newSlot.startTime >= newSlot.endTime) {
            toast({ title: "Invalid Time", description: "End time must be after start time", variant: "destructive" });
            return;
        }

        const newSlots = [...slots, {
            ...newSlot,
            status: 'available' as const
        }];

        await saveSlots(newSlots);
        setDialogOpen(false);
    }

    async function handleRemoveSlot(index: number) {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        await saveSlots(newSlots);
    }

    async function saveSlots(newSlots: any[]) {
        if (!user || !userProfile?.tenantId) return;
        setSaving(true);
        try {
            setSlots(newSlots);
            await setAvailability(userProfile.tenantId, user.uid, newSlots);
            toast({ title: "Saved", description: "Availability updated successfully." });
        } catch (e: any) {
            toast({ title: "Error", description: "Failed to save availability", variant: "destructive" });
            loadData();
        } finally {
            setSaving(false);
        }
    }

    const days = [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
        { id: 0, name: "Sunday" },
    ];

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    // Compute stats
    const totalAvailableMinutes = slots.reduce((acc, s) => acc + (timeToMinutes(s.endTime) - timeToMinutes(s.startTime)), 0);
    const totalBookedMinutes = Object.values(classesByDay).flat().reduce((acc, c) => acc + (c.end.getTime() - c.start.getTime()) / 60000, 0);
    const utilizationPct = totalAvailableMinutes > 0 ? Math.round((totalBookedMinutes / totalAvailableMinutes) * 100) : 0;

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Available Hours</div>
                    <div className="text-2xl font-bold">{(totalAvailableMinutes / 60).toFixed(1)}h</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Booked This Week</div>
                    <div className="text-2xl font-bold">{(totalBookedMinutes / 60).toFixed(1)}h</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Utilization</div>
                    <div className={cn(
                        "text-2xl font-bold",
                        utilizationPct > 80 ? "text-red-600" : utilizationPct > 50 ? "text-amber-600" : "text-green-600"
                    )}>{utilizationPct}%</div>
                </Card>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> Booked Class</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted border border-border"></span> Unavailable</span>
            </div>

            {/* Main Grid */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Weekly Availability</CardTitle>
                        <p className="text-sm text-muted-foreground">Set your typical working hours. Booked classes are shown automatically.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm"><Plus className="me-2 h-4 w-4" /> Add Slot</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Availability Slot</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label>Day</label>
                                    <Select
                                        value={newSlot.dayOfWeek.toString()}
                                        onValueChange={(v) => setNewSlot(p => ({ ...p, dayOfWeek: parseInt(v) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label>Start Time</label>
                                        <Select
                                            value={newSlot.startTime}
                                            onValueChange={(v) => setNewSlot(p => ({ ...p, startTime: v }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }).map((_, i) => {
                                                    const val = minutesToTime(i * 30);
                                                    return (
                                                        <SelectItem key={i} value={val}>
                                                            {formatDisplayTime(val, hour12)}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label>End Time</label>
                                        <Select
                                            value={newSlot.endTime}
                                            onValueChange={(v) => setNewSlot(p => ({ ...p, endTime: v }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }).map((_, i) => {
                                                    const val = minutesToTime(i * 30);
                                                    return (
                                                        <SelectItem key={i} value={val}>
                                                            {formatDisplayTime(val, hour12)}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSlot} disabled={saving}>Add Slot</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {days.map(day => {
                            const daySlots = slots.filter(s => s.dayOfWeek === day.id)
                                .sort((a, b) => a.startTime.localeCompare(b.startTime));
                            const dayClasses = classesByDay[day.id] || [];

                            return (
                                <div key={day.id} className="grid grid-cols-[100px_1fr] border-b pb-4 last:border-0">
                                    <div className="font-medium pt-2">{day.name}</div>
                                    <div className="space-y-2">
                                        {daySlots.length === 0 ? (
                                            <div className="text-sm text-muted-foreground pt-2 italic">Unavailable</div>
                                        ) : (
                                            daySlots.map((slot, idx) => {
                                                // Find classes that overlap with this slot
                                                const slotStart = timeToMinutes(slot.startTime);
                                                const slotEnd = timeToMinutes(slot.endTime);
                                                const overlapping = dayClasses.filter(c => {
                                                    const cStart = c.start.getHours() * 60 + c.start.getMinutes();
                                                    const cEnd = c.end.getHours() * 60 + c.end.getMinutes();
                                                    return cStart < slotEnd && cEnd > slotStart;
                                                });

                                                // Calculate free time in this slot
                                                let bookedMins = 0;
                                                overlapping.forEach(c => {
                                                    const cStart = Math.max(c.start.getHours() * 60 + c.start.getMinutes(), slotStart);
                                                    const cEnd = Math.min(c.end.getHours() * 60 + c.end.getMinutes(), slotEnd);
                                                    bookedMins += (cEnd - cStart);
                                                });
                                                const freeMins = (slotEnd - slotStart) - bookedMins;

                                                return (
                                                    <div key={idx} className="rounded-xl border bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800 p-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-3.5 w-3.5 text-green-600" />
                                                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                                    {formatDisplayTime(slot.startTime, hour12)} – {formatDisplayTime(slot.endTime, hour12)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {freeMins > 0 ? (
                                                                    <Badge variant="outline" className="text-[10px] bg-green-100 text-green-700 border-green-200">
                                                                        {Math.round(freeMins / 60 * 10) / 10}h free
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-[10px] bg-red-100 text-red-700 border-red-200">
                                                                        <AlertCircle className="h-2.5 w-2.5 me-1" /> Fully booked
                                                                    </Badge>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                                    onClick={() => {
                                                                        const globalIndex = slots.indexOf(slot);
                                                                        handleRemoveSlot(globalIndex);
                                                                    }}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Booked classes within this slot */}
                                                        {overlapping.length > 0 && (
                                                            <div className="space-y-1.5 ps-5">
                                                                {overlapping.map(c => (
                                                                    <div key={c.id} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-2.5 py-1.5">
                                                                        <BookOpen className="h-3 w-3 text-blue-600 shrink-0" />
                                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400 truncate">{c.title}</span>
                                                                        <span className="text-[10px] text-blue-500 ms-auto whitespace-nowrap">
                                                                            {formatDisplayTime(
                                                                                `${c.start.getHours().toString().padStart(2, '0')}:${c.start.getMinutes().toString().padStart(2, '0')}`,
                                                                                hour12
                                                                            )} – {formatDisplayTime(
                                                                                `${c.end.getHours().toString().padStart(2, '0')}:${c.end.getMinutes().toString().padStart(2, '0')}`,
                                                                                hour12
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}

                                        {/* Classes outside any availability slot (conflicts) */}
                                        {(() => {
                                            const outsideClasses = dayClasses.filter(c => {
                                                const cStart = c.start.getHours() * 60 + c.start.getMinutes();
                                                const cEnd = c.end.getHours() * 60 + c.end.getMinutes();
                                                return !daySlots.some(s => {
                                                    const sStart = timeToMinutes(s.startTime);
                                                    const sEnd = timeToMinutes(s.endTime);
                                                    return cStart >= sStart && cEnd <= sEnd;
                                                });
                                            });

                                            if (outsideClasses.length === 0) return null;

                                            return (
                                                <div className="mt-1 space-y-1">
                                                    {outsideClasses.map(c => (
                                                        <div key={c.id} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5">
                                                            <AlertCircle className="h-3 w-3 text-amber-600 shrink-0" />
                                                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 truncate">{c.title}</span>
                                                            <span className="text-[10px] text-amber-500 ms-auto whitespace-nowrap">
                                                                {formatDisplayTime(
                                                                    `${c.start.getHours().toString().padStart(2, '0')}:${c.start.getMinutes().toString().padStart(2, '0')}`,
                                                                    hour12
                                                                )} – {formatDisplayTime(
                                                                    `${c.end.getHours().toString().padStart(2, '0')}:${c.end.getMinutes().toString().padStart(2, '0')}`,
                                                                    hour12
                                                                )}
                                                            </span>
                                                            <Badge variant="outline" className="text-[9px] bg-amber-100 text-amber-700 border-amber-200 shrink-0">
                                                                Outside hours
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
