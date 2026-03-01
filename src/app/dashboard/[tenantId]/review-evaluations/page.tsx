
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  getReviewQueue,
  getEvaluation,
  updateEvaluation,
  getTest,
  getQuestionPaper
} from "@/lib/firebase/services";
import { Evaluation, Test, QuestionPaper } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  FileText,
  Save,
  Undo2,
  Maximize2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReviewEvaluationsPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [queue, setQueue] = useState<Evaluation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = await getReviewQueue(tenantId);
      setQueue(q);
      
      const targetId = searchParams.get('id');
      if (targetId) {
        const index = q.findIndex(e => e.id === targetId);
        if (index !== -1) setCurrentIndex(index);
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to load review queue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  useEffect(() => {
    async function loadFocus() {
      if (queue.length > 0 && currentIndex < queue.length) {
        const ev = queue[currentIndex];
        setSelectedEval(ev);
        const [t, p] = await Promise.all([
          getTest(tenantId, ev.testId),
          getQuestionPaper(tenantId, (await getTest(tenantId, ev.testId))?.questionPaperId || "")
        ]);
        setTest(t);
        setPaper(p);
      } else {
        setSelectedEval(null);
      }
    }
    loadFocus();
  }, [currentIndex, queue]);

  const handleApprove = async () => {
    if (!selectedEval) return;
    setSaving(true);
    try {
      await updateEvaluation(tenantId, selectedEval.id, {
        status: 'reviewed',
        requiresReview: false,
        reviewedBy: 'Teacher ID', // In real app, from auth
        reviewedAt: new Date()
      });
      toast({ title: "Approved", description: "AI evaluation marks confirmed." });
      setQueue(prev => prev.filter(e => e.id !== selectedEval.id));
      if (currentIndex >= queue.length - 1 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
    } catch (e) {
      toast({ title: "Error", description: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground dark:text-white/20">Loading review queue...</p>
    </div>
  );

  if (queue.length === 0) return (
    <div className="container mx-auto py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Queue Clear!</h2>
        <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">All AI-powered evaluations have been verified or met the confidence threshold.</p>
        <Button variant="outline" className="border-slate-200 dark:border-white/10" onClick={() => router.back()}>Return to Dashboard</Button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <div className="bg-glass-heavy border-b border-slate-200 dark:border-white/5 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-white/10">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-lg font-black font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> HITL Review Loop
                    </h1>
                    <p className="text-[10px] uppercase font-black text-muted-foreground/80 dark:text-white/40 tracking-widest leading-none mt-1">
                        Processing {currentIndex + 1} of {queue.length} Flagged Sessions
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg" 
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-white/40" />
                    </Button>
                    <div className="px-3 text-xs font-bold text-slate-600 dark:text-white/60 tabular-nums">
                        {currentIndex + 1} / {queue.length}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        disabled={currentIndex === queue.length - 1}
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                    >
                        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-white/40" />
                    </Button>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl" onClick={handleApprove} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <CheckCircle2 className="w-4 h-4 me-2" />}
                    Verify & Release
                </Button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Side: Scanned Document */}
            <div className="flex-[3] bg-slate-100 dark:bg-black/40 relative overflow-hidden flex items-center justify-center p-8 border-r border-slate-200 dark:border-white/5">
                <div className="absolute top-4 start-4 bg-glass border border-slate-200 dark:border-white/10 p-2 rounded-lg z-20 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-100 uppercase tracking-widest">
                        Confidence Score: {selectedEval?.confidenceScore}%
                    </span>
                </div>
                <div className="w-full h-full bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center space-y-4">
                    {selectedEval?.answerSheetUrl ? (
                         <iframe src={selectedEval.answerSheetUrl} className="w-full h-full rounded-2xl" />
                    ) : (
                        <>
                            <FileText className="w-12 h-12 text-muted-foreground/30 dark:text-white/10" />
                            <p className="text-xs text-muted-foreground dark:text-white/20">Loading Scanned Sheet...</p>
                        </>
                    )}
                </div>
                <Button variant="ghost" size="icon" className="absolute bottom-12 end-12 bg-black/50 text-white rounded-full h-12 w-12 hover:bg-black">
                    <Maximize2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Right Side: AI Marks & Rubric */}
            <div className="flex-[2] overflow-y-auto bg-slate-50 dark:bg-glass-heavy p-8 space-y-8 custom-scrollbar">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 dark:text-white/20 mb-4">Evaluation Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-white/60">Test</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{test?.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-white/60">Student</span>
                            <span className="text-sm font-bold text-primary">Student ID: {selectedEval?.studentId}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 dark:text-white/20">AI Extraction results</h3>
                    {selectedEval?.questionScores.map((score, i) => (
                        <Card key={score.questionId} className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 overflow-hidden group shadow-sm dark:shadow-none">
                           <CardHeader className="p-4 bg-slate-100 dark:bg-white/5 flex flex-row items-center justify-between border-b border-slate-200 dark:border-none">
                                <CardTitle className="text-xs font-bold text-slate-600 dark:text-white/60">QUESTION {i + 1}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        type="number" 
                                        className="w-16 h-8 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-black text-primary text-center rounded-lg"
                                        defaultValue={score.marksAwarded}
                                    />
                                    <span className="text-xs text-muted-foreground dark:text-white/20">/ {score.maxMarks}</span>
                                </div>
                           </CardHeader>
                           <CardContent className="p-4 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/80 dark:text-white/20 tracking-widest">AI Feedback</p>
                                    <p className="text-sm text-slate-800 dark:text-white/80 leading-relaxed italic border-s-2 border-primary/30 ps-3">
                                        "{score.feedback}"
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/80 dark:text-white/20 tracking-widest">Confidence</span>
                                    <Badge variant="outline" className={`text-[10px] font-black border-none ${score.confidence > 90 ? 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-transparent' : 'text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-transparent'}`}>
                                        {score.confidence}%
                                    </Badge>
                                </div>
                           </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-white/5">
                    <div className="flex flex-col gap-3">
                        <Button className="w-full bg-white text-black font-black hover:bg-white/90 rounded-xl h-12" onClick={handleApprove}>
                            CONFIRM MARKS
                        </Button>
                        <Button variant="ghost" className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10 font-bold rounded-xl h-12">
                            RE-EVALUATE MANUALLY
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
