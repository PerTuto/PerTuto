"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import { addCourse, updateCourse } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@/lib/types";

interface CourseDialogProps {
    courseToEdit?: Course;
    onCourseSaved?: (course: Course) => void;
    trigger?: React.ReactNode;
}

export function CourseDialog({ courseToEdit, onCourseSaved, trigger }: CourseDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userProfile } = useAuth();
    const { toast } = useToast();

    const isEditing = !!courseToEdit;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        image: "",
        status: "active" as "active" | "archived" | "draft",
    });

    useEffect(() => {
        if (open) {
            if (courseToEdit) {
                setFormData({
                    title: courseToEdit.title,
                    description: courseToEdit.description,
                    instructor: courseToEdit.instructor,
                    duration: courseToEdit.duration,
                    image: courseToEdit.image,
                    status: courseToEdit.status,
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    instructor: "",
                    duration: "",
                    image: "",
                    status: "active",
                });
            }
        }
    }, [open, courseToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile?.tenantId) {
            toast({
                title: "Error",
                description: "No tenant found. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            if (isEditing && courseToEdit) {
                await updateCourse(userProfile.tenantId, courseToEdit.id, formData);
                toast({
                    title: "Success",
                    description: `Course "${formData.title}" updated successfully!`,
                });
                onCourseSaved?.({
                    ...courseToEdit,
                    ...formData,
                });
            } else {
                const newCourse = await addCourse(userProfile.tenantId, {
                    ...formData,
                    image: formData.image || '',
                });
                toast({
                    title: "Success",
                    description: `Course "${formData.title}" created successfully!`,
                });
                onCourseSaved?.(newCourse);
            }

            setOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save course",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Course
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Course" : "Add New Course"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the course details below."
                            : "Create a new course for your students."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Course Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="e.g., Piano Basics"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="What will students learn?"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="instructor">Instructor</Label>
                                <Input
                                    id="instructor"
                                    value={formData.instructor}
                                    onChange={(e) =>
                                        setFormData({ ...formData, instructor: e.target.value })
                                    }
                                    placeholder="e.g., Mr. Smith"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) =>
                                        setFormData({ ...formData, duration: e.target.value })
                                    }
                                    placeholder="e.g., 8 Weeks"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: "active" | "archived" | "draft") =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image URL (optional)</Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) =>
                                    setFormData({ ...formData, image: e.target.value })
                                }
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.title}>
                            {isLoading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
