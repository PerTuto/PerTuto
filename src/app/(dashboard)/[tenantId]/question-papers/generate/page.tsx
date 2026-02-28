
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getQuestions, 
  getCourses,
  createQuestionPaper,
  getSubjects
} from "@/lib/firebase/services";
import { Question, Course, Subject, QuestionPaper, PaperSection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  ListChecks,
  FileText,
  Loader2,
  Trash2,
  ArrowRight,
  Target,
  BarChart3,
  Dna,
  Printer,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { functions } from "@/lib/firebase/client-app";
import { httpsCallable } from "firebase/functions";

export default function QuestionPaperGenerator() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Settings
  const [config, setConfig] = useState({
    title: "",
    courseId: "",
    subjectId: "",
    duration: 60,
    difficulty: "MEDIUM" as const,
  });

  // Syllabus (Chapters)
  const [chapters, setChapters] = useState<{id: string, name: string, weightage: number}[]>([]);
  
  // Constraints
  const [constraints, setConstraints] = useState([
    { type: "MCQ_SINGLE", count: 10, marksEach: 1 },
    { type: "FREE_RESPONSE", count: 2, marksEach: 5 },
  ]);

  // Result
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const [c, s] = await Promise.all([getCourses(tenantId), getSubjects(tenantId)]);
        setCourses(c);
        setSubjects(s);
      } catch (e) {
        toast({ title: "Error", description: "Failed to initialize generator", variant: "destructive" });
      }
    }
    init();
  }, [tenantId]);

  const addConstraint = () => {
    setConstraints([...constraints, { type: "MCQ_SINGLE", count: 5, marksEach: 2 }]);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 1. Fetch available questions for filters
      const { questions } = await getQuestions(tenantId);
      
      // 2. Call Genkit Paper Generator
      const paperGenerator = httpsCallable(functions, 'paperGenerator');
      const result = await paperGenerator({
        tenantId,
        courseId: config.courseId,
        subjectId: config.subjectId,
        title: config.title,
        chapters: chapters,
        constraints: constraints,
        difficulty: config.difficulty,
        totalDuration: config.duration,
        availableQuestions: questions
      });

      setGeneratedPaper((result.data as any).paper);
      setStep(3);
    } catch (error) {
      console.error(error);
      toast({ title: "Generation Failed", description: "The AI could not assemble a balanced paper.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
        const { questions } = await getQuestions(tenantId);
        const paperExport = httpsCallable(functions, 'paperExport');
        const result = await paperExport({
            tenantId,
            paper: generatedPaper,
            questions: questions
        });
        
        const url = (result.data as any).pdfUrl;
        window.open(url, '_blank');
        toast({ title: "Exported", description: "PDF generated and opened in new tab." });
    } catch (error) {
        toast({ title: "Export Failed", description: "PDF generation failed. Check if puppeteer is installed on functions.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        await createQuestionPaper(tenantId, {
            ...generatedPaper,
            status: 'draft',
            generationMode: 'ai-assisted',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        toast({ title: "Saved", description: "Question paper added to repository" });
        router.push(`/dashboard/${tenantId}/question-papers`);
    } catch (error) {
        toast({ title: "Error", description: "Failed to save paper", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> AI Paper Wizard
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Step {step} of 3: {step === 1 ? 'Core Settings' : step === 2 ? 'Question Distribution' : 'Review & Finalize'}</p>
        </div>

        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-slate-200 dark:bg-white/5'}`} />
            ))}
        </div>
      </div>

      {step === 1 && (
        <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
            <CardTitle className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> 1. Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Paper Title</Label>
                        <Input 
                            placeholder="e.g. End of Term Geometry Exam" 
                            className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl text-lg"
                            value={config.title}
                            onChange={(e) => setConfig({...config, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Course / Level</Label>
                        <Select value={config.courseId} onValueChange={(val) => setConfig({...config, courseId: val})}>
                            <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                                {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Duration (Minutes)</Label>
                        <Input 
                            type="number"
                            className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl"
                            value={config.duration}
                            onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Target Difficulty</Label>
                        <Select value={config.difficulty} onValueChange={(val: any) => setConfig({...config, difficulty: val})}>
                            <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                                <SelectItem value="EASY">Easy (Conceptual)</SelectItem>
                                <SelectItem value="MEDIUM">Medium (Mixed)</SelectItem>
                                <SelectItem value="HARD">Hard (Synthesis)</SelectItem>
                                <SelectItem value="MIXED">Balanced (Standard)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/40 tracking-widest">Chapter Weightage (Syllabus)</Label>
                    <Badge variant="outline" className="text-primary border-primary/20">{chapters.length} Chapters</Badge>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {/* Simplified chapter weightage for now - normally this would load from taxonomy */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <span className="text-slate-600 dark:text-white/60">Logic & Set Theory</span>
                        <div className="flex items-center gap-4 w-64">
                            <Slider defaultValue={[20]} max={100} step={1} className="flex-1" />
                            <span className="text-xs font-bold text-primary w-12 text-end">20%</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between text-muted-foreground dark:text-white/20">
                        <span>Click to add more chapters from the curriculum...</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-8 flex justify-end">
                <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-12 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                    onClick={() => setStep(2)}
                >
                    Next Logic <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
            <CardTitle className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" /> 2. Question Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
                {constraints.map((c, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-end p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group relative animate-in slide-in-from-right duration-300">
                        <div className="space-y-2">
                             <Label className="text-[8px] uppercase font-bold text-muted-foreground dark:text-white/40">Question Type</Label>
                             <Select value={c.type} onValueChange={(val) => {
                                 const next = [...constraints];
                                 next[i].type = val;
                                 setConstraints(next);
                             }}>
                                    <SelectTrigger className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                                        <SelectItem value="MCQ_SINGLE">MCQ (Single)</SelectItem>
                                        <SelectItem value="MCQ_MULTI">MCQ (Multiple)</SelectItem>
                                        <SelectItem value="FREE_RESPONSE">Subjective (SA)</SelectItem>
                                        <SelectItem value="PASSAGE_BASED">Case Study</SelectItem>
                                    </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                             <Label className="text-[8px] uppercase font-bold text-muted-foreground dark:text-white/40">Count</Label>
                             <Input 
                                type="number"
                                className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-lg"
                                value={c.count}
                                onChange={(e) => {
                                    const next = [...constraints];
                                    next[i].count = parseInt(e.target.value);
                                    setConstraints(next);
                                }}
                             />
                        </div>
                        <div className="space-y-2">
                             <Label className="text-[8px] uppercase font-bold text-muted-foreground dark:text-white/40">Marks Each</Label>
                             <Input 
                                type="number"
                                className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-lg"
                                value={c.marksEach}
                                onChange={(e) => {
                                    const next = [...constraints];
                                    next[i].marksEach = parseInt(e.target.value);
                                    setConstraints(next);
                                }}
                             />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Badge variant="outline" className="h-10 px-4 flex items-center gap-2 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 font-black text-slate-900 dark:text-white">
                                {c.count * c.marksEach} <span className="text-[8px] text-muted-foreground dark:text-white/40 mt-0.5">PTS</span>
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground dark:text-white/20 hover:bg-slate-200 hover:text-red-500 hover:dark:text-red-500 transition-colors" onClick={() => removeConstraint(i)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button variant="outline" className="w-full h-12 border-dashed border-slate-300 dark:border-white/10 text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5" onClick={addConstraint}>
                    <Plus className="w-4 h-4 me-2" /> Add Question Group
                </Button>
            </div>

            <div className="pt-8 flex justify-between">
                <Button variant="ghost" className="text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 me-2" /> Back to Config
                </Button>
                <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-12 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                    disabled={loading}
                    onClick={handleGenerate}
                >
                    {loading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Dna className="w-4 h-4 me-2" />}
                    Generate Exam Paper
                </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && generatedPaper && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
           <Card className="bg-glass-heavy border-primary/30 shadow-2xl shadow-primary/10">
              <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary text-white font-black px-3 py-1">READY FOR REVIEW</Badge>
                    <span className="text-xs text-muted-foreground dark:text-white/40 flex items-center gap-1.5"><Target className="w-3 h-3" /> Balanced chapters & difficulty</span>
                </div>
                <CardTitle className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">
                    {generatedPaper.title}
                </CardTitle>
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-white/60 font-bold">
                        <FileText className="w-4 h-4 text-primary" /> {generatedPaper.totalMarks} Marks
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-white/60 font-bold">
                        <Clock className="w-4 h-4 text-primary" /> {generatedPaper.duration} Mins
                    </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-200 dark:divide-white/5">
                   {generatedPaper.sections.map((section: any, idx: number) => (
                       <div key={idx} className="p-8 space-y-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <div className="flex items-center justify-between">
                               <h3 className="text-xl font-black font-outfit text-slate-900 dark:text-white/80 group-hover:text-primary transition-colors">{section.title}</h3>
                               <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-muted-foreground dark:text-white/40">{section.questionIds.length} Questions • {section.totalMarks} pts</Badge>
                           </div>
                           <p className="text-xs text-muted-foreground dark:text-white/40 leading-relaxed italic">{section.instructions}</p>
                           
                           <div className="space-y-2 mt-4">
                               {section.questionIds.map((qid: string, qidx: number) => (
                                   <div key={qid} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-600 dark:text-white/60">
                                       <span className="flex items-center gap-3">
                                           <span className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">{qidx + 1}</span>
                                           Question ID: {qid}
                                       </span>
                                       <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground dark:text-white/20 hover:text-primary transition-all">Swap AI</Button>
                                   </div>
                               ))}
                           </div>
                       </div>
                   ))}
                </div>
              </CardContent>
           </Card>

           <div className="flex justify-between items-center text-slate-900 dark:text-white p-4">
                <Button variant="ghost" className="text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 me-2" /> Start Over
                </Button>
                <div className="flex gap-4">
                    <Button 
                        variant="outline" 
                        className="border-slate-300 dark:border-white/10 h-12 px-8 rounded-xl font-bold bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Printer className="w-4 h-4 me-2" />}
                        Full Preview
                    </Button>
                    <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-12 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 scale-105 transition-transform"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 me-2" />}
                        Publish Paper
                    </Button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
}
