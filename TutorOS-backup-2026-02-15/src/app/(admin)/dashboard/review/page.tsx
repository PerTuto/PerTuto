"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Edit3,
  Filter,
  Eye,
  Tag,
  Clock,
  Save,
  Loader,
  X,
} from "lucide-react";
import { Question, QuestionDifficulty } from "@/types/question";
import { updateQuestion } from "@/lib/firebase/questions";
import { normalizeQuestion } from "@/types/question";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function ReviewDashboardPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<string>("");
  const [editNotes, setEditNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedQuestion = questions.find((q) => q.id === selectedId);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "questions"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
        limit(50),
      );
      const snapshot = await getDocs(q);
      const pending = snapshot.docs.map((doc) =>
        normalizeQuestion({ id: doc.id, ...doc.data() }),
      );
      setQuestions(pending);
      if (pending.length > 0 && !selectedId) setSelectedId(pending[0].id);
    } catch (error) {
      console.error("Error fetching pending questions:", error);
      toast.error("Failed to load pending questions");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a question is selected, initialize editing state
  useEffect(() => {
    if (selectedQuestion) {
      setEditContent(selectedQuestion.content);
      setEditDifficulty(selectedQuestion.difficulty);
      setEditNotes(selectedQuestion.reviewNotes || "");
      setIsEditing(false);
    }
  }, [selectedQuestion]);

  const removeFromList = (id: string) => {
    const remaining = questions.filter((q) => q.id !== id);
    setQuestions(remaining);
    if (selectedId === id) {
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading("approve");
    try {
      // Save any edits before approving
      const updates: Partial<Question> = { status: "approved" };
      if (editContent !== selectedQuestion?.content) {
        updates.content = editContent;
      }
      if (editDifficulty !== selectedQuestion?.difficulty) {
        updates.difficulty = editDifficulty as QuestionDifficulty;
      }
      if (editNotes.trim()) {
        updates.reviewNotes = editNotes;
      }

      await updateQuestion(id, updates);
      removeFromList(id);
      toast.success("Question approved & published to bank!");
    } catch (error) {
      console.error("Error approving question:", error);
      toast.error("Failed to approve question");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading("reject");
    try {
      const updates: Partial<Question> = { status: "rejected" };
      if (editNotes.trim()) {
        updates.reviewNotes = editNotes;
      }
      await updateQuestion(id, updates);
      removeFromList(id);
      toast.success("Question rejected");
    } catch (error) {
      console.error("Error rejecting question:", error);
      toast.error("Failed to reject question");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveEdits = async () => {
    if (!selectedQuestion) return;
    setActionLoading("save");
    try {
      const updates: Partial<Question> = {};
      if (editContent !== selectedQuestion.content) {
        updates.content = editContent;
      }
      if (editDifficulty !== selectedQuestion.difficulty) {
        updates.difficulty = editDifficulty as QuestionDifficulty;
      }
      if (editNotes.trim()) {
        updates.reviewNotes = editNotes;
      }
      if (Object.keys(updates).length === 0) {
        toast.success("No changes to save");
        setIsEditing(false);
        return;
      }
      await updateQuestion(selectedQuestion.id, updates);
      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id ? { ...q, ...updates } : q,
        ),
      );
      toast.success("Edits saved");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edits:", error);
      toast.error("Failed to save edits");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredQuestions = searchQuery
    ? questions.filter((q) =>
        q.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : questions;

  return (
    <div className="flex h-[calc(100vh-120px)] -m-8 overflow-hidden bg-background">
      {/* Left Sidebar: Question List */}
      <div className="w-80 border-r border-white/5 flex flex-col">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <Clock size={16} className="text-secondary" />
              Pending Review
              <span className="bg-secondary/20 text-secondary text-[10px] px-2 py-0.5 rounded-full">
                {questions.length}
              </span>
            </h2>
            <button
              onClick={fetchPending}
              className="text-white/40 hover:text-white transition-colors"
              title="Refresh"
            >
              <Filter size={16} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              size={14}
            />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 text-sm py-2 rounded-xl border-white/5 bg-white/5 w-full focus:ring-1 ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-white/20">
              <Loader size={24} className="mx-auto mb-3 animate-spin" />
              <p className="text-sm">Loading...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all ${
                  selectedId === q.id
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1 text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-white/40">{q.topicId}</span>
                  <span className="text-secondary">{q.difficulty}</span>
                </div>
                <p className="text-sm line-clamp-2 text-white/70">
                  {q.content.replace(/\$/g, "")}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-white/20">
              <CheckCircle size={40} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Inbox Zero!</p>
              <p className="text-xs">All extractions reviewed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Preview & Action */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
        <AnimatePresence mode="wait">
          {selectedQuestion ? (
            <motion.div
              key={selectedQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex"
            >
              {/* Review Area */}
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Eye className="text-secondary" size={20} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">Question Moderation</h1>
                      <p className="text-xs text-white/40">
                        Review AI extraction precision and latex rendering.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            setEditContent(selectedQuestion.content);
                            setEditDifficulty(selectedQuestion.difficulty);
                            setIsEditing(false);
                          }}
                          className="btn btn-outline text-xs px-4 py-2 border-white/10"
                        >
                          <X size={14} className="mr-2" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdits}
                          disabled={actionLoading === "save"}
                          className="btn btn-primary text-xs px-4 py-2"
                        >
                          {actionLoading === "save" ? (
                            <Loader size={14} className="mr-2 animate-spin" />
                          ) : (
                            <Save size={14} className="mr-2" />
                          )}
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline text-xs px-4 py-2 border-white/10"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit Content
                      </button>
                    )}
                  </div>
                </div>

                <div className="glass p-10 rounded-3xl border-white/10 bg-white/5 space-y-8">
                  {isEditing ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[200px] bg-black/30 border border-white/10 rounded-xl p-6 text-lg text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                      placeholder="Question content (LaTeX supported)..."
                    />
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {selectedQuestion.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {selectedQuestion.options && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {selectedQuestion.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border ${
                            opt.isCorrect
                              ? "bg-secondary/10 border-secondary/50"
                              : "bg-white/5 border-white/5"
                          }`}
                        >
                          <span className="text-xs font-bold text-white/30 mr-3">
                            {String.fromCharCode(65 + i)})
                          </span>
                          <span className="text-sm">{opt.text}</span>
                          {opt.isCorrect && (
                            <span className="ml-2 text-[10px] text-secondary font-bold">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedQuestion.correctAnswer && (
                    <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                      <span className="text-xs font-bold text-secondary/60 uppercase tracking-wider">
                        Correct Answer
                      </span>
                      <p className="text-sm text-secondary mt-1">
                        {selectedQuestion.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-10 flex gap-4">
                  <button
                    onClick={() => handleReject(selectedQuestion.id)}
                    disabled={actionLoading !== null}
                    className="flex-1 py-4 rounded-2xl border border-red-500/50 text-red-500 font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading === "reject" ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <XCircle size={20} />
                    )}
                    Reject Extraction
                  </button>
                  <button
                    onClick={() => handleApprove(selectedQuestion.id)}
                    disabled={actionLoading !== null}
                    className="flex-[2] py-4 rounded-2xl bg-secondary text-black font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {actionLoading === "approve" ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    Approve & Publish
                  </button>
                </div>
              </div>

              {/* Sidebar: Details & Tagging */}
              <div className="w-96 border-l border-white/5 bg-black/40 p-8 overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                  <Tag size={14} />
                  Metadata Refinement
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                      Question Type
                    </label>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                      <span className="tag tag-primary">
                        {selectedQuestion.type}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                      Hierarchy Level
                    </label>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Domain</span>
                        <span className="text-white">
                          {selectedQuestion.domainId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Topic</span>
                        <span className="text-white">
                          {selectedQuestion.topicId}
                        </span>
                      </div>
                      {selectedQuestion.subTopicId && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/40">Sub-Topic</span>
                          <span className="text-white">
                            {selectedQuestion.subTopicId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                      Difficulty Alignment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(QuestionDifficulty).map((d) => (
                        <button
                          key={d}
                          onClick={() => setEditDifficulty(d)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                            editDifficulty === d
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    {editDifficulty !== selectedQuestion.difficulty && (
                      <p className="text-[10px] text-primary mt-2">
                        Changed from {selectedQuestion.difficulty} →{" "}
                        {editDifficulty}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                      Source
                    </label>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                      <span className="text-white/60">
                        {selectedQuestion.source?.dataset || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {selectedQuestion.hint && (
                    <div>
                      <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                        Hint
                      </label>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-white/60">
                        {selectedQuestion.hint}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-white/30 block mb-2 uppercase tracking-wider">
                      Moderator Notes
                    </label>
                    <textarea
                      placeholder="Optional notes for the content team..."
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="input w-full min-h-[100px] text-sm py-3"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle
                  size={60}
                  className="mx-auto mb-6 text-secondary opacity-20"
                />
                <h2 className="text-2xl font-bold opacity-20">
                  {loading
                    ? "Loading..."
                    : questions.length === 0
                      ? "All Caught Up!"
                      : "Select a Question"}
                </h2>
                {!loading && questions.length === 0 && (
                  <p className="text-sm text-white/30 mt-2">
                    No pending questions to review.
                  </p>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
