"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Sparkles, Calendar, Mic } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addClass, addRecurringClassSeries, getCourses, updateClass, deleteClass, getAvailability, getClasses } from "@/lib/firebase/services";
import { Course, Class, AvailabilitySlot } from "@/lib/types";
import { smartScheduleAssistant } from "@/ai/flows/smart-schedule-assistant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { syncClassToGoogleAction, deleteGoogleCalendarEvent } from "@/app/actions/google-calendar";
import { RecurringEditPrompt, type RecurringEditChoice } from "@/components/schedule/recurring-edit-prompt";
import { updateFutureClassesInSeries, updateSingleClassDetached } from "@/lib/firebase/services";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    courseId: z.string().min(1, "Please select a course."),
    date: z.string().min(1, "Date is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    meetLink: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
    isRecurring: z.boolean().default(false),
    recurrenceEndDate: z.string().optional(),
}).refine((data) => {
    if (data.isRecurring && !data.recurrenceEndDate) {
        return false;
    }
    return true;
}, {
    message: "End date is required for recurring classes",
    path: ["recurrenceEndDate"],
});

interface ClassDialogProps {
    classToEdit?: Class;
    onSaved?: () => void;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    timezone?: string;
}

export function ClassDialog({ classToEdit, onSaved, trigger, open: controlledOpen, onOpenChange, timezone }: ClassDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const { user, userProfile } = useAuth();
    const { toast } = useToast();
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [aiResult, setAiResult] = useState<{
        schedule: string;
        conflicts: string;
        suggestedDate?: string;
        suggestedStartTime?: string;
        suggestedEndTime?: string;
    } | null>(null);
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

    const [recurringPromptOpen, setRecurringPromptOpen] = useState(false);
    const [pendingEdit, setPendingEdit] = useState<{ classData: any } | null>(null);

    // Initial values logic
    const defaultDate = classToEdit ? new Date(classToEdit.start).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    const defaultStart = classToEdit ? new Date(classToEdit.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00";
    const defaultEnd = classToEdit ? new Date(classToEdit.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "10:00";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: classToEdit?.title || "",
            courseId: classToEdit?.courseId || "",
            date: defaultDate,
            startTime: defaultStart,
            endTime: defaultEnd,
            meetLink: classToEdit?.meetLink || "",
            isRecurring: false,
            recurrenceEndDate: "",
        },
    });

    // Reset form when classToEdit changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            const dDate = classToEdit ? new Date(classToEdit.start).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
            const dStart = classToEdit ? new Date(classToEdit.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00";
            const dEnd = classToEdit ? new Date(classToEdit.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "10:00";

            form.reset({
                title: classToEdit?.title || "",
                courseId: classToEdit?.courseId || "",
                date: dDate,
                startTime: dStart,
                endTime: dEnd,
                meetLink: classToEdit?.meetLink || "",
                isRecurring: false,
                recurrenceEndDate: "",
            });
        }
    }, [isOpen, classToEdit, form]);


    const isRecurring = form.watch("isRecurring");
    const isEditing = !!classToEdit?.id;

    useEffect(() => {
        const fetchCourses = async () => {
            if (userProfile?.tenantId && isOpen) {
                setLoadingCourses(true);
                try {
                    const data = await getCourses(userProfile.tenantId);
                    setAvailableCourses(data);
                } catch (error) {
                    console.error("Failed to fetch courses", error);
                } finally {
                    setLoadingCourses(false);
                }
            }
        };
        fetchCourses();
    }, [userProfile?.tenantId, isOpen]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !userProfile?.tenantId) return;

        try {
            // Combine date and time to Date objects
            const start = new Date(`${values.date}T${values.startTime}`);
            const end = new Date(`${values.date}T${values.endTime}`);

            if (end <= start) {
                form.setError("endTime", { message: "End time must be after start time" });
                return;
            }

            const selectedCourse = availableCourses.find(c => c.id === values.courseId);
            const classTitle = values.title || selectedCourse?.title || "Class Session";

            const classData = {
                ownerId: user.uid,
                title: classTitle,
                courseId: values.courseId,
                start,
                end,
                meetLink: values.meetLink,
                students: selectedCourse?.studentIds || [],
                status: 'scheduled'
            };

            if (isEditing && classToEdit) {
                if (classToEdit.recurrenceGroupId) {
                    setPendingEdit({ classData });
                    setRecurringPromptOpen(true);
                    return; // Pause submission and wait for recurring choice
                }

                await updateClass(userProfile.tenantId, classToEdit.id, classData);
                // Trigger Sync
                syncClassToGoogleAction(userProfile.tenantId, user.uid, classToEdit.id, false);

                toast({
                    title: "Class Updated",
                    description: `${classTitle} has been updated.`,
                });
            } else {
                if (values.isRecurring && values.recurrenceEndDate) {
                    await addRecurringClassSeries(userProfile.tenantId, classData, {
                        frequency: 'weekly',
                        endDate: new Date(values.recurrenceEndDate)
                    });
                    toast({
                        title: "Recurring Classes Scheduled",
                        description: `${classTitle} series has been added to your calendar.`,
                    });
                } else {
                    const newClass = await addClass(userProfile.tenantId, classData);
                    // Trigger Sync
                    syncClassToGoogleAction(userProfile.tenantId, user.uid, newClass.id, false);

                    toast({
                        title: "Class Scheduled",
                        description: `${classTitle} has been added to your calendar.`,
                    });
                }
            }

            setOpen(false);
            if (onSaved) onSaved();
            // Optional: window.location.reload() or force refresh parent

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save class.",
                variant: "destructive",
            });
        }
    }

    const handleRecurringChoice = async (choice: RecurringEditChoice) => {
        setRecurringPromptOpen(false);
        if (!pendingEdit || !userProfile?.tenantId || !classToEdit || !user) return;

        try {
            if (choice === 'this') {
                await updateSingleClassDetached(userProfile.tenantId, classToEdit.id, pendingEdit.classData);
                syncClassToGoogleAction(userProfile.tenantId, user.uid, classToEdit.id, false);
                toast({ title: "Event Updated", description: "Only this event was changed." });
            } else if (choice === 'future') {
                const newStart = pendingEdit.classData.start as Date;
                const newEnd = pendingEdit.classData.end as Date;
                const durationMins = (newEnd.getTime() - newStart.getTime()) / 60000;
                
                const startHour = newStart.getHours();
                const startMinute = newStart.getMinutes();

                const { start, end, ...otherUpdates } = pendingEdit.classData;

                await updateFutureClassesInSeries(
                    userProfile.tenantId,
                    classToEdit.recurrenceGroupId!,
                    classToEdit.start,
                    { startHour, startMinute, durationMins, timezone },
                    otherUpdates
                );
                
                syncClassToGoogleAction(userProfile.tenantId, user.uid, classToEdit.id, false);
                toast({ title: "Series Updated", description: "This and all future events were updated." });
            }
            
            setPendingEdit(null);
            setOpen(false);
            if (onSaved) onSaved();
            
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update.", variant: "destructive" });
        }
    };

    const handleDelete = async () => {
        if (!user || !userProfile?.tenantId || !classToEdit) return;
        try {
            await deleteClass(userProfile.tenantId, classToEdit.id);

            // Sync Delete
            if (classToEdit.googleEventId) {
                deleteGoogleCalendarEvent(user.uid, classToEdit.googleEventId);
            }

            toast({
                title: "Class Deleted",
                description: "The class session has been removed.",
            });
            setOpen(false);
            if (onSaved) onSaved();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete class.",
                variant: "destructive",
            });
        }
    }

    const handleCheckConflicts = async () => {
        if (!userProfile?.tenantId || !user?.uid) return;

        const values = form.getValues();
        setIsCheckingConflicts(true);
        setAiResult(null);

        try {
            // 1. Fetch data for context
            const [availability, existingClasses] = await Promise.all([
                getAvailability(userProfile.tenantId, user.uid),
                getClasses(userProfile.tenantId)
            ]);

            const instructorAvailability = availability.map((s: AvailabilitySlot) =>
                `Day ${s.dayOfWeek}: ${s.startTime} - ${s.endTime}`
            ).join(", ");

            const existingSchedule = existingClasses.map((c: Class) =>
                `${c.title} on ${new Date(c.start).toLocaleDateString()} ${new Date(c.start).toLocaleTimeString()} to ${new Date(c.end).toLocaleTimeString()}`
            ).join("; ");

            const result = await smartScheduleAssistant({
                instructorAvailability: instructorAvailability || "Not defined",
                classroomResources: "Standard virtual/physical classroom",
                studentPreferences: `Proposed Slot: ${values.date} from ${values.startTime} to ${values.endTime}. Existing classes: ${existingSchedule}`,
                classDuration: `${(new Date(`2000-01-01T${values.endTime}`).getTime() - new Date(`2000-01-01T${values.startTime}`).getTime()) / 60000} minutes`,
                className: values.title || "New Class"
            });

            setAiResult({
                schedule: result.suggestedSchedule,
                conflicts: result.conflictsDetected,
                suggestedDate: result.suggestedDate,
                suggestedStartTime: result.suggestedStartTime,
                suggestedEndTime: result.suggestedEndTime
            });

        } catch (error) {
            console.error("Conflict check failed", error);
            toast({
                title: "AI Check Failed",
                description: "Could not validate schedule conflicts.",
                variant: "destructive"
            });
        } finally {
            setIsCheckingConflicts(false);
        }
    };

    const applyAiSuggestion = () => {
        if (!aiResult) return;
        if (aiResult.suggestedDate) form.setValue("date", aiResult.suggestedDate);
        if (aiResult.suggestedStartTime) form.setValue("startTime", aiResult.suggestedStartTime);
        if (aiResult.suggestedEndTime) form.setValue("endTime", aiResult.suggestedEndTime);

        toast({
            title: "Suggestion Applied",
            description: "The form has been updated with the AI suggestion.",
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add Class
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Class" : "Add Class"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update class details." : "Schedule a new class session."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Algebra 101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="courseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingCourses ? "Loading..." : "Select a course"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableCourses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date (Start Date)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {!isEditing && (
                            <FormField
                                control={form.control}
                                name="isRecurring"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Repeat Weekly
                                            </FormLabel>
                                            <DialogDescription>
                                                Schedule this class every week on this day.
                                            </DialogDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

                        {isRecurring && !isEditing && (
                            <FormField
                                control={form.control}
                                name="recurrenceEndDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date (Last Class)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="meetLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Link (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://meet.google.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-0">
                            {isEditing && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" type="button" className="me-auto">
                                            <Trash2 className="h-4 w-4 me-2" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Class?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete this session.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCheckConflicts}
                                disabled={isCheckingConflicts}
                                className="me-2"
                            >
                                {isCheckingConflicts ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 me-2 text-primary" />}
                                Smart Check
                            </Button>

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update Class" : "Schedule Class"}
                            </Button>
                        </DialogFooter>

                        {aiResult && (
                            <div className="mt-4 space-y-2">
                                <Alert variant={aiResult.conflicts.toLowerCase().includes("no conflicts") ? "default" : "destructive"}>
                                    <AlertTitle className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            AI Insights
                                        </div>
                                        {aiResult.suggestedStartTime && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 text-[10px] px-2"
                                                onClick={applyAiSuggestion}
                                            >
                                                Auto-Resolve
                                            </Button>
                                        )}
                                    </AlertTitle>
                                    <AlertDescription className="text-xs space-y-1">
                                        <p><strong>Suggestion:</strong> {aiResult.schedule}</p>
                                        <p><strong>Conflicts:</strong> {aiResult.conflicts}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <RecurringEditPrompt
            open={recurringPromptOpen}
            onChoice={handleRecurringChoice}
            eventTitle={pendingEdit?.classData.title}
        />
        </>
    );
}
