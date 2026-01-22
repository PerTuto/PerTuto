"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getAvailability, setAvailability } from "@/lib/firebase/services";
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
import type { AvailabilitySlot } from "@/lib/types";

export default function AvailabilityGrid() {
    const { user, userProfile } = useAuth();
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
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
            loadAvailability();
        }
    }, [user, userProfile]);

    async function loadAvailability() {
        if (!user || !userProfile?.tenantId) return;
        setLoading(true);
        try {
            const data = await getAvailability(userProfile.tenantId, user.uid);
            setSlots(data);
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to load availability", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSlot() {
        if (!user || !userProfile?.tenantId) return;

        // Basic validation
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
            // Optimistic update
            setSlots(newSlots);
            await setAvailability(userProfile.tenantId, user.uid, newSlots);
            toast({ title: "Saved", description: "Availability updated successfully." });
        } catch (e: any) {
            toast({ title: "Error", description: "Failed to save availability", variant: "destructive" });
            loadAvailability(); // Revert
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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Weekly Availability</CardTitle>
                    <p className="text-sm text-muted-foreground">Set your typical working hours.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Slot</Button>
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
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                    {i.toString().padStart(2, '0')}:00
                                                </SelectItem>
                                            ))}
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
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                    {i.toString().padStart(2, '0')}:00
                                                </SelectItem>
                                            ))}
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

                        return (
                            <div key={day.id} className="grid grid-cols-[100px_1fr] border-b pb-4 last:border-0">
                                <div className="font-medium pt-2">{day.name}</div>
                                <div className="space-y-2">
                                    {daySlots.length === 0 ? (
                                        <div className="text-sm text-muted-foreground pt-2 italic">Unavailable</div>
                                    ) : (
                                        daySlots.map((slot, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md w-fit">
                                                <span className="text-sm font-medium">{slot.startTime} - {slot.endTime}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 ml-2 text-muted-foreground hover:text-destructive"
                                                    onClick={() => {
                                                        const globalIndex = slots.indexOf(slot);
                                                        handleRemoveSlot(globalIndex);
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
