"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizById, deleteQuiz } from "@/lib/firebase/quizzes";
import { getQuestionById } from "@/lib/firebase/questions";
import { Quiz, QuizStatus } from "@/types/quiz";
import { Question, QuestionDifficulty } from "@/types/question";
import {
  Loader,
  Trash2,
  Clock,
  Award,
  FileText,
  ArrowLeft,
  Printer,
  Share2,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  Shield,
} from "lucide-react";
import Link from "next/link";
import MathText from "@/components/ui/MathText";
import {
  enablePublicSharing,
  disablePublicSharing,
} from "@/lib/firebase/publicQuiz";

export default function QuizDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        // 1. Fetch Quiz
        const q = await getQuizById(id as string);
        if (!q) {
          alert("Quiz not found");
          router.push("/dashboard/quizzes");
          return;
        }
        setQuiz(q);

        // 2. Fetch all linked questions
        // In a real app, you might want to batch this or use a where('id', 'in', ...) query
        // But for now, parallel fetching is fine for small quizzes
        const questionPromises = q.questions.map((qConfig) =>
          getQuestionById(qConfig.questionId),
        );
        const fetchedQuestions = await Promise.all(questionPromises);
        setQuestions(fetchedQuestions.filter((x) => x !== null) as Question[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, router]);

  const handleDelete = async () => {
    if (confirm("Delete this quiz completely?")) {
      await deleteQuiz(id as string);
      router.push("/dashboard/quizzes");
    }
  };

  const getPublicUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/play/${quiz?.publicSlug}`;
  };

  const handleGenerateLink = async () => {
    if (!quiz) return;
    setShareLoading(true);
    try {
      const slug = await enablePublicSharing(
        quiz.id,
        quiz.title,
        usePassword ? password : undefined,
      );
      setQuiz({ ...quiz, publicSlug: slug, isPublic: true });
    } catch (error) {
      console.error("Failed to generate link:", error);
    } finally {
      setShareLoading(false);
    }
  };

  const handleDisableSharing = async () => {
    if (!quiz) return;
    setShareLoading(true);
    try {
      await disablePublicSharing(quiz.id);
      setQuiz({ ...quiz, isPublic: false });
    } catch (error) {
      console.error("Failed to disable sharing:", error);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPublicUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center text-white/40">
        <Loader className="w-6 h-6 animate-spin mr-2" /> Loading Exam...
      </div>
    );

  if (!quiz) return null;

  return (
    <div className="max-w-5xl mx-auto animate-in pb-20">
      <Link
        href="/dashboard/quizzes"
        className="inline-flex items-center text-white/40 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-white">{quiz.title}</h1>
            <span
              className={`px-2 py-0.5 rounded textxs font-bold uppercase border ${
                quiz.status === QuizStatus.PUBLISHED
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}
            >
              {quiz.status}
            </span>
          </div>
          <p className="text-white/60 text-lg max-w-2xl">{quiz.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowShareDialog(true)}
            className="btn bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {quiz.isPublic ? "Manage Link" : "Share"}
          </button>
          <button
            onClick={() => window.print()}
            className="btn bg-white/5 hover:bg-white/10 text-white"
          >
            <Printer className="w-4 h-4 mr-2" /> Print PDF
          </button>
          <button
            onClick={handleDelete}
            className="btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-glass border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider">
              Questions
            </p>
            <p className="text-2xl font-black text-white">{questions.length}</p>
          </div>
        </div>
        <div className="bg-glass border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider">
              Total Points
            </p>
            <p className="text-2xl font-black text-white">{quiz.totalPoints}</p>
          </div>
        </div>
        <div className="bg-glass border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider">
              Time Limit
            </p>
            <p className="text-2xl font-black text-white">
              {quiz.timeLimitMinutes || "None"}
            </p>
          </div>
        </div>
      </div>

      {/* Question List (Preview Mode) */}
      <div className="space-y-8 no-print">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">
          Exam Preview
        </h2>

        {questions.map((q, index) => {
          const config = quiz.questions.find((c) => c.questionId === q.id);
          return (
            <div
              key={q.id}
              className="bg-glass border border-white/5 rounded-2xl overflow-hidden"
            >
              <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                    {index + 1}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      q.difficulty === QuestionDifficulty.BEGINNER
                        ? "bg-green-500/10 text-green-400"
                        : q.difficulty === QuestionDifficulty.INTERMEDIATE
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
                <div className="font-mono text-white/40 text-sm">
                  {config?.points || 0} Points
                </div>
              </div>

              <div className="p-8">
                {/* Question Content */}
                <div className="prose prose-invert max-w-none">
                  <MathText
                    as="p"
                    className="text-lg text-white/90 leading-relaxed font-serif whitespace-pre-wrap"
                  >
                    {q.content}
                  </MathText>
                </div>

                {/* Images */}
                {q.images && q.images.length > 0 && (
                  <div className="mt-6 flex gap-4 overflow-x-auto p-2">
                    {q.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Question Diagram"
                        className="h-48 rounded-lg border border-white/10"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/5 no-print">
                  <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-widest">
                    Answer Key
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg font-mono text-green-400 text-sm">
                    <MathText>
                      {q.explanation || q.correctAnswer || "No answer provided"}
                    </MathText>
                  </div>
                  <p className="mt-2 text-xs text-white/30">
                    Source: {q.source.dataset} (License:{" "}
                    {q.source.license || "Unknown"})
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Print-Only Version (Simplified for paper) */}
      <div className="hidden print:block">
        <div className="text-center mb-12 border-b-2 border-black pb-8">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter">
            {quiz.title}
          </h1>
          <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex justify-center gap-12 text-sm font-bold">
            <span>Name: ______________________</span>
            <span>Date: ______________________</span>
            <span>Points: ____ / {quiz.totalPoints}</span>
          </div>
        </div>

        <div className="space-y-0">
          {questions.map((q, index) => {
            const config = quiz.questions.find((c) => c.questionId === q.id);
            return (
              <div key={q.id} className="quiz-question-container">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-lg">
                    Question {index + 1}
                  </span>
                  <span className="text-sm italic">
                    {config?.points || 0} pts
                  </span>
                </div>

                <div className="text-lg leading-relaxed mb-6">{q.content}</div>

                {q.images && q.images.length > 0 && (
                  <div className="flex gap-4 mb-6">
                    {q.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="h-40 border border-gray-200"
                      />
                    ))}
                  </div>
                )}

                <div className="h-24 border-b border-gray-100 mb-4">
                  <p className="text-[10px] text-gray-400 italic">
                    Work area / Notes:
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Key (on new page) */}
        <div className="page-break-before-always mt-20 pt-10 border-t-4 border-double border-black">
          <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest">
            Answer Key
          </h2>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="answer-key-section p-4 rounded-lg bg-gray-50 border border-gray-200"
              >
                <p className="font-bold mb-2">Question {index + 1}:</p>
                <div className="font-serif">
                  {q.explanation || q.correctAnswer || "No answer provided"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card max-w-md w-full p-8 mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Share Quiz</h2>
              </div>
              <button
                onClick={() => setShowShareDialog(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quiz.isPublic && quiz.publicSlug ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Public Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getPublicUrl()}
                      className="input-field text-sm flex-1"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="btn bg-primary/20 hover:bg-primary/30 text-primary min-w-[90px]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/30">
                  Anyone with this link can take the quiz without signing in.
                </p>

                <div className="border-t border-white/5 pt-4">
                  <button
                    onClick={handleDisableSharing}
                    disabled={shareLoading}
                    className="btn bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 w-full"
                  >
                    {shareLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      "Disable Public Link"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-white/40 text-sm">
                  Generate a public link that students can use to take this quiz
                  without needing an account.
                </p>

                <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white/40" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Password Protection
                      </p>
                      <p className="text-xs text-white/30">
                        Require a password to access
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUsePassword(!usePassword)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      usePassword ? "bg-primary" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        usePassword ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {usePassword && (
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password"
                    className="input-field"
                  />
                )}

                <button
                  onClick={handleGenerateLink}
                  disabled={shareLoading || (usePassword && !password)}
                  className="btn btn-primary w-full py-4"
                >
                  {shareLoading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <LinkIcon className="w-4 h-4 mr-2" />
                  )}
                  Generate Public Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
