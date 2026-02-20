import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ClayModal } from '../../components/ClayModal';
import { ClayInput } from '../../components/ClayInput';
import { ClayButton } from '../../components/ClayButton';
import { addClass, getCourses, type Course } from '../../services/schedulingService';
import { format } from 'date-fns';

interface AddClassDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onClassAdded?: () => void;
}

interface FormValues {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    meetLink: string;
    courseId: string;
}

export function AddClassDialog({ isOpen, onClose, onClassAdded }: AddClassDialogProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            endTime: '10:00'
        }
    });

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (isOpen) {
            getCourses().then(setCourses).catch(console.error);
        }
    }, [isOpen]);

    const onSubmit = async (data: FormValues) => {
        try {
            const start = new Date(`${data.date}T${data.startTime}`);
            const end = new Date(`${data.date}T${data.endTime}`);

            await addClass({
                title: data.title,
                start,
                end,
                meetLink: data.meetLink,
                status: 'scheduled',
                courseId: data.courseId || undefined
            });

            onClassAdded?.();
            onClose();
            reset();
        } catch (error) {
            console.error(error);
            // Handle error (ideally with a toast)
        }
    };

    return (
        <ClayModal
            isOpen={isOpen}
            onClose={onClose}
            title="Schedule Class"
            description="Add a new session to the calendar."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <ClayInput
                    id="title"
                    label="Class Title"
                    placeholder="e.g. Calculus Review"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Date</label>
                        <input
                            type="date"
                            className="w-full px-6 h-14 bg-black/30 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#7C3AED]"
                            {...register('date', { required: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Course (Optional)</label>
                        <select
                            className="w-full px-6 h-14 bg-black/30 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#7C3AED] appearance-none"
                            {...register('courseId')}
                        >
                            <option value="" className="bg-black text-gray-400">Select...</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id} className="bg-black">{c.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Start Time</label>
                        <input
                            type="time"
                            className="w-full px-6 h-14 bg-black/30 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#7C3AED]"
                            {...register('startTime', { required: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">End Time</label>
                        <input
                            type="time"
                            className="w-full px-6 h-14 bg-black/30 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#7C3AED]"
                            {...register('endTime', { required: true })}
                        />
                    </div>
                </div>

                <ClayInput
                    id="meetLink"
                    label="Meeting Link"
                    placeholder="https://..."
                    {...register('meetLink')}
                />

                <ClayButton
                    type="submit"
                    variant="primary"
                    className="w-full mt-4"
                    isLoading={isSubmitting}
                >
                    Schedule Session
                </ClayButton>
            </form>
        </ClayModal>
    );
}
