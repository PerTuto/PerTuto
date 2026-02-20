import { useState, useEffect } from "react";
import { ClayModal } from "../../components/ClayModal";
import { ClayButton } from "../../components/ClayButton";
import { getStudents, updateCourse, type Course, type Student } from "../../services/schedulingService";
import { Loader2, Check, User } from "lucide-react";
import { clsx } from "clsx";

interface ManageEnrollmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    onEnrollmentSaved: () => void;
}

export function ManageEnrollmentDialog({ isOpen, onClose, course, onEnrollmentSaved }: ManageEnrollmentDialogProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadStudents();
            setSelectedStudentIds(course.studentIds || []);
        }
    }, [isOpen, course]);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStudent = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCourse(course.id, { studentIds: selectedStudentIds });
            onEnrollmentSaved();
            onClose();
        } catch (error) {
            console.error("Failed to save enrollment", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ClayModal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Enrollment"
            description={`Assign students to ${course.title}`}
        >
            <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-white/50" />
                        </div>
                    ) : students.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No students found. Add students first.</p>
                    ) : (
                        students.map((student) => {
                            const isSelected = selectedStudentIds.includes(student.id);
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStudent(student.id)}
                                    className={clsx(
                                        "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200",
                                        isSelected
                                            ? "bg-purple-500/20 border-purple-500/50"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                            isSelected ? "bg-purple-500 text-white" : "bg-white/10 text-gray-400"
                                        )}>
                                            {student.avatar ? (
                                                <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={14} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={clsx("font-medium", isSelected ? "text-purple-200" : "text-gray-200")}>
                                                {student.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                    {isSelected && <Check size={18} className="text-purple-400" />}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-6 flex gap-3 pt-4 border-t border-white/10">
                    <ClayButton
                        variant="secondary"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </ClayButton>
                    <ClayButton
                        variant="primary"
                        className="flex-1"
                        isLoading={isSaving}
                        onClick={handleSave}
                    >
                        Save Changes
                    </ClayButton>
                </div>
            </div>
        </ClayModal>
    );
}
