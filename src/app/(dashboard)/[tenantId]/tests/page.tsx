
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getTests, 
  deleteTest,
  getQuestionPapers,
  getBatches
} from "@/lib/firebase/services";
import { Test, QuestionPaper, Batch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  ClipboardList, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Calendar,
  Clock,
  Users,
  Loader2,
  ChevronRight,
  FileText,
  BadgeCheck,
  PlayCircle,
  CheckCircle2,
  Timer
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
import { format } from "date-fns";

export default function TestsPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [tests, setTests] = useState<Test[]>([]);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testData, paperData, batchData] = await Promise.all([
        getTests(tenantId),
        getQuestionPapers(tenantId),
        getBatches(tenantId)
      ]);
      setTests(testData);
      setPapers(paperData);
      setBatches(batchData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the test schedule and all associated evaluations.")) return;
    try {
      await deleteTest(tenantId, id);
      setTests(prev => prev.filter(t => t.id !== id));
      toast({ title: "Deleted", description: "Test record removed" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const getStatusColor = (status: Test["status"]) => {
    switch (status) {
      case "draft": return "bg-white/5 text-white/40 border-white/10";
      case "scheduled": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "in-progress": return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "results-published": return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getPaperTitle = (id: string) => papers.find(p => p.id === id)?.title || "Unknown Paper";
  const getBatchNames = (ids: string[]) => batches.filter(b => ids.includes(b.id)).map(b => b.name).join(", ") || "No batches";

  const filteredTests = tests.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" /> Test Lifecycle
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Manage exams, bulk upload answer sheets, and monitor AI grading.</p>
        </div>

        <Button 
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20"
          onClick={() => router.push(`/dashboard/${tenantId}/tests/create`)}
        >
          <Plus className="w-4 h-4 me-2" /> Schedule New Test
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-white/40 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search tests..." 
          className="ps-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/40 font-medium">Loading test schedules...</p>
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="bg-glass border-slate-200 dark:border-white/5 group hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col relative">
              <div className="absolute top-0 end-0 p-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="w-4 h-4 me-2" /> Edit Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/${tenantId}/tests/${test.id}/results`)}>
                      <BadgeCheck className="w-4 h-4 me-2" /> View Results
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(test.id)}>
                      <Trash2 className="w-4 h-4 me-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${getStatusColor(test.status)}`}>
                    {test.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-[8px] uppercase font-bold border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground dark:text-white/40">
                    {test.uploadMode === 'admin-bulk' ? 'BULK EVAL' : 'STUDENT UPLOAD'}
                  </Badge>
                </div>
                <CardTitle className="font-outfit text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/${tenantId}/tests/${test.id}`)}>
                  {test.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs truncate text-muted-foreground dark:text-white/60">
                  <FileText className="w-3 h-3" /> {getPaperTitle(test.questionPaperId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 mt-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{format(test.scheduledDate, 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 mb-1 flex items-center gap-1">
                        <Timer className="w-3 h-3" /> Duration
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{test.duration} <span className="text-[10px] text-muted-foreground dark:text-white/40">MIN</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/60 bg-slate-50 dark:bg-white/5 p-2 rounded-lg border border-slate-200 dark:border-white/5">
                  <Users className="w-3.5 h-3.5 text-primary" /> 
                  <span className="truncate flex-1">{getBatchNames(test.batchIds)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                   <div className="flex -space-x-2">
                      {/* Placeholder for student count/status */}
                      <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 bg-primary/10 text-[10px] flex items-center justify-center font-bold text-primary">85%</div>
                      <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 bg-green-500/10 text-[10px] flex items-center justify-center font-bold text-green-600 dark:text-green-500">
                          <CheckCircle2 className="w-3 h-3" />
                      </div>
                   </div>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/10"
                    onClick={() => router.push(`/dashboard/${tenantId}/tests/${test.id}`)}
                   >
                      Manage Evaluations <ChevronRight className="w-3 h-3 ms-1" />
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
              <Calendar className="w-8 h-8 text-muted-foreground dark:text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Integrity</h3>
            <p className="text-muted-foreground dark:text-white/60 max-w-sm mx-auto">
              Schedule your first exam. Our AI will automatically grade the subjective responses and flag low-confidence evaluations for your review.
            </p>
            <Button className="mt-6 bg-primary" onClick={() => router.push(`/dashboard/${tenantId}/tests/create`)}>
              Schedule First Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
