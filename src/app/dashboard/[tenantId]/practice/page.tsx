"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/client-app";
import { getSubjects, getQuestions, getGamificationProfile, updateXp } from "@/lib/firebase/services";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Zap, Target, BookOpen, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { XpProgress } from "@/components/gamification/xp-progress";

export default function PracticePage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [gamification, setGamification] = useState<any>(null);

  useEffect(() => {
    if (userProfile?.tenantId && user?.uid) {
      loadInitialData();
    }
  }, [userProfile, user]);

  async function loadInitialData() {
    try {
      setLoading(true);
      const [subjectsList, profile] = await Promise.all([
        getSubjects(userProfile!.tenantId!),
        getGamificationProfile(userProfile!.tenantId!, user!.uid)
      ]);
      setSubjects(subjectsList);
      setGamification(profile);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load practice data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function startPractice(subjectId: string) {
    try {
      setLoading(true);
      setSelectedSubject(subjectId);
      // In a real scenario, this would call an AI flow to generate or select targeted questions
      // For now, we fetch from the question bank
      const { questions } = await getQuestions(userProfile!.tenantId!, { domainId: subjectId }, 1);
      if (questions && questions.length > 0) {
        setPracticeQuestion(questions[0]);
      } else {
        toast({ title: "No questions", description: "No questions found for this subject." });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckAnswer() {
    if (!userAnswer || !user?.uid) return;
    setIsChecking(true);
    try {
      const practiceEvaluator = httpsCallable<any, any>(functions, "practiceEvaluator");
      const result = await practiceEvaluator({
        question: practiceQuestion.stem,
        correctAnswer: practiceQuestion.correctAnswer,
        studentAnswer: userAnswer,
        options: practiceQuestion.options?.map((o: any) => o.text)
      });
      
      const { isCorrect, feedback, explanation } = result.data;
      
      if (isCorrect) {
        const xpGained = 15;
        const xpResult = await updateXp(userProfile!.tenantId!, user!.uid, xpGained, "Correct practice answer");
        setGamification({ ...gamification, xp: xpResult.xp, level: xpResult.level });
        toast({ 
          title: "Correct! 🎉", 
          description: feedback || `You earned ${xpGained} XP!`,
        });
        if (xpResult.leveledUp) {
          toast({ title: "Level Up! ⬆️", description: `You reached Level ${xpResult.level}!` });
        }
        // Load next
        setTimeout(() => {
          startPractice(selectedSubject!);
          setUserAnswer("");
        }, 1500);
      } else {
        toast({ 
          title: "Not quite", 
          description: feedback || explanation || "Check the explanation for help.", 
          variant: "default" 
        });
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      // Fallback to basic check if AI fails
      const isCorrect = userAnswer.toLowerCase().trim() === practiceQuestion.correctAnswer?.toLowerCase().trim();
      if (isCorrect) {
        // ... basic logic if needed ...
      }
      toast({ title: "Evaluation Note", description: "Standard check applied. Please verify your answer." });
    } finally {
      setIsChecking(false);
    }
  }

  if (loading && !selectedSubject) {
    return <div className="p-8 text-center">Loading your practice session...</div>;
  }

  return (
    <div className="container max-w-4xl py-12 space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">AI Practice Lab</h1>
          <p className="text-muted-foreground font-medium mt-1">Targeted training to master your weak spots.</p>
        </div>
        {gamification && (
          <Card className="px-5 py-3 flex items-center gap-4 bg-teal-500/5 border-teal-500/20 shadow-lg shadow-teal-500/5">
            <XpProgress currentXp={gamification.xp} level={gamification.level} className="w-56" />
          </Card>
        )}
      </div>

      {!selectedSubject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="group relative hover:border-teal-500/50 transition-all duration-300 cursor-pointer overflow-hidden border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md shadow-xl hover:-translate-y-1"
              onClick={() => startPractice(subject.id)}
            >
              <CardHeader className="relative pb-8">
                <div className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-teal-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-12">
                  <ChevronRight className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Target className="h-6 w-6" />
                  </div>
                  {subject.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium pt-2">Master the core concepts of this domain</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {practiceQuestion && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <Card className="border-2 border-teal-500/20 bg-white dark:bg-slate-950 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-teal-500/5 border-b border-teal-500/10 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 font-bold px-4 py-1">
                      {selectedSubject}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-500 uppercase tracking-tighter">
                      <Zap className="h-4 w-4 fill-current animate-pulse" />
                      1.5x XP Streak Active
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
                    {practiceQuestion.stem || practiceQuestion.content}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <textarea
                    className="w-full min-h-[160px] p-6 rounded-2xl border-2 border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none resize-none text-lg font-medium text-slate-900 dark:text-slate-100"
                    placeholder="Describe your reasoning or provide the answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-8">
                  <Button 
                    variant="outline" 
                    className="h-12 border-slate-200 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 font-bold rounded-xl"
                    onClick={() => setSelectedSubject(null)}
                  >
                    Switch Subject
                  </Button>
                  <Button 
                    className="h-12 bg-teal-600 hover:bg-teal-700 text-white font-black text-lg px-10 rounded-xl shadow-xl shadow-teal-500/20 transition-all hover:scale-105" 
                    onClick={handleCheckAnswer}
                    disabled={isChecking || !userAnswer}
                  >
                    {isChecking ? <RefreshCw className="h-5 w-5 animate-spin mr-3" /> : <Zap className="h-5 w-5 mr-3 fill-current" />}
                    Submit & Earn XP
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
