"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getQuestions } from "@/lib/firebase/questions";
import { createQuiz } from "@/lib/firebase/quizzes";
import { Question, QuestionDifficulty } from "@/types/question";
import { QuizStatus } from "@/types/quiz";
import { Loader, Save, Search, Plus, X, GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { functions } from "@/lib/firebase/config";
import { httpsCallable } from "firebase/functions";
import { Sparkles } from "lucide-react";

interface CuratorResponse {
  filters: {
    curriculum?: string;
    domain?: string;
    topic?: string;
    cognitiveDepth?: string;
    scaffoldLevelMin?: number;
    scaffoldLevelMax?: number;
  };
  count: number;
  justification: string;
}

export default function NewQuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: string; points: number }[]
  >([]);
  const [aiInput, setAiInput] = useState("");
  const [isCurating, setIsCurating] = useState(false);

  useEffect(() => {
    const loadQuery = async () => {
      try {
        const res = await getQuestions();
        setAllQuestions(res.questions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuery();
  }, []);

  const handleToggleQuestion = (q: Question) => {
    if (selectedQuestions.find((sq) => sq.id === q.id)) {
      setSelectedQuestions((prev) => prev.filter((sq) => sq.id !== q.id));
    } else {
      setSelectedQuestions((prev) => [...prev, { id: q.id, points: 5 }]); // Default 5 points
    }
  };

  const handlePointsChange = (qId: string, points: number) => {
    setSelectedQuestions((prev) =>
      prev.map((sq) => (sq.id === qId ? { ...sq, points } : sq)),
    );
  };

  const handleSave = async (status: QuizStatus) => {
    if (!title) return toast.error("Title is required");
    if (selectedQuestions.length === 0)
      return toast.error("Select at least one question");

    setSaving(true);
    try {
      await createQuiz({
        title,
        description,
        status,
        questions: selectedQuestions.map((sq, i) => ({
          questionId: sq.id,
          points: sq.points,
          order: i,
        })),
        createdBy: user?.uid || "unknown",
      });
      toast.success(
        status === QuizStatus.PUBLISHED ? "Quiz published!" : "Draft saved!",
      );
      router.push("/dashboard/quizzes");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleAICurate = async () => {
    if (!aiInput.trim())
      return toast.error("Enter a command (e.g., '10 hard algebra questions')");

    setIsCurating(true);

    try {
      const quizCurator = httpsCallable<{ query: string }, CuratorResponse>(
        functions,
        "quizCurator",
      );
      const { data } = await quizCurator({ query: aiInput });

      if (!data || !data.filters) {
        throw new Error("Failed to interpret request");
      }

      const { filters, count, justification } = data;

      // Filter the existing bank based on AI output
      let candidates = [...allQuestions];

      if (filters.domain) {
        const d = filters.domain.toLowerCase();
        candidates = candidates.filter((q) => q.domainId?.toLowerCase() === d);
      }

      if (filters.topic) {
        const t = filters.topic.toLowerCase();
        candidates = candidates.filter((q) => q.topicId?.toLowerCase() === t);
      }

      // Difficulty filtering: use cognitive depth if available, fall back to scaffold level
      if (filters.cognitiveDepth) {
        const depthToDifficulty: Record<string, QuestionDifficulty> = {
          Fluency: QuestionDifficulty.BEGINNER,
          Conceptual: QuestionDifficulty.INTERMEDIATE,
          Application: QuestionDifficulty.ADVANCED,
          Synthesis: QuestionDifficulty.ADVANCED,
        };
        const targetDifficulty = depthToDifficulty[filters.cognitiveDepth];
        if (targetDifficulty) {
          candidates = candidates.filter(
            (q) => q.difficulty === targetDifficulty,
          );
        }
      } else if (filters.scaffoldLevelMin != null) {
        candidates = candidates.filter((q) => {
          if (filters.scaffoldLevelMin! >= 4)
            return q.difficulty === QuestionDifficulty.ADVANCED;
          if (filters.scaffoldLevelMin! <= 2)
            return q.difficulty === QuestionDifficulty.BEGINNER;
          return q.difficulty === QuestionDifficulty.INTERMEDIATE;
        });
      }

      // Shuffle and take count
      const result = candidates
        .sort(() => 0.5 - Math.random())
        .slice(0, count || 5);

      if (result.length === 0) {
        toast.error("No matching questions found in bank.");
        // Still show the AI's reasoning even if no matches
        if (justification) {
          console.log("AI Curator justification:", justification);
          toast(justification, { icon: "🤖", duration: 6000 });
        }
      } else {
        const newSelected = result.map((q, i) => ({
          id: q.id,
          points: 5,
          order: selectedQuestions.length + i,
        }));

        // Filter out already selected
        const uniqueNew = newSelected.filter(
          (n) => !selectedQuestions.some((s) => s.id === n.id),
        );

        if (uniqueNew.length < newSelected.length && uniqueNew.length === 0) {
          toast.success("Those questions are already in your quiz!");
        } else {
          setSelectedQuestions((prev) => [...prev, ...uniqueNew]);
          toast.success(
            `Added ${uniqueNew.length} questions matching your request!`,
          );
          // Show AI reasoning — helps admins understand the curation logic
          if (justification) {
            toast(justification, { icon: "🤖", duration: 5000 });
          }
          setAiInput("");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error(
        "Curator failed to process request. Ensure you are logged in and functions are deployed.",
      );
    } finally {
      setIsCurating(false);
    }
  };

  const filteredQuestions = allQuestions.filter(
    (q) =>
      !searchQuery ||
      (q.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.content || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">New Quiz</h1>
          <p className="text-white/40 text-sm">Assemble a new assessment.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(QuizStatus.DRAFT)}
            disabled={saving}
            className="btn bg-white/5 hover:bg-white/10 text-white"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(QuizStatus.PUBLISHED)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Publish Quiz
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
        {/* LEFT: Quiz Config & Selected Questions */}
        <div className="col-span-5 flex flex-col gap-6 overflow-hidden">
          {/* Metadata Card */}
          <div className="bg-glass p-6 rounded-2xl border border-white/5 space-y-4 shrink-0">
            <div>
              <label className="label">Quiz Title</label>
              <input
                className="input-field text-lg font-bold"
                placeholder="e.g. Mid-Term Algebra Exam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input-field h-24 resize-none"
                placeholder="Instructions for students..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Selected List */}
          <div className="flex-1 bg-glass rounded-2xl border border-white/5 flex flex-col min-h-0">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">
                Selected Questions ({selectedQuestions.length})
              </h3>
              <span className="text-xs font-mono text-primary">
                Total Points:{" "}
                {selectedQuestions.reduce((a, b) => a + b.points, 0)}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {selectedQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 text-sm italic border-2 border-dashed border-white/5 rounded-xl bg-white/2 m-2">
                  <Plus className="w-8 h-8 mb-2 opacity-50" />
                  Select questions from the right panel
                </div>
              ) : (
                selectedQuestions.map((sq) => {
                  const q = allQuestions.find((x) => x.id === sq.id);
                  if (!q) return null;
                  return (
                    <div
                      key={sq.id}
                      className="bg-white/4 p-3.5 rounded-xl border border-white/5 flex gap-3 items-start group hover:border-white/10 transition-colors"
                    >
                      <div className="text-white/20 mt-1 cursor-grab hover:text-white/40">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-white truncate">
                          {q.title || "Untitled"}
                        </p>
                        <p className="text-xs text-white/50 truncate font-mono mt-0.5">
                          {q.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-black/30 rounded-lg border border-white/10 px-2 py-1">
                          <input
                            type="number"
                            className="w-8 bg-transparent text-center text-xs text-white focus:outline-none font-mono font-bold"
                            value={sq.points}
                            onChange={(e) =>
                              handlePointsChange(
                                sq.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                          <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">
                            pts
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleQuestion(q)}
                          className="text-white/20 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Question Picker */}
        <div className="col-span-7 bg-glass rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 space-y-4">
            {/* AI Curator Input */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-3 top-3.5 w-4 h-4 text-primary/60" />
                  <input
                    className="input-field pl-10 bg-black/40 border-primary/20 focus:border-primary/50 text-white placeholder:text-white/20"
                    placeholder="Curate with AI: '10 hard algebra questions'..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAICurate()}
                  />
                </div>
                <button
                  onClick={handleAICurate}
                  disabled={isCurating}
                  className="btn btn-primary px-6 shrink-0 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                >
                  {isCurating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Curate"
                  )}
                </button>
              </div>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
              <input
                className="input-field pl-10"
                placeholder="Search question bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-white/5 bg-white/2 flex items-center gap-4"
                  >
                    <Skeleton className="w-6 h-6 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Skeleton className="w-12 h-4" />
                        <Skeleton className="w-12 h-4" />
                      </div>
                      <Skeleton className="w-1/2 h-5" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = selectedQuestions.some(
                  (sq) => sq.id === q.id,
                );
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group ${
                      isSelected
                        ? "bg-primary/10 border-primary/30"
                        : "bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shadow-sm ${
                        isSelected
                          ? "bg-primary border-primary text-black"
                          : "border-white/10 bg-white/5 group-hover:border-white/20"
                      }`}
                    >
                      {isSelected ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 mb-1.5">
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                            q.difficulty === QuestionDifficulty.BEGINNER
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : q.difficulty === QuestionDifficulty.INTERMEDIATE
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-white/30 uppercase border border-white/10 px-1.5 py-0.5 rounded bg-white/2 tracking-wide">
                          {q.source?.dataset || "Manual"}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 mb-0.5">
                        {q.title || "Untitled Question"}
                      </h4>
                      <p className="text-white/40 text-xs line-clamp-2 font-mono leading-relaxed">
                        {q.content}
                      </p>
                    </div>

                    {(q.images?.length || 0) > 0 && (
                      <div className="w-12 h-12 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white/30 font-bold">
                          IMG
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
