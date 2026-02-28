
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  createTest,
  getQuestionPapers,
  getBatches
} from "@/lib/firebase/services";
import { QuestionPaper, Batch, Test } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Calendar,
  Clock,
  ChevronLeft,
  Loader2,
  Save,
  FileText,
  Users,
  Settings2,
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export default function TestCreatePage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [test, setTest] = useState<Omit<Test, 'id' | 'createdAt'>>({
    title: "",
    questionPaperId: "",
    batchIds: [],
    scheduledDate: new Date(),
    duration: 60,
    instructions: "",
    status: "draft",
    uploadMode: "admin-bulk",
    createdBy: user?.uid || "",
  });

  useEffect(() => {
    async function init() {
      try {
        const [p, b] = await Promise.all([
          getQuestionPapers(tenantId),
          getBatches(tenantId)
        ]);
        setPapers(p);
        setBatches(b);
      } catch (e) {
        toast({ title: "Error", description: "Initialization failed", variant: "destructive" });
      }
    }
    init();
  }, [tenantId]);

  const handleToggleBatch = (batchId: string) => {
    setTest(prev => ({
      ...prev,
      batchIds: prev.batchIds.includes(batchId)
        ? prev.batchIds.filter(id => id !== batchId)
        : [...prev.batchIds, batchId]
    }));
  };

  const handleSave = async () => {
    if (!test.title || !test.questionPaperId || test.batchIds.length === 0) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await createTest(tenantId, {
        ...test,
        createdAt: new Date(),
      } as any);
      toast({ title: "Test Scheduled", description: "The exam session has been created." });
      router.push(`/dashboard/${tenantId}/tests`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to schedule test", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" /> Schedule Test
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Define exam sessions and assign student cohorts.</p>
        </div>
        <Button variant="ghost" className="text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 me-2" /> Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                    <CardTitle className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" /> General Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Test Title</Label>
                        <Input 
                            placeholder="e.g. Mid-Term Geometry Quiz" 
                            className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl text-lg"
                            value={test.title}
                            onChange={(e) => setTest({...test, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Question Paper</Label>
                            <Select value={test.questionPaperId} onValueChange={(val) => setTest({...test, questionPaperId: val})}>
                                <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl">
                                    <SelectValue placeholder="Select paper" />
                                </SelectTrigger>
                                <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                                    {papers.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Initial Status</Label>
                            <Select value={test.status} onValueChange={(val: any) => setTest({...test, status: val})}>
                                <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                                    <SelectItem value="draft">Draft (Offline)</SelectItem>
                                    <SelectItem value="scheduled">Scheduled (Announced)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Instructions (Optional)</Label>
                        <textarea 
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors h-32"
                            placeholder="e.g. No calculators allowed. Use blue ink only."
                            value={test.instructions}
                            onChange={(e) => setTest({...test, instructions: e.target.value})}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                    <CardTitle className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-secondary" /> Batch Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                    <p className="text-xs text-muted-foreground dark:text-white/40 mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Select one or more batches that will sit for this exam.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {batches.map((batch) => (
                            <div 
                                key={batch.id} 
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                    test.batchIds.includes(batch.id) 
                                    ? 'bg-primary/10 border-primary/30' 
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                }`}
                                onClick={() => handleToggleBatch(batch.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={test.batchIds.includes(batch.id)} onCheckedChange={() => handleToggleBatch(batch.id)} />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{batch.name}</p>
                                        <p className="text-[10px] text-muted-foreground dark:text-white/40 uppercase font-black">{batch.status}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground dark:text-white/40">
                                    {batch.studentIds.length} Students
                                </Badge>
                            </div>
                        ))}
                        {batches.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground dark:text-white/20 text-sm italic">No batches found. Create a batch first.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="bg-glass-heavy border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden">
                <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
                    <CardTitle className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> Timing & Mode
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Scheduled Date</Label>
                            <Input 
                                type="datetime-local"
                                className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-lg text-xs"
                                onChange={(e) => setTest({...test, scheduledDate: new Date(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Duration (Min)</Label>
                            <Input 
                                type="number"
                                className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-lg"
                                value={test.duration}
                                onChange={(e) => setTest({...test, duration: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Submission Workflow</Label>
                        <div className="space-y-3">
                            <div 
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    test.uploadMode === 'admin-bulk' 
                                    ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/30' 
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                }`}
                                onClick={() => setTest({...test, uploadMode: 'admin-bulk'})}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white font-headline">Admin Bulk Eval</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground dark:text-white/40">Teacher uploads all papers; AI auto-segments and grades.</p>
                            </div>

                            <div 
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    test.uploadMode === 'student-upload' 
                                    ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/30' 
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                }`}
                                onClick={() => setTest({...test, uploadMode: 'student-upload'})}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-secondary" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white font-headline">Student Upload</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground dark:text-white/40">Students scan and upload their own copies after the exam.</p>
                            </div>
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/20 mt-4"
                        disabled={loading}
                        onClick={handleSave}
                    >
                        {loading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
                        Finalize Schedule
                    </Button>
                </CardContent>
            </Card>

            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">AI Grading Enabled</p>
                    <p className="text-[10px] text-muted-foreground dark:text-white/40 leading-tight">Subjective responses will be evaluated using the paper rubric.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
