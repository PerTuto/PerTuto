
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getTest,
  updateTest,
  getQuestionPaper,
  getEvaluation,
  getEvaluationsByTest,
  getStudentsByIds,
  getBatches
} from "@/lib/firebase/services";
import { Test, QuestionPaper, Evaluation, Student, Batch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChevronLeft,
  Loader2,
  Upload,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MoreVertical,
  Printer,
  Trash2,
  Check,
  Search,
  Timer,
  Calendar,
  Eye,
  RefreshCw,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { functions, storage } from "@/lib/firebase/client-app";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";

export default function TestDetailPage() {
  const { tenantId, id } = useParams() as { tenantId: string; id: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [test, setTest] = useState<Test | null>(null);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchData = async () => {
    try {
      const t = await getTest(tenantId, id);
      if (!t) return;
      setTest(t);

      const [p, evals, b] = await Promise.all([
        getQuestionPaper(tenantId, t.questionPaperId),
        getEvaluationsByTest(tenantId, id),
        getBatches(tenantId)
      ]);

      // Get all students from assigned batches
      const batchList = b.filter(batch => t.batchIds.includes(batch.id));
      setBatches(batchList);
      
      const studentIds = Array.from(new Set(batchList.flatMap((batch: Batch) => batch.studentIds as string[])));
      const studentList = await getStudentsByIds(tenantId, studentIds);
      setStudents(studentList);

      setPaper(p);
      setEvaluations(evals);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load test details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId, id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Simulate/Implement bulk upload matching logic
      // In a real scenario, we'd name files like studentId.pdf or use OCR to match
      const file = files[0];
      const storagePath = `tenants/${tenantId}/tests/${id}/answers/${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setUploadProgress(50);

      toast({ title: "Upload Success", description: "File uploaded. Starting AI Evaluation..." });
      
      // Trigger AI Evaluator
      // Try to match student by filename (e.g. "studentId.pdf" or "firstNameLastName.pdf")
      let studentId = "manual-match-needed";
      const fileNameWithoutExt = file.name.split('.')[0];
      
      const matchedStudent = students.find(s => 
        s.id === fileNameWithoutExt || 
        s.name.toLowerCase().replace(/\s+/g, '') === fileNameWithoutExt.toLowerCase().replace(/\s+/g, '')
      );
      
      if (matchedStudent) {
        studentId = matchedStudent.id;
      } else if (students.length === 1) {
        // Fallback: if only one student in the batch, assume it's theirs
        studentId = students[0].id;
      }

      const evaluator = httpsCallable(functions, 'evaluator');
      await evaluator({
        tenantId,
        testId: id,
        studentId,
        answerSheetUrl: url,
        questionPaper: paper
      });

      toast({ title: "Evaluation Complete", description: "AI has finished grading the session." });
      fetchData();
    } catch (error) {
      toast({ title: "Upload Failed", description: "Could not process answer sheet.", variant: "destructive" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const publishResults = async () => {
    try {
      await updateTest(tenantId, id, { status: 'results-published' });
      setTest(prev => prev ? { ...prev, status: 'results-published' } : null);
      toast({ title: "Results Published", description: "Students can now view their scores." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground dark:text-white/40 font-medium">Assembling test dashboard...</p>
    </div>
  );

  if (!test) return <div>Test not found</div>;

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10" onClick={() => router.back()}>
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-white" />
            </Button>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white">{test.title}</h1>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black tracking-widest">
                        {test.status}
                    </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/40 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(test.scheduledDate, 'PPP')}</span>
                    <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> {test.duration} Minutes</span>
                    <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {paper?.title}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                <Printer className="w-4 h-4 me-2" /> Print Question Paper
            </Button>
            {test.status === 'completed' && (
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold" onClick={publishResults}>
                    <CheckCircle2 className="w-4 h-4 me-2" /> Publish All Results
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
            <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5 flex flex-row items-center justify-between bg-slate-50 dark:bg-white/5">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white font-outfit">Evaluation Pipeline</CardTitle>
                        <CardDescription>{evaluations.length} of {students.length} sheets processed</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="file" multiple className="hidden" id="sheet-upload" onChange={handleFileUpload} />
                            <Button asChild className="bg-secondary hover:bg-secondary/90 text-white cursor-pointer rounded-xl font-bold">
                                <label htmlFor="sheet-upload">
                                    <Upload className="w-4 h-4 me-2" /> Upload Answer Sheets
                                </label>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {uploading && (
                        <div className="p-6 bg-primary/5 border-b border-primary/10 animate-pulse">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-primary flex items-center gap-2">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> Heavy Vision AI is evaluating handwriting...
                                </span>
                                <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1 bg-slate-200 dark:bg-white/5" />
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-[10px] uppercase font-black tracking-widest text-muted-foreground dark:text-white/40">
                                <tr>
                                    <th className="px-8 py-4">Student</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">AI Score</th>
                                    <th className="px-8 py-4">Confidence</th>
                                    <th className="px-8 py-4 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {students.map((student) => {
                                    const evaluation = evaluations.find(e => e.studentId === student.id);
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-white uppercase">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</p>
                                                        <p className="text-[10px] text-muted-foreground dark:text-white/40">{student.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {evaluation ? (
                                                    <Badge className={evaluation.requiresReview ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-600 dark:text-green-500'}>
                                                        {evaluation.status.toUpperCase()}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground dark:text-white/20 italic">Missing Sheet</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {evaluation ? (
                                                    <div className="text-sm font-black text-slate-900 dark:text-white">
                                                        {evaluation.totalScore} <span className="text-muted-foreground dark:text-white/20 text-[10px]">/ {evaluation.maxScore}</span>
                                                    </div>
                                                ) : "—"}
                                            </td>
                                            <td className="px-8 py-6">
                                                {evaluation ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${evaluation.confidenceScore > 90 ? 'bg-green-500' : evaluation.confidenceScore > 80 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                        <span className="text-xs text-slate-600 dark:text-white/60 font-bold">{evaluation.confidenceScore}%</span>
                                                    </div>
                                                ) : "—"}
                                            </td>
                                            <td className="px-8 py-6 text-end">
                                                {evaluation && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 text-muted-foreground/50 dark:text-white/20 hover:text-primary transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {evaluation.requiresReview && (
                                                            <Button size="sm" className="h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold text-[10px]" onClick={() => router.push(`/dashboard/${tenantId}/review-evaluations?id=${evaluation.id}`)}>
                                                                REVIEW HITL
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                                {!evaluation && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 dark:text-white/20 hover:text-slate-900 dark:hover:text-white">
                                                        <Upload className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 p-6">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> Assigned Batches
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {batches.map(batch => (
                        <div key={batch.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 dark:text-white/60">{batch.name}</span>
                            <Badge variant="outline" className="text-[9px] border-slate-200 dark:border-white/10 text-muted-foreground dark:text-white/40">{batch.studentIds.length} Std</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-glass-heavy border-primary/20 p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Gemini Vision v2.0</p>
                        <p className="text-[10px] text-muted-foreground dark:text-white/40">Active for handwriting extract</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground dark:text-white/20">
                        <span>API Status</span>
                        <span className="text-green-600 dark:text-green-500">Connected</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground dark:text-white/20">
                        <span>Avg Confidence</span>
                        <span className="text-slate-900 dark:text-white">92.4%</span>
                    </div>
                </div>
            </Card>

            <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Teacher Note</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-200/60 leading-relaxed italic">
                    "{test.instructions || "No specific instructions provided for this session."}"
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
