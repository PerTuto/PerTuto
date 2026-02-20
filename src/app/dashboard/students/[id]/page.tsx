import { students, courses, assignments } from "@/lib/data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Book, Calendar, ClipboardList, Mail, Percent, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/types";

const statusColors: { [key in Student['status']]: string } = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    'On-hold': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    Graduated: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    Dropped: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id);

  if (!student) {
    notFound();
  }

  const enrolledCourses = courses.filter(c => student.courses.includes(c.id));
  const studentAssignments = assignments.filter(a => student.courses.includes(a.courseId));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback className="text-3xl">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <CardTitle className="font-headline text-3xl">{student.name}</CardTitle>
                    <Badge className={cn("text-sm", statusColors[student.status])}>{student.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" /> {student.email}
                </CardDescription>
                 <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> Enrolled on {new Date(student.enrolledDate).toLocaleDateString()}
                </CardDescription>
            </div>
            <div className="text-right">
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="text-3xl font-bold font-headline text-primary">{student.progress}%</div>
                <Progress value={student.progress} className="w-32 mt-2"/>
            </div>
        </CardHeader>
        {student.notes && (
            <CardContent>
                <div className="border-l-4 border-primary/50 bg-muted/20 p-4 rounded-r-lg">
                    <p className="font-semibold text-sm">Notes:</p>
                    <p className="text-muted-foreground text-sm">{student.notes}</p>
                </div>
            </CardContent>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="h-5 w-5" /> Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>
                <Badge variant="secondary">{course.duration}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {studentAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                     <Badge 
                        variant={assignment.status === 'Graded' ? 'default' : assignment.status === 'Submitted' ? 'secondary' : 'outline'}
                     >
                        {assignment.status}
                    </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
