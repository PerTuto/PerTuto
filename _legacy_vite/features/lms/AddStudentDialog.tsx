import { useForm } from "react-hook-form";
import { ClayModal } from "../../components/ClayModal";
import { ClayButton } from "../../components/ClayButton";
import { ClayInput } from "../../components/ClayInput";
import { addStudent } from "../../services/schedulingService";

interface AddStudentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onStudentAdded: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    curriculum: string;
    grade: string;
    timezone: string;
}

const majorTimezones = [
    { tzCode: 'America/New_York', label: '(GMT-04:00) Eastern Time (US & Canada)' },
    { tzCode: 'America/Chicago', label: '(GMT-05:00) Central Time (US & Canada)' },
    { tzCode: 'America/Los_Angeles', label: '(GMT-07:00) Pacific Time (US & Canada)' },
    { tzCode: 'Europe/London', label: '(GMT+01:00) London' },
    { tzCode: 'Europe/Paris', label: '(GMT+02:00) Paris' },
    { tzCode: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
    { tzCode: 'Asia/Kolkata', label: '(GMT+05:30) India' },
    { tzCode: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
];

export function AddStudentDialog({ isOpen, onClose, onStudentAdded }: AddStudentDialogProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            curriculum: "",
            grade: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            await addStudent({
                ...data,
                // Add a default random avatar or placeholder
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
            });
            onStudentAdded();
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to add student:", error);
        }
    };

    return (
        <ClayModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Student"
            description="Enter student details below."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <ClayInput
                    label="Full Name"
                    placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                    error={errors.name}
                />

                <ClayInput
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    error={errors.email}
                />

                <ClayInput
                    label="Phone Number"
                    placeholder="+971 50 123 4567"
                    {...register("phone")}
                />

                <div className="grid grid-cols-2 gap-4">
                    <ClayInput
                        label="Curriculum"
                        placeholder="e.g., IB, A-Level"
                        {...register("curriculum")}
                    />
                    <ClayInput
                        label="Grade"
                        placeholder="e.g., Year 11"
                        {...register("grade")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Timezone</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        {...register("timezone")}
                    >
                        {majorTimezones.map((tz) => (
                            <option key={tz.tzCode} value={tz.tzCode} className="text-black">
                                {tz.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <ClayButton
                        type="button"
                        variant="secondary"
                        className="flex-1"
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
                        Add Student
                    </ClayButton>
                </div>
            </form>
        </ClayModal>
    );
}
