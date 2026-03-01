
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  getStudyMaterials, 
  createStudyMaterial, 
  deleteStudyMaterial,
  getCourses,
  getBatches,
  getTaxonomyNodes
} from "@/lib/firebase/services";
import { StudyMaterial, Course, Batch, TaxonomyNode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Library, 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  Download, 
  Search,
  Filter,
  Loader2,
  MoreVertical,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function LibraryPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Form State
  const [newMaterial, setNewMaterial] = useState<Partial<StudyMaterial>>({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "pdf",
    courseIds: [],
    batchIds: [],
    subjectId: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<TaxonomyNode[]>([]);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super' || userProfile?.role === 'teacher';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, c, b, t] = await Promise.all([
        getStudyMaterials(tenantId),
        getCourses(tenantId),
        getBatches(tenantId),
        getTaxonomyNodes(tenantId)
      ]);
      setMaterials(m);
      setCourses(c);
      setBatches(b);
      setSubjects(t.filter(n => n.type === 'domain'));
    } catch (error) {
      toast({ title: "Error", description: "Failed to load library resources", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.fileUrl || !newMaterial.subjectId) {
        toast({ title: "Missing Fields", description: "Title, Subject and File URL are required.", variant: "destructive" });
        return;
    }

    setSaving(true);
    try {
      await createStudyMaterial(tenantId, {
        title: newMaterial.title!,
        description: newMaterial.description,
        fileUrl: newMaterial.fileUrl!,
        fileType: newMaterial.fileType as any,
        subjectId: newMaterial.subjectId!,
        courseIds: newMaterial.courseIds || [],
        batchIds: newMaterial.batchIds || [],
        uploadedBy: user?.uid || "Admin",
      });
      toast({ title: "Material Added", description: "Resource is now available in the library." });
      setIsUploadOpen(false);
      setNewMaterial({ title: "", description: "", fileUrl: "", fileType: "pdf", courseIds: [], batchIds: [], subjectId: "" });
      fetchData();
    } catch (error) {
      toast({ title: "Upload Failed", description: "Could not add material to library.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this resource?")) return;
    try {
      await deleteStudyMaterial(tenantId, id);
      toast({ title: "Deleted", description: "Material removed from library." });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete resource.", variant: "destructive" });
    }
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || m.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Library className="w-8 h-8 text-primary" /> Digital Library
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Access study guides, lecture notes, and media resources.</p>
        </div>

        {isAdmin && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 me-2" /> Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Add to Library</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-white/40">
                  Upload files or link videos for students to access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80 dark:text-white/40">Title</Label>
                  <Input 
                    placeholder="e.g., Quantum Mechanics Notes" 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground/80 dark:text-white/40">Subject</Label>
                    <Select 
                      value={newMaterial.subjectId} 
                      onValueChange={(val) => setNewMaterial({...newMaterial, subjectId: val})}
                    >
                      <SelectTrigger className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl h-11 text-slate-900 dark:text-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground/80 dark:text-white/40">Type</Label>
                    <Select 
                      value={newMaterial.fileType} 
                      onValueChange={(val) => setNewMaterial({...newMaterial, fileType: val as any})}
                    >
                      <SelectTrigger className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl h-11 text-slate-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="video">Video Lesson</SelectItem>
                        <SelectItem value="image">Diagram / Image</SelectItem>
                        <SelectItem value="presentation">Slideshow</SelectItem>
                        <SelectItem value="link">Web Resource</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80 dark:text-white/40">File URL / Link</Label>
                  <Input 
                    placeholder="https://..." 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
                    value={newMaterial.fileUrl}
                    onChange={(e) => setNewMaterial({...newMaterial, fileUrl: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12"
                  onClick={handleUpload}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <Plus className="w-4 h-4 me-2" />}
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-glass p-4 rounded-2xl border border-slate-200 dark:border-white/5">
        <div className="relative flex-1 w-full">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 dark:text-white/20" />
            <Input 
                placeholder="Search resources..." 
                className="bg-slate-100 dark:bg-white/5 border-none h-12 ps-12 rounded-xl text-slate-900 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-[200px] bg-slate-100 dark:bg-white/5 border-none h-12 rounded-xl text-slate-900 dark:text-white">
                <Filter className="w-4 h-4 me-2 text-muted-foreground/50 dark:text-white/20" />
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((item) => (
            <Card key={item.id} className="group bg-glass border-slate-200 dark:border-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden rounded-2xl">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-slate-50 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                    {item.fileType === 'pdf' ? <FileText className="w-16 h-16 text-muted-foreground/20 dark:text-white/10 group-hover:text-primary/20 transition-colors" /> :
                     item.fileType === 'video' ? <Video className="w-16 h-16 text-muted-foreground/20 dark:text-white/10 group-hover:text-primary/20 transition-colors" /> :
                     <BookOpen className="w-16 h-16 text-muted-foreground/20 dark:text-white/10 group-hover:text-primary/20 transition-colors" />
                    }
                    <div className="absolute top-4 end-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        {isAdmin && (
                             <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-muted-foreground dark:text-white/40 line-clamp-2 font-light min-h-[32px]">{item.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                    <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 border-none text-[10px] uppercase font-black text-muted-foreground dark:text-white/20 tracking-tighter">
                        {subjects.find(s => s.id === item.subjectId)?.name || 'General'}
                    </Badge>
                    <a 
                        href={item.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                        {item.fileType === 'video' ? 'Watch' : 'View'} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center rounded-3xl">
            <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-muted-foreground dark:text-white/20">
                    <Library className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Library is empty</h3>
                <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">No study materials have been uploaded for this organization yet.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
