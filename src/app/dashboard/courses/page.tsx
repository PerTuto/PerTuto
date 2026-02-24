"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, User, Trash2, Users, Pencil, Book } from "lucide-react";
import { getCourses, getStudents, deleteCourse } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CourseDialog } from "@/components/courses/course-dialog";
import { ManageEnrollmentDialog } from "@/components/courses/manage-enrollment-dialog";
import type { Course, Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // New state for insights
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!userProfile?.tenantId) return;
    setIsLoading(true);
    try {
      const [courseList, studentList] = await Promise.all([
        getCourses(userProfile.tenantId),
        getStudents(userProfile.tenantId)
      ]);
      setCourses(courseList);
      setStudents(studentList);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.tenantId) {
      fetchData();
    }
  }, [userProfile?.tenantId]);

  const handleCourseSaved = (savedCourse: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === savedCourse.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCourse.id ? savedCourse : c));
      } else {
        return [...prev, savedCourse];
      }
    });
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!userProfile?.tenantId) return;
    try {
      await deleteCourse(userProfile.tenantId, courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast({
        title: "Deleted",
        description: "Course deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500";
      case "archived":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "";
    }
  };

  // Helper to get course insights
  const getCourseInsights = (courseId: string) => {
    // Check if student has this course ID in their list
    const enrolledStudents = students.filter(s => s.courses?.includes(courseId));
    const count = enrolledStudents.length;
    const avgProgress = count > 0
      ? Math.round(enrolledStudents.reduce((acc, s) => acc + (s.progress || 0), 0) / count)
      : 0;
    return { count, avgProgress, enrolledStudents };
  };

  if (!userProfile?.tenantId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and curriculum
          </p>
        </div>
        <CourseDialog onCourseSaved={handleCourseSaved} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground mb-4">No courses yet</p>
          <CourseDialog onCourseSaved={handleCourseSaved} />
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const { count, avgProgress, enrolledStudents } = getCourseInsights(course.id);
            return (
              <Card
                key={course.id}
                className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 w-full">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Book className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${getStatusColor(course.status)}`}
                  >
                    {course.status}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">
                      {course.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{course.instructor || "No instructor assigned"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || "Duration not set"}</span>
                  </div>

                  {/* Insights Section */}
                  <div className="pt-2 border-t mt-2 grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">Enrolled</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary flex items-center gap-1 justify-start">
                            <Users className="h-3 w-3" />
                            <span>{count} Students</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-0">
                          <div className="p-2 bg-muted/50 border-b">
                            <h4 className="font-medium text-sm">Enrolled Students</h4>
                          </div>
                          <ScrollArea className="h-48">
                            <div className="p-2 space-y-1">
                              {enrolledStudents.length > 0 ? (
                                enrolledStudents.map(s => (
                                  <div key={s.id} className="text-sm px-2 py-1 rounded hover:bg-muted/50">
                                    {s.name}
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground px-2 py-1">No students enrolled</p>
                              )}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">Avg. Progress</span>
                      <span>{avgProgress}%</span>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="flex gap-2">
                  <ManageEnrollmentDialog
                    course={course}
                    onEnrollmentSaved={fetchData}
                    trigger={
                      <Button variant="outline" className="flex-1" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Students
                      </Button>
                    }
                  />
                  <CourseDialog
                    courseToEdit={course}
                    onCourseSaved={handleCourseSaved}
                    trigger={
                      <Button variant="outline" className="flex-1" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{course.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCourse(course.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
