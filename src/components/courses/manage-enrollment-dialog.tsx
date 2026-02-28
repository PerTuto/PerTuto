"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users, Save } from "lucide-react";
import { getStudents, updateCourseEnrollment } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast"; // Correct path
import type { Course, Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ManageEnrollmentDialogProps {
    course: Course;
    onEnrollmentSaved: () => void;
    trigger?: React.ReactNode;
}

export function ManageEnrollmentDialog({ course, onEnrollmentSaved, trigger }: ManageEnrollmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { userProfile } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (open && userProfile?.tenantId) {
            loadStudents();
            // Initialize selection with currently enrolled students
            setSelectedStudentIds(course.studentIds || []);
        }
    }, [open, userProfile, course]);

    const loadStudents = async () => {
        if (!userProfile?.tenantId) return;
        try {
            const allStudents = await getStudents(userProfile.tenantId);
            setStudents(allStudents);
        } catch (error) {
            console.error("Failed to load students", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load student list.",
            });
        }
    };

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudentIds(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSave = async () => {
        if (!userProfile?.tenantId) return;
        setLoading(true);
        try {
            await updateCourseEnrollment(userProfile.tenantId, course.id, selectedStudentIds);
            toast({
                title: "Enrollment Updated",
                description: `Successfully updated enrollment for ${course.title}.`,
            });
            setOpen(false);
            onEnrollmentSaved();
        } catch (error) {
            console.error("Failed to update enrollment", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save enrollment changes.",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group stats
    const enrolledCount = selectedStudentIds.length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Users className="me-2 h-4 w-4" />
                        Manage Students
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] flex flex-col h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Manage Enrollment: {course.title}</DialogTitle>
                    <DialogDescription>
                        Select students to enroll in this course.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center space-x-2 py-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                </div>

                <div className="flex justify-between items-center pb-2 text-sm text-muted-foreground">
                    <span>{filteredStudents.length} Students found</span>
                    <span>{enrolledCount} Selected</span>
                </div>

                <ScrollArea className="flex-1 border rounded-md p-2">
                    <div className="space-y-2">
                        {filteredStudents.map(student => {
                            const isSelected = selectedStudentIds.includes(student.id);
                            return (
                                <div
                                    key={student.id}
                                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                                        }`}
                                    onClick={() => handleToggleStudent(student.id)}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => handleToggleStudent(student.id)}
                                        id={`student-${student.id}`}
                                    />
                                    <div className="flex-1 grid gap-1 cursor-pointer">
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-xs text-muted-foreground flex gap-2">
                                            <span>{student.email}</span>
                                            {student.curriculum && (
                                                <Badge variant="outline" className="text-[10px] h-4 px-1">{student.curriculum}</Badge>
                                            )}
                                            {student.grade && (
                                                <Badge variant="outline" className="text-[10px] h-4 px-1">{student.grade}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredStudents.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No students found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save className="me-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
