
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getQuestionPapers, 
  deleteQuestionPaper,
  getCourses
} from "@/lib/firebase/services";
import { QuestionPaper, Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Edit, 
  FileDown,
  Clock,
  BookOpen,
  Loader2,
  Printer,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileSearch
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function QuestionPapersPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paperData, courseData] = await Promise.all([
        getQuestionPapers(tenantId),
        getCourses(tenantId)
      ]);
      setPapers(paperData);
      setCourses(courseData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load papers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the paper structure but not the bank questions.")) return;
    try {
      await deleteQuestionPaper(tenantId, id);
      setPapers(prev => prev.filter(p => p.id !== id));
      toast({ title: "Deleted", description: "Question paper removed" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.title || "Unknown Course";

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" /> Question Papers
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Design high-fidelity exams and assessments with AI assistance.</p>
        </div>

        <Button 
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20"
          onClick={() => router.push(`/dashboard/${tenantId}/question-papers/generate`)}
        >
          <Sparkles className="w-4 h-4 me-2" /> AI Paper Wizard
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-white/40 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search papers..." 
          className="ps-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/40 font-medium">Drafting exam papers...</p>
        </div>
      ) : filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="bg-glass border-slate-200 dark:border-white/5 group hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 end-0 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/${tenantId}/question-papers/${paper.id}`)}>
                      <Edit className="w-4 h-4 me-2" /> Edit Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Printer className="w-4 h-4 me-2" /> Print/Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(paper.id)}>
                      <Trash2 className="w-4 h-4 me-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground dark:text-white/40">
                    {paper.status}
                  </Badge>
                  {paper.generationMode === 'ai-assisted' && (
                    <Badge variant="outline" className="text-[8px] uppercase font-bold border-primary/20 bg-primary/5 text-primary">
                      AI GENERATED
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-outfit text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {paper.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-white/60">
                  <BookOpen className="w-3 h-3" /> {getCourseName(paper.courseId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 mt-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1">Total Marks</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{paper.totalMarks}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1">Duration</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" /> {paper.duration}<span className="text-[10px] font-bold text-muted-foreground dark:text-white/40">MIN</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/60">
                      <FileSearch className="w-3.5 h-3.5" /> 
                      {paper.sections.length} Sections
                   </div>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/10"
                    onClick={() => router.push(`/dashboard/${tenantId}/question-papers/${paper.id}`)}
                   >
                      Manage Sections <ChevronRight className="w-3 h-3 ms-1" />
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
              <Plus className="w-8 h-8 text-muted-foreground dark:text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Precision</h3>
            <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">
              Start creating your first question paper. Use AI to balance chapter weightage and difficulty levels.
            </p>
            <Button className="mt-6 bg-primary" onClick={() => router.push(`/dashboard/${tenantId}/question-papers/generate`)}>
              Generate First Paper
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
