"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  getQuestions,
  getQuestionsByStatus,
  batchUpdateStatus,
  deleteQuestion,
} from "@/lib/firebase/questions";
import { Question } from "@/types/question";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronDown,
  Eye,
  Database,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

// ── Status Config ──
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  draft: {
    label: "Draft",
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    icon: FileText,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
  },
};

const DIFFICULTY_CONFIG: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Advanced: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Competition: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Load Data ──
  const loadData = async () => {
    setLoading(true);
    try {
      if (
        statusFilter !== "all" &&
        ["draft", "pending", "approved", "rejected"].includes(statusFilter)
      ) {
        const result = await getQuestionsByStatus(
          statusFilter as "draft" | "pending" | "approved" | "rejected",
        );
        setQuestions(result.questions);
      } else {
        const result = await getQuestions();
        setQuestions(result.questions);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  // ── Derived Data ──
  const domains = useMemo(() => {
    const d = new Set(questions.map((q) => q.domainId).filter(Boolean));
    return Array.from(d).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let result = questions;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.title?.toLowerCase().includes(query) ||
          q.content?.toLowerCase().includes(query) ||
          q.domainId?.toLowerCase().includes(query) ||
          q.topicId?.toLowerCase().includes(query) ||
          q.curricula?.some((c) => c.toLowerCase().includes(query)),
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter((q) => q.difficulty === difficultyFilter);
    }

    // Domain filter
    if (domainFilter !== "all") {
      result = result.filter((q) => q.domainId === domainFilter);
    }

    return result;
  }, [questions, searchQuery, difficultyFilter, domainFilter]);

  // ── Counts ──
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: questions.length,
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    questions.forEach((q) => {
      const s = q.status || "draft";
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [questions]);

  // ── Selection Handlers ──
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  // ── Batch Actions ──
  const handleBatchStatus = async (
    newStatus: "draft" | "pending" | "approved" | "rejected",
  ) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const t = toast.loading(
      `Updating ${ids.length} questions to ${newStatus}...`,
    );
    try {
      await batchUpdateStatus(ids, newStatus);
      toast.success(`${ids.length} questions marked as ${newStatus}`, {
        id: t,
      });
      setSelectedIds(new Set());
      await loadData();
    } catch {
      toast.error("Failed to update status", { id: t });
    }
  };

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} questions? This cannot be undone.`))
      return;

    const t = toast.loading(`Deleting ${ids.length} questions...`);
    try {
      for (const id of ids) {
        await deleteQuestion(id);
      }
      toast.success(`${ids.length} questions deleted`, { id: t });
      setSelectedIds(new Set());
      await loadData();
    } catch {
      toast.error("Failed to delete questions", { id: t });
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gradient mb-2">
            Question Bank
          </h1>
          <p className="text-white/40">
            {filteredQuestions.length} questions
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/extractor"
            className="btn btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Extract from PDF
          </Link>
        </div>
      </header>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {["all", "approved", "pending", "draft", "rejected"].map((s) => {
          const config = s === "all" ? null : STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setSelectedIds(new Set());
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                statusFilter === s
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {config && <config.icon className="w-3.5 h-3.5" />}
              {s === "all" ? "All" : config?.label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                  statusFilter === s ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {statusCounts[s] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search questions, domains, curricula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`btn btn-outline flex items-center gap-2 ${
            showFilterPanel ? "border-secondary text-secondary" : ""
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown
            className={`w-3 h-3 transition-transform ${
              showFilterPanel ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="card mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/30 mb-2">
              Difficulty
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Competition">Competition</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/30 mb-2">
              Domain
            </label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
            >
              <option value="all">All Domains</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-10 mb-4">
          <div className="card bg-primary/10 border-primary/30 flex items-center justify-between p-3">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchStatus("approved")}
                className="btn text-xs py-1.5 px-3 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => handleBatchStatus("rejected")}
                className="btn text-xs py-1.5 px-3 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => handleBatchStatus("pending")}
                className="btn text-xs py-1.5 px-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Set Pending
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                onClick={handleBatchDelete}
                className="btn text-xs py-1.5 px-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-glass rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="card border-white/5 p-6 flex flex-col gap-3"
              >
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-5" />
                  <Skeleton className="w-16 h-5" />
                </div>
                <Skeleton className="w-1/2 h-7" />
                <Skeleton className="w-full h-12" />
              </div>
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No Questions Found"
            description={
              searchQuery
                ? `No questions match "${searchQuery}". Try adjusting your filters.`
                : "Your question bank is empty. Extract questions from a PDF to get started."
            }
            action={
              <Link
                href="/dashboard/extractor"
                className="btn btn-primary mt-4 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Extract from PDF
              </Link>
            }
          />
        ) : (
          <>
            {/* Table Header */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-bold uppercase tracking-wider text-white/30">
              <button
                onClick={toggleSelectAll}
                className="w-5 h-5 flex items-center justify-center shrink-0"
              >
                {selectedIds.size === filteredQuestions.length ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <div className="flex-1">Question</div>
              <div className="w-24 text-center">Status</div>
              <div className="w-24 text-center">Difficulty</div>
              <div className="w-24 text-center">Domain</div>
              <div className="w-20 text-right">Date</div>
              <div className="w-10" />
            </div>

            {/* Question Rows */}
            <div className="divide-y divide-white/5">
              {filteredQuestions.map((q) => {
                const status = q.status || "draft";
                const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
                const isSelected = selectedIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(q.id)}
                      className="w-5 h-5 flex items-center justify-center shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                      )}
                    </button>

                    {/* Content */}
                    <Link
                      href={`/dashboard/questions/${q.id}`}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="text-sm font-bold text-white truncate mb-1">
                        {q.title || "Untitled Question"}
                      </h3>
                      <p className="text-xs text-white/40 truncate">
                        {q.content}
                      </p>
                      {q.curricula && q.curricula.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {q.curricula.map((c) => (
                            <span
                              key={c}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Status */}
                    <div className="w-24 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusConf.color}`}
                      >
                        <statusConf.icon className="w-3 h-3" />
                        {statusConf.label}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div className="w-24 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          DIFFICULTY_CONFIG[q.difficulty] ||
                          "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Domain */}
                    <div className="w-24 text-center">
                      <span className="text-xs text-white/40 truncate block">
                        {q.domainId || "-"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="w-20 text-right">
                      <span className="text-xs text-white/30 font-mono">
                        {new Date(q.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* View */}
                    <Link
                      href={`/dashboard/questions/${q.id}`}
                      className="w-10 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
