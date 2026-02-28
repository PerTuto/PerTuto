
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  getBatches, 
  createBatch, 
  updateBatch, 
  deleteBatch,
  getCenters,
  getCourses,
  getStudents,
  getTeachers
} from "@/lib/firebase/services";
import { Batch, Center, Course, Student, TenantUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Layers, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Users,
  GraduationCap,
  Calendar,
  Loader2,
  Clock,
  BookOpen,
  Building2,
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BatchesPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  
  const [batches, setBatches] = useState<Batch[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<TenantUser[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState<Omit<Batch, "id" | "createdAt">>({
    name: "",
    courseId: "",
    centerId: "",
    teacherIds: [],
    studentIds: [],
    status: "active",
    schedule: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchData, centerData, courseData, studentData, teacherData] = await Promise.all([
        getBatches(tenantId),
        getCenters(tenantId),
        getCourses(tenantId),
        getStudents(tenantId),
        getTeachers(tenantId)
      ]);
      setBatches(batchData);
      setCenters(centerData);
      setCourses(courseData);
      setStudents(studentData);
      setTeachers(teacherData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleOpenDialog = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        courseId: batch.courseId,
        centerId: batch.centerId || "",
        teacherIds: batch.teacherIds,
        studentIds: batch.studentIds,
        status: batch.status,
        schedule: batch.schedule || []
      });
    } else {
      setEditingBatch(null);
      setFormData({
        name: "",
        courseId: "",
        centerId: "",
        teacherIds: [],
        studentIds: [],
        status: "active",
        schedule: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.courseId) {
      toast({ title: "Error", description: "Name and Course are required", variant: "destructive" });
      return;
    }

    try {
      if (editingBatch) {
        await updateBatch(tenantId, editingBatch.id, formData);
        toast({ title: "Success", description: "Batch updated successfully" });
      } else {
        await createBatch(tenantId, formData);
        toast({ title: "Success", description: "Batch created successfully" });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Save operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will not delete the students or teachers, just the cohort group.")) return;
    try {
      await deleteBatch(tenantId, id);
      setBatches(prev => prev.filter(b => b.id !== id));
      toast({ title: "Deleted", description: "Batch has been removed" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const toggleStudent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(id) 
        ? prev.studentIds.filter(sid => sid !== id)
        : [...prev.studentIds, id]
    }));
  };

  const toggleTeacher = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(id) 
        ? prev.teacherIds.filter(tid => tid !== id)
        : [...prev.teacherIds, id]
    }));
  };

  const filteredBatches = batches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.title || "Unknown Course";
  const getCenterName = (id?: string) => centers.find(c => c.id === id)?.name || "Virtual / No Center";

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" /> Batch Management
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Organize students into groups for scheduling and performance tracking.</p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20" onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 me-2" /> Create Batch
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 dark:text-white/20 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search batches..." 
          className="ps-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/40 font-medium">Assembled cohorts...</p>
        </div>
      ) : filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <Card key={batch.id} className="bg-glass border-slate-200 dark:border-white/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 end-0 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground dark:text-white/20 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDialog(batch)}>
                      <Edit className="w-4 h-4 me-2" /> Edit Batch
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(batch.id)}>
                      <Trash2 className="w-4 h-4 me-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${
                    batch.status === 'active' 
                      ? "border-primary/30 bg-primary/5 text-primary" 
                      : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-muted-foreground dark:text-white/40"
                  }`}>
                    {batch.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground dark:text-white/20 uppercase font-bold tracking-widest">• {getCenterName(batch.centerId)}</span>
                </div>
                <CardTitle className="font-outfit text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {batch.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="w-3 h-3" /> {getCourseName(batch.courseId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 mt-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1">Students</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" /> {batch.studentIds.length}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1">Teachers</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary" /> {batch.teacherIds.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/40">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {batch.schedule?.length ? `${batch.schedule.length} sessions/week` : 'No schedule set'}
                   </div>
                   <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/10">
                      View Roster <ChevronRight className="w-3 h-3 ms-1" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Layers className="w-8 h-8 text-muted-foreground dark:text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Scale your teaching</h3>
            <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">
              Create batches to manage student cohorts, assign teachers, and track collective progress.
            </p>
            <Button className="mt-6 bg-primary" onClick={() => handleOpenDialog()}>
              Create Your First Batch
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-glass border-slate-200 dark:border-white/10 text-slate-900 dark:text-white max-w-2xl rounded-2xl p-0 overflow-hidden">
          <div className="p-6 pb-2 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <DialogTitle className="text-xl font-black font-outfit text-slate-900 dark:text-white">
              {editingBatch ? "Edit Batch" : "Create New Batch"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-white/40">
              Configure student groups and instructor assignments.
            </DialogDescription>
          </div>
          
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Batch Name</Label>
                <Input 
                  placeholder="e.g. IB Math HL — Batch A" 
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Course</Label>
                <Select value={formData.courseId} onValueChange={(val) => setFormData({...formData, courseId: val})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Center</Label>
                <Select value={formData.centerId} onValueChange={(val) => setFormData({...formData, centerId: val})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white">
                    <SelectValue placeholder="Virtual / No Center" />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <SelectItem value="none">Virtual / No Center</SelectItem>
                    {centers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Batch Status</Label>
                <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/5">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest flex items-center justify-between">
                  Assign Teachers <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-[8px] bg-slate-50 dark:bg-white/5">{formData.teacherIds.length} Selected</Badge>
                </Label>
                <Card className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 overflow-hidden">
                  <ScrollArea className="h-48 p-2">
                    {teachers.map(t => (
                      <div key={t.id} className="flex items-center space-x-2 py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <Checkbox 
                          id={`teacher-${t.id}`} 
                          checked={formData.teacherIds.includes(t.id)}
                          onCheckedChange={() => toggleTeacher(t.id)}
                          className="border-slate-300 dark:border-white/20"
                        />
                        <label htmlFor={`teacher-${t.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 text-slate-700 dark:text-white/80">
                          {t.fullName}
                        </label>
                      </div>
                    ))}
                  </ScrollArea>
                </Card>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest flex items-center justify-between">
                  Enroll Students <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-[8px] bg-slate-50 dark:bg-white/5">{formData.studentIds.length} Selected</Badge>
                </Label>
                <Card className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 overflow-hidden">
                  <ScrollArea className="h-48 p-2">
                    {students.map(s => (
                      <div key={s.id} className="flex items-center space-x-2 py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <Checkbox 
                          id={`student-${s.id}`} 
                          checked={formData.studentIds.includes(s.id)}
                          onCheckedChange={() => toggleStudent(s.id)}
                          className="border-slate-300 dark:border-white/20"
                        />
                        <label htmlFor={`student-${s.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 text-slate-700 dark:text-white/80">
                          {s.name}
                        </label>
                      </div>
                    ))}
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-12 h-11 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              {editingBatch ? "Save Changes" : "Create Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
