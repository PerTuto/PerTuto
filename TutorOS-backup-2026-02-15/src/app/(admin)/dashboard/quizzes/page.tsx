"use client";

import React, { useEffect, useState } from "react";
import { Quiz, QuizStatus } from "@/types/quiz";
import { getQuizzes, deleteQuiz } from "@/lib/firebase/quizzes";
import Link from "next/link";
import { Plus, FileText, Trash2, Clock, Award } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent Link click
    if (confirm("Are you sure you want to delete this quiz?")) {
      await deleteQuiz(id);
      await loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Quizzes & Exams
          </h1>
          <p className="text-white/40">
            Compose assessments from your Question Bank.
          </p>
        </div>
        <Link href="/dashboard/quizzes/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Link>
      </header>

      <div className="bg-glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-8 p-8 border-b border-white/5">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-48 h-7" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                  <Skeleton className="w-3/4 h-5" />
                  <div className="flex gap-6">
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-32 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Empty Library"
            description="Your quiz library is currently empty. Start by creating an assessment for your students."
            action={
              <Link href="/dashboard/quizzes/new" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Quiz
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-white/5">
            {quizzes.map((q) => (
              <Link
                href={`/dashboard/quizzes/${q.id}`}
                key={q.id}
                className="block p-8 hover:bg-white/3 transition-all group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                <div className="flex justify-between items-start gap-8">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate">
                        {q.title || "Untitled Quiz"}
                      </h3>
                      <span
                        className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                          q.status === QuizStatus.PUBLISHED
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm mb-6 line-clamp-1 font-medium leading-relaxed">
                      {q.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-6 items-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold text-white/60 tracking-tight">
                          {q.questions.length}{" "}
                          <span className="text-white/20 uppercase text-[10px] ml-0.5">
                            Questions
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/5">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-bold text-white/60 tracking-tight">
                          {q.totalPoints}{" "}
                          <span className="text-white/20 uppercase text-[10px] ml-0.5">
                            Points
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          Modified {new Date(q.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-center">
                    <button
                      onClick={(e) => handleDelete(e, q.id)}
                      className="p-3 bg-red-500/0 hover:bg-red-500/10 text-white/10 hover:text-red-400 rounded-xl transition-all"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
