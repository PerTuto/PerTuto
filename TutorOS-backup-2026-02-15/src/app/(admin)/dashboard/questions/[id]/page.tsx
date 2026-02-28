"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuestionById, updateQuestion } from "@/lib/firebase/questions";
import { Question } from "@/types/question";
import QuestionForm from "@/components/questions/QuestionForm";
import FigureRenderer from "@/components/questions/FigureRenderer";
import { Loader, ChevronLeft, Edit, Clock, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const data = await getQuestionById(id);
        setQuestion(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleUpdate = async (data: Partial<Question>) => {
    setSaving(true);
    try {
      await updateQuestion(id, data);
      setQuestion((prev) => (prev ? { ...prev, ...data } : null));
      setIsEditing(false);
      toast.success("Question updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <Loader className="animate-spin text-white/50" />
      </div>
    );
  if (!question)
    return (
      <div className="p-12 text-center text-white/50">Question not found</div>
    );

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black text-white">Edit Question</h1>
        </div>
        <QuestionForm
          initialData={question}
          onSubmit={handleUpdate}
          loading={saving}
        />
      </div>
    );
  }

  // --- Read Mode View ---
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/questions"
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">
              {question.title || "Untitled Question"}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/40 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{" "}
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Tag className="w-3 h-3" /> {question.difficulty}
              </span>
              <span className="bg-white/10 px-2 rounded text-[10px]">
                {question.source.dataset}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="btn bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
      </div>

      {/* Rich Content Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Problem Statement */}
          <div className="bg-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
              Problem Statement
            </h3>
            <div className="prose prose-invert prose-lg">
              <Latex>{question.content}</Latex>
            </div>

            {/* MCQ Options */}
            {question.options && question.options.length > 0 && (
              <div className="mt-8 space-y-3">
                {question.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex items-center gap-4 ${opt.isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/5"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${opt.isCorrect ? "bg-green-500 text-black" : "bg-white/10"}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span
                      className={
                        opt.isCorrect
                          ? "text-green-400 font-bold"
                          : "text-white/80"
                      }
                    >
                      <Latex>{opt.text}</Latex>
                    </span>
                    {opt.explanation && (
                      <span className="text-xs text-white/30 italic ml-auto">
                        {opt.explanation}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chain of Thought */}
          {question.chainOfThought && question.chainOfThought.length > 0 && (
            <div className="bg-glass rounded-2xl p-8 border border-white/10">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                AI Reasoning (CoT)
              </h3>
              <div className="space-y-6 relative border-l-2 border-white/10 ml-3 pl-8 py-2">
                {question.chainOfThought.map((step, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/50">
                      {i + 1}
                    </span>
                    <div className="text-white/80 leading-relaxed">
                      <Latex>{step}</Latex>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side Column: Images & Metadata */}
        <div className="space-y-6">
          {/* Client-Side Figures */}
          {question.figures &&
            question.figures.length > 0 &&
            question.source.url && (
              <div className="bg-glass rounded-2xl p-4 border border-white/10">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Figures (PDF)
                </h3>
                <div className="space-y-4">
                  {question.figures.map((fig, i) => (
                    <FigureRenderer
                      key={i}
                      pdfUrl={question.source.url!}
                      pageNumber={fig.page}
                      box={fig.box}
                      label={fig.label}
                    />
                  ))}
                </div>
              </div>
            )}

          {question.images && question.images.length > 0 && (
            <div className="bg-glass rounded-2xl p-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                Diagrams
              </h3>
              <div className="space-y-4">
                {question.images.map((url, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden border border-white/10 bg-black/50"
                  >
                    <img
                      src={url}
                      alt={`Diagram ${i + 1}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Metadata
            </h3>

            <div>
              <span className="block text-[10px] text-white/30 uppercase">
                Correct Answer
              </span>
              <div className="font-mono font-bold text-green-400 break-all">
                {question.correctAnswer || "Not specified"}
              </div>
            </div>

            <div>
              <span className="block text-[10px] text-white/30 uppercase">
                Taxonomy
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="badge bg-white/5 border border-white/10 text-[10px] px-2 py-0.5 rounded">
                  {question.domainId}
                </span>
                <span className="badge bg-white/5 border border-white/10 text-[10px] px-2 py-0.5 rounded">
                  {question.topicId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
