import { useState, useEffect } from "react";
import { getCourses, deleteCourse, type Course } from "../../services/schedulingService";
import { ClayButton } from "../../components/ClayButton";
import { SpotlightCard } from "../../components/SpotlightCard";
import { CourseDialog } from "../../features/lms/CourseDialog";
import { ManageEnrollmentDialog } from "../../features/lms/ManageEnrollmentDialog";
import { Plus, Users, Clock, Trash2, Edit, User } from "lucide-react";
import { SEOHead } from "../../components/SEOHead";

export const AdminCoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const coursesData = await getCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(id);
            fetchData();
        }
    };

    // Calculate insights per course
    const getInsights = (course: Course) => {
        const enrolledCount = course.studentIds?.length || 0;
        // Simple mock for progress if we don't have detailed student-course progress data yet
        // In real app, we'd look up progress from student records
        const avgProgress = 0;
        return { enrolledCount, avgProgress };
    };

    return (
        <>
            <SEOHead title="Courses | PerTuto Admin" description="Manage Courses" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Courses</h1>
                        <p className="text-gray-400 mt-1">Manage curriculum and assignments</p>
                    </div>
                    <ClayButton onClick={() => setIsAddCourseOpen(true)}>
                        <Plus className="mr-2" size={18} />
                        Add Course
                    </ClayButton>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-white">No courses yet</h3>
                        <p className="mb-6">Create your first course to get started.</p>
                        <ClayButton onClick={() => setIsAddCourseOpen(true)}>
                            Create Course
                        </ClayButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const { enrolledCount } = getInsights(course);
                            return (
                                <SpotlightCard key={course.id} className="h-full flex flex-col p-0 overflow-hidden bg-black/40 border-white/10">
                                    <div className="relative h-48 w-full bg-gray-800">
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <User size={48} className="text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/10">
                                            {course.status}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                            {course.description || "No description provided."}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <User size={16} className="mr-2 text-purple-400" />
                                                {course.instructor}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Clock size={16} className="mr-2 text-blue-400" />
                                                {course.duration || "Self-paced"}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Users size={16} className="mr-2 text-green-400" />
                                                {enrolledCount} Students Enrolled
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => setEnrollingCourse(course)}
                                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Users size={14} /> Students
                                            </button>
                                            <button
                                                onClick={() => setEditingCourse(course)}
                                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            );
                        })}
                    </div>
                )}

                {/* Dialogs */}
                <CourseDialog
                    isOpen={isAddCourseOpen || !!editingCourse}
                    onClose={() => {
                        setIsAddCourseOpen(false);
                        setEditingCourse(null);
                    }}
                    courseToEdit={editingCourse}
                    onCourseSaved={fetchData}
                />

                {enrollingCourse && (
                    <ManageEnrollmentDialog
                        isOpen={!!enrollingCourse}
                        onClose={() => setEnrollingCourse(null)}
                        course={enrollingCourse}
                        onEnrollmentSaved={fetchData}
                    />
                )}
            </div>
        </>
    );
};
