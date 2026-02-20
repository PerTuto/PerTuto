import { useState, useEffect } from "react";
import { getStudents, deleteStudent, type Student } from "../../services/schedulingService";
import { ClayButton } from "../../components/ClayButton";
import { AddStudentDialog } from "../../features/lms/AddStudentDialog";
import { Plus, Trash2, Mail, Phone, BookOpen, Clock } from "lucide-react";
import { SEOHead } from "../../components/SEOHead";
import { ClayCard } from "../../components/ClayCard";

export const AdminStudentsPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(id);
            fetchData();
        }
    };

    return (
        <>
            <SEOHead title="Students | PerTuto Admin" description="Manage Students" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Students</h1>
                        <p className="text-gray-400 mt-1">Manage student profiles and enrollment</p>
                    </div>
                    <ClayButton onClick={() => setIsAddStudentOpen(true)}>
                        <Plus className="mr-2" size={18} />
                        Add Student
                    </ClayButton>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        <UsersIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-white">No students yet</h3>
                        <p className="mb-6">Add your first student to get started.</p>
                        <ClayButton onClick={() => setIsAddStudentOpen(true)}>
                            Add Student
                        </ClayButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((student) => (
                            <ClayCard key={student.id} className="p-6 flex flex-col gap-4 bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                                            alt={student.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{student.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                {student.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-blue-400" />
                                        <a href={`mailto:${student.email}`} className="hover:text-blue-300 transition-colors">{student.email}</a>
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-purple-400" />
                                            <span>{student.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={14} className="text-yellow-400" />
                                        <span>{student.curriculum || 'No Curriculum'} • {student.grade || 'No Grade'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-gray-500" />
                                        <span>{student.timezone?.split('/').pop()?.replace('_', ' ') || 'UTC'}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                                    <div className="flex-1 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Progress</p>
                                        <p className="font-mono text-xl text-white">{student.progress || 0}%</p>
                                    </div>
                                    <div className="w-px bg-white/10"></div>
                                    <div className="flex-1 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Joined</p>
                                        <p className="font-mono text-sm text-white mt-1">
                                            {student.enrolledDate ? new Date(student.enrolledDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </ClayCard>
                        ))}
                    </div>
                )}

                <AddStudentDialog
                    isOpen={isAddStudentOpen}
                    onClose={() => setIsAddStudentOpen(false)}
                    onStudentAdded={fetchData}
                />
            </div>
        </>
    );
};

// Helper icon since I didn't import UsersIcon specifically for the empty state
function UsersIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    );
}
