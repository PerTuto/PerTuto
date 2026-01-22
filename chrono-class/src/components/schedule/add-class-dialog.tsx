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
import { Loader2, Plus } from "lucide-react";
// Removed mock import
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addClass, addRecurringClassSeries, getCourses } from "@/lib/firebase/services";
import { Course } from "@/lib/types";

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

export function AddClassDialog({ onClassAdded }: { onClassAdded?: () => void }) {
    const [open, setOpen] = useState(false);
    const { user, userProfile } = useAuth();
    const { toast } = useToast();
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            courseId: "",
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "10:00",
            meetLink: "",
            isRecurring: false,
            recurrenceEndDate: "",
        },
    });

    const isRecurring = form.watch("isRecurring");

    useEffect(() => {
        const fetchCourses = async () => {
            if (userProfile?.tenantId && open) {
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
    }, [userProfile?.tenantId, open]);

    // ... form setup ...

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !userProfile?.tenantId) return;

        try {
            // Combine date and time to Date objects
            const start = new Date(`${values.date}T${values.startTime}`);
            const end = new Date(`${values.date}T${values.endTime}`);

            // Basic validation
            if (end <= start) {
                form.setError("endTime", { message: "End time must be after start time" });
                return;
            }

            // Find selected course title for better UX (optional) or just use ID
            const selectedCourse = availableCourses.find(c => c.id === values.courseId);
            const classTitle = values.title || selectedCourse?.title || "Class Session";

            const baseClassData = {
                ownerId: user.uid,
                title: classTitle,
                courseId: values.courseId,
                start,
                end,
                meetLink: values.meetLink,
                students: selectedCourse?.studentIds || [],
                status: 'scheduled'
            };

            if (values.isRecurring && values.recurrenceEndDate) {
                await addRecurringClassSeries(userProfile.tenantId, baseClassData, {
                    frequency: 'weekly',
                    endDate: new Date(values.recurrenceEndDate)
                });

                toast({
                    title: "Recurring Classes Scheduled",
                    description: `${classTitle} series has been added to your calendar.`,
                });
            } else {
                await addClass(userProfile.tenantId, baseClassData);

                toast({
                    title: "Class Scheduled",
                    description: `${classTitle} has been added to your calendar.`,
                });
            }

            setOpen(false);
            form.reset();
            if (onClassAdded) onClassAdded();

            // Force reload to see changes if parent doesn't handle it strictly (quick fix)
            window.location.reload();

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to schedule class.",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Class
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Class</DialogTitle>
                    <DialogDescription>
                        Schedule a new class session.
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        {/* ... rest of date fields ... */}

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

                        {isRecurring && (
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

                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Schedule Class
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
