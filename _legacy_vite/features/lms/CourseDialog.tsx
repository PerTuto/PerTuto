import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClayModal } from "../../components/ClayModal";
import { ClayButton } from "../../components/ClayButton";
import { ClayInput } from "../../components/ClayInput";
import { addCourse, updateCourse, type Course } from "../../services/schedulingService";

interface CourseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    courseToEdit?: Course | null;
    onCourseSaved: () => void;
}

interface FormData {
    title: string;
    description: string;
    instructor: string;
    duration: string;
    image: string;
    status: "active" | "archived" | "draft";
}

export function CourseDialog({ isOpen, onClose, courseToEdit, onCourseSaved }: CourseDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            title: "",
            description: "",
            instructor: "",
            duration: "",
            image: "",
            status: "active"
        }
    });

    useEffect(() => {
        if (courseToEdit) {
            setValue("title", courseToEdit.title);
            setValue("description", courseToEdit.description || "");
            setValue("instructor", courseToEdit.instructor);
            setValue("duration", courseToEdit.duration || "");
            setValue("image", courseToEdit.image || "");
            setValue("status", courseToEdit.status);
        } else {
            reset({
                title: "",
                description: "",
                instructor: "",
                duration: "",
                image: "",
                status: "active"
            });
        }
    }, [courseToEdit, setValue, reset, isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            if (courseToEdit) {
                await updateCourse(courseToEdit.id, data);
            } else {
                await addCourse(data);
            }
            onCourseSaved();
            onClose();
        } catch (error) {
            console.error("Failed to save course:", error);
        }
    };

    return (
        <ClayModal
            isOpen={isOpen}
            onClose={onClose}
            title={courseToEdit ? "Edit Course" : "Add New Course"}
            description={courseToEdit ? "Update course details." : "Create a new course for your students."}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <ClayInput
                    label="Course Title *"
                    placeholder="e.g., IGCSE Math"
                    {...register("title", { required: "Title is required" })}
                    error={errors.title}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Description</label>
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-nome h-24"
                        placeholder="What will students learn?"
                        {...register("description")}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ClayInput
                        label="Instructor"
                        placeholder="e.g., Mr. Smith"
                        {...register("instructor", { required: "Instructor is required" })}
                        error={errors.instructor}
                    />
                    <ClayInput
                        label="Duration"
                        placeholder="e.g., 8 Weeks"
                        {...register("duration")}
                    />
                </div>

                <ClayInput
                    label="Image URL"
                    placeholder="https://..."
                    {...register("image")}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        {...register("status")}
                    >
                        <option value="active" className="text-black">Active</option>
                        <option value="draft" className="text-black">Draft</option>
                        <option value="archived" className="text-black">Archived</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <ClayButton
                        type="button"
                        variant="secondary"
                        className="flex-1" // Use secondary if available or just custom class
                        onClick={onClose}
                    >
                        Cancel
                    </ClayButton>
                    <ClayButton
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        isLoading={isSubmitting}
                    >
                        {courseToEdit ? "Update Course" : "Create Course"}
                    </ClayButton>
                </div>
            </form>
        </ClayModal>
    );
}
