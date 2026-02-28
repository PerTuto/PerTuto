"use client";

import React, { useState, useEffect } from "react";
import { getQuestionsByStatus } from "@/lib/firebase/questions";
import { Question } from "@/types/question";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Sparkles,
  Check,
  Loader as LoaderIcon,
  FileText,
  Download,
} from "lucide-react";
import MathText from "@/components/ui/MathText";
import { toast } from "react-hot-toast";

export default function CuratorPage() {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvedQuestions, setApprovedQuestions] = useState<Question[]>([]);
  const [loadingBank, setLoadingBank] = useState(true);

  // Curated results
  const [curatedQuestions, setCuratedQuestions] = useState<
    (Question & { selected: boolean })[]
  >([]);
  const [parsedFilters, setParsedFilters] = useState<Record<
    string,
    string
  > | null>(null);

  // Load the approved question bank on mount
  useEffect(() => {
    const load = async () => {
      setLoadingBank(true);
      try {
        const result = await getQuestionsByStatus("approved", 200);
        setApprovedQuestions(result.questions);
      } catch (e) {
        console.error("Failed to load approved questions:", e);
        toast.error("Failed to load question bank");
      } finally {
        setLoadingBank(false);
      }
    };
    load();
  }, []);

  // ── Curate: fuzzy match from approved questions ──
  const handleCurate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    const q = query.toLowerCase();

    // Simple keyword-based filtering
    const keywords = q
      .split(/\s+/)
      .filter(
        (w) =>
          ![
            "questions",
            "problems",
            "quiz",
            "set",
            "about",
            "of",
            "the",
            "a",
            "an",
            "for",
          ].includes(w),
      );

    // Extract count if present
    const countMatch = q.match(/(\d+)/);
    const requestedCount = countMatch ? parseInt(countMatch[1]) : 10;

    // Filter approved questions by keyword matching
    const scored = approvedQuestions.map((aq) => {
      const searchable = [
        aq.title,
        aq.content,
        aq.domainId,
        aq.topicId,
        aq.difficulty,
        ...(aq.curricula || []),
        aq.taxonomy?.domain,
        aq.taxonomy?.topic,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      let score = 0;
      keywords.forEach((kw) => {
        if (searchable.includes(kw)) score++;
      });
      return { question: aq, score };
    });

    // Sort by score and take top N
    const filtered = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, requestedCount)
      .map((s) => ({ ...s.question, selected: true }));

    // If no keyword matches, just return random selection
    const fallback =
      filtered.length > 0
        ? filtered
        : approvedQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, requestedCount)
            .map((aq) => ({ ...aq, selected: true }));

    setCuratedQuestions(fallback);
    setParsedFilters({
      query: query,
      matched: `${fallback.length} questions`,
      from: `${approvedQuestions.length} approved`,
    });

    setIsProcessing(false);
  };

  const toggleQuestion = (id: string) => {
    setCuratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q)),
    );
  };

  const selectedCount = curatedQuestions.filter((q) => q.selected).length;

  const handleGenerateQuiz = () => {
    const selected = curatedQuestions.filter((q) => q.selected);
    // For now, generate a simple JSON download
    const quizData = {
      title: `Quiz: ${query}`,
      createdAt: new Date().toISOString(),
      questions: selected.map((q) => ({
        id: q.id,
        content: q.content,
        type: q.type,
        difficulty: q.difficulty,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    const blob = new Blob([JSON.stringify(quizData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Quiz generated with ${selected.length} questions!`);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            AI Curator Engine
          </span>
        </div>
        <h1 className="text-4xl font-black text-gradient mb-4">Quiz Curator</h1>
        <p className="text-lg text-white/40 max-w-xl mx-auto">
          Search your approved question bank in natural language. Select
          questions and generate a quiz.
        </p>
        {!loadingBank && (
          <p className="text-xs text-white/20 mt-2">
            {approvedQuestions.length} approved questions available
          </p>
        )}
      </header>

      {/* Search Input */}
      <form onSubmit={handleCurate} className="mb-12">
        <div className="card p-2 glow-primary">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., '10 hard algebra questions about quadratic equations'"
              className="flex-1 bg-transparent border-none p-4 text-lg font-medium text-white placeholder:text-white/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isProcessing || !query.trim() || loadingBank}
              className={`btn btn-primary px-8 ${
                isProcessing || !query.trim() || loadingBank ? "opacity-50" : ""
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Searching...
                </span>
              ) : (
                "Curate Quiz"
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4 mt-4 text-xs text-white/30 px-4">
          <span className="font-bold uppercase tracking-widest">Try:</span>
          {[
            "5 easy geometry problems",
            "10 algebra questions",
            "hard calculus quiz",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {!parsedFilters && !isProcessing && (
        <EmptyState
          icon={Sparkles}
          title="Ready to Curate?"
          description="Type a description above and let the curator search your approved question bank."
        />
      )}

      {parsedFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in">
          {/* Filters Panel */}
          <div className="lg:col-span-4">
            <div className="card sticky top-8 border-primary/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Search Results
              </h3>

              <div className="space-y-4">
                {Object.entries(parsedFilters).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-white/30">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={selectedCount === 0}
                className={`btn btn-secondary w-full mt-6 flex items-center justify-center gap-2 ${
                  selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Download className="w-4 h-4" />
                Generate Quiz ({selectedCount})
              </button>
            </div>
          </div>

          {/* Questions Panel */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Matched Questions</h2>
              <span className="text-xs text-white/30">
                {selectedCount} / {curatedQuestions.length} selected
              </span>
            </div>

            <div className="space-y-4">
              {curatedQuestions.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No Matches"
                  description="No approved questions matched your query. Try different keywords or extract more questions first."
                />
              ) : (
                curatedQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`card cursor-pointer transition-all ${
                      q.selected
                        ? "border-secondary/40 bg-secondary/5"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          q.selected
                            ? "border-secondary bg-secondary text-white"
                            : "border-white/20"
                        }`}
                      >
                        {q.selected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-white/20">
                            {q.id.slice(0, 8)}
                          </span>
                          <div className="flex gap-2">
                            <span className="tag tag-primary">
                              {q.domainId || "General"}
                            </span>
                            <span className="tag tag-secondary">
                              {q.difficulty}
                            </span>
                            {q.curricula?.map((c) => (
                              <span
                                key={c}
                                className="tag bg-purple-500/10 text-purple-400 border-purple-500/20"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <MathText className="text-base font-medium text-white/80 leading-relaxed">
                          {q.content}
                        </MathText>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
