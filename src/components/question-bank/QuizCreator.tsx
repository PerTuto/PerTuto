
"use client";

import React, { useState, useMemo } from "react";
import { Quiz, Question, QuizQuestionConfig, QuestionType } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Sparkles, 
  Search, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Settings2,
  ListChecks,
  Save,
  Loader2,
  Database
} from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/client-app";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import QuestionCard from "./QuestionCard";
import { getQuestions } from "../../lib/firebase/services/questions";
import { useParams } from "next/navigation";

interface QuizCreatorProps {
  initialData?: Partial<Quiz>;
  onSubmit: (quiz: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type Step = "BASIC_INFO" | "SELECT_QUESTIONS" | "REVIEW";

export default function QuizCreator({
  initialData,
  onSubmit,
  onCancel,
  loading: isSubmitting = false,
}: QuizCreatorProps) {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("BASIC_INFO");
  
  // State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [settings, setSettings] = useState({
    timeLimit: initialData?.settings?.timeLimit || 30,
    shuffleQuestions: initialData?.settings?.shuffleQuestions ?? true,
    showResults: initialData?.settings?.showResults ?? true,
    allowRetake: initialData?.settings?.allowRetake ?? false,
  });
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);
  
  const [selectedQuestionConfigs, setSelectedQuestionConfigs] = useState<QuizQuestionConfig[]>(
    initialData?.questions || []
  );
  
  // Question Bank State
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [curatePrompt, setCuratePrompt] = useState("");
  const [isCurating, setIsCurating] = useState(false);

  const fetchBank = async () => {
    setIsBankLoading(true);
    try {
      const { questions: data } = await getQuestions(tenantId);
      setBankQuestions(data);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load bank", variant: "destructive" });
    } finally {
      setIsBankLoading(false);
    }
  };

  const toggleQuestion = (question: Question) => {
    setSelectedQuestionConfigs(prev => {
      const exists = prev.find(p => p.questionId === question.id);
      if (exists) {
        return prev.filter(p => p.questionId !== question.id);
      } else {
        return [...prev, {
          questionId: question.id,
          points: 1, // Default
          order: prev.length
        }];
      }
    });
  };

  const handleCurate = async () => {
    if (!curatePrompt) return;
    setIsCurating(true);
    try {
      const quizCurator = httpsCallable<any, any>(functions, "quizCurator");
      const result = await quizCurator({
        tenantId,
        request: curatePrompt,
      });
      
      if (result.data?.questions) {
        // Map curated questions to bank
        const curatedIds = result.data.questions.map((q: any) => q.id);
        const newConfigs: QuizQuestionConfig[] = result.data.questions.map((q: any, i: number) => ({
          questionId: q.id,
          points: q.weight || 1,
          order: selectedQuestionConfigs.length + i
        }));
        
        setSelectedQuestionConfigs(prev => [...prev, ...newConfigs]);
        toast({
          title: "AI Selection Complete",
          description: `Picked ${newConfigs.length} questions based on your request.`,
        });
        setCuratePrompt("");
      }
    } catch (error) {
      console.error("Curation error:", error);
      toast({ title: "AI Error", description: "Failed to curate questions", variant: "destructive" });
    } finally {
      setIsCurating(false);
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast({ title: "Missing Title", description: "Please enter a quiz title", variant: "destructive" });
      return;
    }
    if (selectedQuestionConfigs.length === 0) {
      toast({ title: "No Questions", description: "Please add at least one question", variant: "destructive" });
      return;
    }

    await onSubmit({
      title,
      description,
      questions: selectedQuestionConfigs,
      totalPoints: selectedQuestionConfigs.reduce((s, q) => s + q.points, 0),
      status: "DRAFT",
      settings,
      isPublic,
      createdBy: "system", // Should be actual user ID
    });
  };

  const renderStepIcon = (s: Step, current: Step) => {
    if (s === "BASIC_INFO") return <Settings2 className={`w-4 h-4 ${current === s ? "text-teal-600 dark:text-teal-400" : "text-slate-300 dark:text-white/20"}`} />;
    if (s === "SELECT_QUESTIONS") return <Database className={`w-4 h-4 ${current === s ? "text-teal-600 dark:text-teal-400" : "text-slate-300 dark:text-white/20"}`} />;
    return <ListChecks className={`w-4 h-4 ${current === s ? "text-teal-600 dark:text-teal-400" : "text-slate-300 dark:text-white/20"}`} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-10 py-6">
        {(["BASIC_INFO", "SELECT_QUESTIONS", "REVIEW"] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div 
              className={`flex items-center gap-3 cursor-pointer transition-all ${step === s ? "opacity-100 scale-105" : "opacity-50 hover:opacity-80"}`}
              onClick={() => (i < (["BASIC_INFO", "SELECT_QUESTIONS", "REVIEW"] as Step[]).indexOf(step) ? setStep(s) : null)}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${step === s ? "bg-teal-500/10 border-teal-500 text-teal-600 shadow-lg shadow-teal-500/10" : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40"}`}>
                {renderStepIcon(s, step)}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${step === s ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-white/40"}`}>
                {s.replace("_", " ")}
              </span>
            </div>
            {i < 2 && <div className="h-px w-16 bg-slate-200 dark:bg-white/10" />}
          </React.Fragment>
        ))}
      </div>

      {step === "BASIC_INFO" && (
        <Card className="bg-white/80 dark:bg-slate-950 backdrop-blur-xl border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl rounded-3xl">
          <CardHeader className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 py-8">
            <CardTitle className="font-outfit text-3xl font-black text-slate-900 dark:text-white">Quiz Fundamentals</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Define the core details and visibility of your quiz.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[11px] uppercase font-black text-slate-400 dark:text-white/40 tracking-widest pl-1">Quiz Title</Label>
                  <Input 
                    placeholder="e.g. Mid-Term Calculus Mastery" 
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-14 rounded-2xl text-xl font-bold shadow-sm focus:ring-4 focus:ring-teal-500/10 text-slate-900 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] uppercase font-black text-slate-400 dark:text-white/40 tracking-widest pl-1">Description</Label>
                  <Textarea 
                    placeholder="Provide context for the students..." 
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 min-h-[160px] rounded-2xl p-4 text-base font-medium shadow-sm focus:ring-4 focus:ring-teal-500/10 text-slate-900 dark:text-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-6 bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-6">Advanced Session Logic</h4>
                <div className="space-y-4">
                  {[
                    { label: "Shuffle Questions", key: "shuffleQuestions", desc: "Randomize question order for each student" },
                    { label: "Instant Results", key: "showResults", desc: "Show correct answers immediately after submission" },
                    { label: "Allow Retakes", key: "allowRetake", desc: "Enable students to attempt the quiz again" },
                  ].map((s) => (
                    <div key={s.key} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm transition-all hover:border-teal-500/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-black text-slate-900 dark:text-white">{s.label}</Label>
                        <p className="text-[11px] text-muted-foreground font-medium">{s.desc}</p>
                      </div>
                      <Switch 
                        checked={(settings as any)[s.key]} 
                        onCheckedChange={(val) => setSettings(prev => ({ ...prev, [s.key]: val }))}
                      />
                    </div>
                  ))}
                  
                  <div className="space-y-3 pt-4">
                    <Label className="text-[11px] uppercase font-black text-slate-400 dark:text-white/40 tracking-widest pl-1">Time Limit (Minutes)</Label>
                    <Input 
                      type="number"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 h-12 rounded-xl text-lg font-bold shadow-sm focus:ring-4 focus:ring-teal-500/10 text-slate-900 dark:text-white"
                      value={settings.timeLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10 border-t border-slate-100 dark:border-white/5">
              <Button variant="ghost" onClick={onCancel} className="text-muted-foreground font-bold hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl h-12">Cancel</Button>
              <Button 
                onClick={() => setStep("SELECT_QUESTIONS")} 
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white rounded-2xl px-10 h-12 font-black shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5"
              >
                Assemble Questions <ChevronRight className="w-5 h-5 ms-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "SELECT_QUESTIONS" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Question Bank Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-white/80 dark:bg-slate-950 backdrop-blur-xl border-slate-200 dark:border-white/5 h-full flex flex-col shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Database className="w-4 h-4" /> Bank Repository
                </CardTitle>
                <div className="relative mt-6">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search bank..." 
                    className="ps-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-sm rounded-xl focus:ring-4 focus:ring-teal-500/10 text-slate-900 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => bankQuestions.length === 0 && fetchBank()}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px] scrollbar-hide pt-6">
                {isBankLoading ? (
                  <div className="py-16 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400">Indexing...</p>
                  </div>
                ) : bankQuestions.filter(q => q.stem.toLowerCase().includes(search.toLowerCase())).map(q => (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                      selectedQuestionConfigs.find(p => p.questionId === q.id) 
                        ? "bg-teal-500/5 border-teal-500 shadow-teal-500/5" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-teal-500/30"
                    }`}
                    onClick={() => toggleQuestion(q)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <p className="text-xs font-medium text-slate-700 dark:text-white/70 line-clamp-3 leading-relaxed">{q.stem}</p>
                      {selectedQuestionConfigs.find(p => p.questionId === q.id) && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Assembly Area */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="bg-teal-600/5 border-2 border-teal-500/20 rounded-3xl overflow-hidden shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="flex-1 relative group">
                    <Sparkles className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
                    <Input 
                      placeholder="Use AI to curate: 'Pick 5 hard questions about integration from IB curriculum'" 
                      className="ps-12 bg-white dark:bg-slate-900 border-teal-500/30 h-14 rounded-2xl text-base font-medium shadow-lg focus:ring-4 focus:ring-teal-500/10 text-slate-900 dark:text-white"
                      value={curatePrompt}
                      onChange={(e) => setCuratePrompt(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCurate} 
                    disabled={isCurating || !curatePrompt}
                    className="h-14 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white rounded-2xl px-10 font-black shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
                  >
                    {isCurating ? <Loader2 className="w-5 h-5 animate-spin" /> : "AI Curate"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-2xl font-black font-outfit text-slate-900 dark:text-white flex items-center gap-3">
                  Selected Questions 
                  <Badge className="bg-teal-500 text-white font-black">{selectedQuestionConfigs.length}</Badge>
                </h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Drag handle to reorder hierarchy</p>
              </div>

              {selectedQuestionConfigs.length === 0 ? (
                <div className="py-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center space-y-6 bg-slate-50/50 dark:bg-white/5 opacity-60">
                  <div className="p-4 rounded-full bg-slate-200 dark:bg-white/10">
                    <Database className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-lg font-bold text-slate-500 italic">Select questions from the repository or use AI curation</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedQuestionConfigs.map((config, idx) => {
                    const q = bankQuestions.find(bq => bq.id === config.questionId);
                    if (!q) return null;
                    return (
                      <div key={config.questionId} className="flex gap-6 group animate-in slide-in-from-left-4 duration-500">
                        <div className="shrink-0 flex flex-col items-center gap-3 pt-8">
                          <GripVertical className="w-5 h-5 text-slate-300 dark:text-white/10 group-hover:text-teal-500 cursor-grab transition-colors" />
                          <span className="h-8 w-8 rounded-full border-2 border-slate-100 dark:border-white/10 flex items-center justify-center text-xs font-black text-slate-400 dark:text-white/30">{idx + 1}</span>
                        </div>
                        <div className="flex-1 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                          <QuestionCard question={q} showActions={false} />
                        </div>
                        <div className="shrink-0 pt-8">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            onClick={() => toggleQuestion(q)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-10 border-t border-slate-100 dark:border-white/5">
              <Button variant="ghost" onClick={() => setStep("BASIC_INFO")} className="h-12 px-6 font-bold text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all">
                <ChevronLeft className="w-5 h-5 me-3" /> Back to Setup
              </Button>
              <Button 
                onClick={() => setStep("REVIEW")} 
                disabled={selectedQuestionConfigs.length === 0}
                className="h-12 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white rounded-xl px-12 font-black shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5"
              >
                Review & Publish <ChevronRight className="w-5 h-5 ms-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "REVIEW" && (
        <Card className="bg-white/80 dark:bg-slate-950 backdrop-blur-xl border-slate-200 dark:border-white/5 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
          <CardHeader className="bg-teal-500/5 p-10 border-b border-teal-500/10">
            <CardTitle className="text-4xl font-black text-slate-900 dark:text-white">Final Review</CardTitle>
            <CardDescription className="text-lg font-medium text-teal-700/60 dark:text-teal-400/60">Confirm everything is perfect before publishing to the center.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 space-y-8 shadow-inner">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">{title}</h2>
                  <p className="text-xl text-muted-foreground italic leading-relaxed max-w-2xl">{description || "No description provided."}</p>
                </div>
                <div className="text-end bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                  <div className="text-5xl font-black text-teal-600 dark:text-teal-500">{selectedQuestionConfigs.length}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Questions Selected</div>
                </div>
              </div>
              <div className="flex gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 font-bold px-6 py-2 rounded-full text-sm">
                  {settings.timeLimit} Minutes Duration
                </Badge>
                <Badge className="bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/60 font-bold px-6 py-2 rounded-full text-sm">
                  {settings.shuffleQuestions ? "Randomized Order" : "Linear Order"}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end gap-6">
              <Button variant="ghost" onClick={() => setStep("SELECT_QUESTIONS")} className="h-14 px-8 font-black text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-all">
                <ChevronLeft className="w-5 h-5 me-3" /> Back to Assembly
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white rounded-2xl px-16 h-14 text-xl font-black shadow-2xl shadow-teal-500/30 transition-all hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 me-4" />}
                Publish Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
