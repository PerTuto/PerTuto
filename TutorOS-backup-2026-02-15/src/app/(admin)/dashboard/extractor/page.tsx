"use client";

import React, { useState, useMemo } from "react";
import { batchCreateQuestions } from "@/lib/firebase/questions";
import {
  QuestionType,
  QuestionDifficulty,
  QuestionOption,
  QuestionTaxonomy,
  CognitiveDepth,
} from "@/types/question";
import {
  Check,
  Loader as LoaderIcon,
  Sparkles,
  Edit2,
  X,
  Save,
  Upload,
  CheckCircle,
  Square,
  CheckSquare,
  Image as ImageIcon,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { functions } from "@/lib/firebase/config";
import { httpsCallable } from "firebase/functions";
import MathText from "@/components/ui/MathText";
import FigureRenderer from "@/components/questions/FigureRenderer";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────

interface ExtractedQuestion {
  id: string;
  stem: string;
  type: string;
  difficulty: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  hint?: string;
  figureUrls?: string[];
  figures?: {
    page: number;
    box: number[];
    label?: string;
  }[];
  taxonomy?: {
    domain: string;
    topic: string;
    subTopic?: string;
    microSkill?: string;
    cognitiveDepth?: string;
    curriculum?: string;
    scaffoldLevel?: number;
  };
  // Local UI state
  selected: boolean;
}

// ── Popular Curricula (suggestions) ────────────────────────────────────
const POPULAR_CURRICULA = [
  "Algebra 1",
  "Algebra 2",
  "Geometry",
  "Pre-Calculus",
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Statistics",
  "IB Math SL",
  "IB Math HL",
  "SAT Math",
  "ACT Math",
  "AMC 8",
  "AMC 10",
  "AMC 12",
  "Cambridge IGCSE",
];

// ── Component ──────────────────────────────────────────────────────────

export default function ExtractorPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<"upload" | "preview" | "publishing">(
    "upload",
  );

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState("Algebra 1");
  const [autoTag, setAutoTag] = useState(true);

  // Results state
  const [results, setResults] = useState<ExtractedQuestion[]>([]);
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);

  // ── Derived state ──

  const selectedCount = useMemo(
    () => results.filter((q) => q.selected).length,
    [results],
  );

  const figureCount = useMemo(
    () =>
      results.filter(
        (q) =>
          (q.figures && q.figures.length > 0) ||
          (q.figureUrls && q.figureUrls.length > 0),
      ).length,
    [results],
  );

  const domains = useMemo(() => {
    const d = new Set(results.map((q) => q.taxonomy?.domain).filter(Boolean));
    return Array.from(d);
  }, [results]);

  // ── Handlers ──

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const worksheetExtractor = httpsCallable<
        {
          pdfBase64: string;
          curriculum?: string;
          options?: { autoTag: boolean };
        },
        {
          questions: {
            stemMarkdown: string;
            type: string;
            taxonomy: {
              domain: string;
              topic: string;
              subTopic: string;
              microSkill: string;
              cognitiveDepth: string;
              curriculum: string;
              scaffoldLevel: number;
            };
            options?: {
              text: string;
              isCorrect: boolean;
              explanation?: string;
            }[];
            correctAnswer?: string;
            hint?: string;
            figures?: {
              page: number;
              box: number[];
              label?: string;
            }[];
            figureUrls?: string[];
          }[];
          pdfUrl?: string;
        }
      >(functions, "worksheetExtractor", { timeout: 300000 });

      const { data } = await worksheetExtractor({
        pdfBase64: base64Data,
        curriculum: selectedCurriculum,
        options: { autoTag },
      });

      if (data && data.questions) {
        if (data.pdfUrl) {
          setExtractedPdfUrl(data.pdfUrl);
        }

        setResults(
          data.questions.map((q, i) => ({
            id: `EXT-${Date.now()}-${i}`,
            stem: q.stemMarkdown || "",
            type: q.type || "UNKNOWN",
            difficulty: q.taxonomy?.cognitiveDepth || "Fluency",
            options: q.options?.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              explanation: opt.explanation,
            })),
            correctAnswer: q.correctAnswer,
            hint: q.hint,
            figures: q.figures,
            figureUrls: q.figureUrls,
            taxonomy: q.taxonomy
              ? {
                  domain: q.taxonomy.domain,
                  topic: q.taxonomy.topic,
                  subTopic: q.taxonomy.subTopic,
                  microSkill: q.taxonomy.microSkill,
                  cognitiveDepth: q.taxonomy.cognitiveDepth,
                  curriculum: q.taxonomy.curriculum,
                  scaffoldLevel: q.taxonomy.scaffoldLevel,
                }
              : undefined,
            selected: true, // All selected by default
          })),
        );

        setStep("preview");
        toast.success(
          `${data.questions.length} questions extracted successfully!`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI Extraction failed.";
      toast.error(`Extraction failed: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setResults((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q)),
    );
  };

  const toggleSelectAll = () => {
    const allSelected = results.every((q) => q.selected);
    setResults((prev) => prev.map((q) => ({ ...q, selected: !allSelected })));
  };

  const handleFieldUpdate = (id: string, field: string, value: string) => {
    setResults((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        if (field.startsWith("taxonomy.")) {
          const taxField = field.split(".")[1];
          return {
            ...q,
            taxonomy: {
              ...q.taxonomy,
              domain: q.taxonomy?.domain || "",
              topic: q.taxonomy?.topic || "",
              [taxField]: value,
            },
          };
        }
        return { ...q, [field]: value };
      }),
    );
  };

  const handlePublish = async () => {
    const selectedQuestions = results.filter((q) => q.selected);
    if (selectedQuestions.length === 0) {
      toast.error("No questions selected");
      return;
    }

    setIsPublishing(true);
    setStep("publishing");

    try {
      // Map cognitive depth → QuestionDifficulty
      const difficultyMap: Record<string, QuestionDifficulty> = {
        Fluency: QuestionDifficulty.BEGINNER,
        Conceptual: QuestionDifficulty.INTERMEDIATE,
        Application: QuestionDifficulty.ADVANCED,
        Synthesis: QuestionDifficulty.COMPETITION,
      };

      // Map AI type → canonical enum
      const typeMap: Record<string, QuestionType> = {
        MCQ_SINGLE: QuestionType.MCQ_SINGLE,
        MCQ_MULTI: QuestionType.MCQ_MULTI,
        MCQ: QuestionType.MCQ_SINGLE,
        FILL_IN_BLANK: QuestionType.FILL_IN_BLANK,
        FREE_RESPONSE: QuestionType.FREE_RESPONSE,
        PASSAGE_BASED: QuestionType.PASSAGE_BASED,
        TRUE_FALSE: QuestionType.TRUE_FALSE,
      };

      const questionsToSave = selectedQuestions.map((q) => {
        const resolvedType = typeMap[q.type] || QuestionType.FREE_RESPONSE;
        const taxonomy: QuestionTaxonomy | undefined = q.taxonomy
          ? {
              domain: q.taxonomy.domain,
              topic: q.taxonomy.topic,
              subTopic: q.taxonomy.subTopic,
              microSkill: q.taxonomy.microSkill,
              cognitiveDepth: q.taxonomy.cognitiveDepth as
                | CognitiveDepth
                | undefined,
              curriculum: q.taxonomy.curriculum,
              scaffoldLevel: q.taxonomy.scaffoldLevel,
            }
          : undefined;

        const doc: Record<string, unknown> = {
          title: q.stem.substring(0, 50) + (q.stem.length > 50 ? "..." : ""),
          content: q.stem,
          type: resolvedType,
          difficulty:
            difficultyMap[q.difficulty] || QuestionDifficulty.BEGINNER,
          domainId: q.taxonomy?.domain?.toLowerCase() || "general",
          topicId:
            q.taxonomy?.topic?.toLowerCase().replace(/ /g, "-") || "general",
          source: {
            dataset: "AI Extracted",
            url: extractedPdfUrl || undefined,
          },
          status: "approved",
          // Multi-curriculum: start with the AI's best-guess curriculum
          curricula: q.taxonomy?.curriculum ? [q.taxonomy.curriculum] : [],
        };

        if (q.options) doc.options = q.options;
        if (
          (resolvedType === QuestionType.FREE_RESPONSE ||
            resolvedType === QuestionType.FILL_IN_BLANK) &&
          q.correctAnswer
        ) {
          doc.correctAnswer = q.correctAnswer;
        }
        if (taxonomy) doc.taxonomy = taxonomy;
        if (q.taxonomy?.subTopic) {
          doc.subTopicId = q.taxonomy.subTopic.toLowerCase().replace(/ /g, "-");
        }
        if (q.figureUrls && q.figureUrls.length > 0) doc.images = q.figureUrls;
        if (q.figures && q.figures.length > 0) doc.figures = q.figures;
        if (q.hint) doc.hint = q.hint;

        return doc as Parameters<typeof batchCreateQuestions>[0][0];
      });

      await batchCreateQuestions(questionsToSave);
      toast.success(
        `${questionsToSave.length} questions published to Question Bank!`,
      );

      // Navigate to Question Bank
      setTimeout(() => {
        router.push("/dashboard/questions");
      }, 1500);
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish questions");
      setStep("preview");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleStartOver = () => {
    setStep("upload");
    setFile(null);
    setResults([]);
    setExtractedPdfUrl(null);
    setEditingId(null);
  };

  // ── Render ──

  return (
    <div className="max-w-6xl mx-auto animate-in">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
            🤖
          </span>
          <div>
            <h1 className="text-3xl font-black text-gradient">
              AI Worksheet Extractor
            </h1>
            <p className="text-sm text-white/40">
              Powered by Gemini 3 Flash • Automatic 4D Taxonomy
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mt-6">
          {[
            { key: "upload", label: "Upload & Configure", num: 1 },
            { key: "preview", label: "Preview & Select", num: 2 },
            { key: "publishing", label: "Publish", num: 3 },
          ].map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && (
                <div
                  className={`flex-1 h-px ${
                    step === s.key ||
                    (s.key === "publishing" && step === "publishing")
                      ? "bg-primary/40"
                      : "bg-white/10"
                  }`}
                />
              )}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  step === s.key
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : results.length > 0 &&
                        s.num <=
                          (step === "preview"
                            ? 2
                            : step === "publishing"
                              ? 3
                              : 1)
                      ? "bg-secondary/10 text-secondary/60"
                      : "bg-white/5 text-white/30"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    step === s.key
                      ? "bg-primary text-white"
                      : results.length > 0 &&
                          s.num <
                            (step === "preview"
                              ? 2
                              : step === "publishing"
                                ? 3
                                : 1)
                        ? "bg-secondary/30 text-secondary"
                        : "bg-white/10 text-white/30"
                  }`}
                >
                  {results.length > 0 &&
                  s.num <
                    (step === "preview" ? 2 : step === "publishing" ? 3 : 1) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    s.num
                  )}
                </span>
                {s.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* ── STEP 1: Upload & Configure ── */}
      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            {/* File Upload */}
            <div className="card border-dashed border-2 border-white/10 hover:border-primary/40 transition-colors text-center p-8 cursor-pointer group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  📄
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {file ? file.name : "Drop PDF here"}
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Max 20MB • Multi-page supported
                </p>
              </label>
            </div>

            {/* Settings */}
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">
                Extraction Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Curriculum</label>
                  <input
                    type="text"
                    list="curriculum-suggestions"
                    className="input-field"
                    value={selectedCurriculum}
                    onChange={(e) => setSelectedCurriculum(e.target.value)}
                    placeholder="Type or select a curriculum..."
                  />
                  <datalist id="curriculum-suggestions">
                    {POPULAR_CURRICULA.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-white/5">
                  <span className="text-sm font-medium">Auto-tag taxonomy</span>
                  <button
                    onClick={() => setAutoTag(!autoTag)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      autoTag ? "bg-secondary" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all ${
                        autoTag ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleExtract}
                  disabled={!file || isProcessing}
                  className={`btn btn-primary w-full ${
                    !file || isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Extracting with Gemini 3...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Start Extraction
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <EmptyState
              icon={Sparkles}
              title="Ready to Extract?"
              description="Upload a PDF worksheet and let AI identify every question, tag taxonomy, and detect figures automatically."
            />
          </div>
        </div>
      )}

      {/* ── STEP 2: Preview & Select ── */}
      {step === "preview" && (
        <div>
          {/* Summary Bar */}
          <div className="card mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="tag tag-secondary">
                  {results.length} questions
                </span>
                {figureCount > 0 && (
                  <span className="tag tag-primary flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {figureCount} with figures
                  </span>
                )}
                {domains.length > 0 && (
                  <span className="tag bg-white/10 text-white/60 border-white/10">
                    {domains.join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="btn btn-outline text-xs py-2 px-4 flex items-center gap-2"
              >
                {results.every((q) => q.selected) ? (
                  <Square className="w-3.5 h-3.5" />
                ) : (
                  <CheckSquare className="w-3.5 h-3.5" />
                )}
                {results.every((q) => q.selected)
                  ? "Deselect All"
                  : "Select All"}
              </button>

              <button
                onClick={handleStartOver}
                className="btn btn-outline text-xs py-2 px-4 flex items-center gap-2 border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>

              <button
                onClick={handlePublish}
                disabled={selectedCount === 0}
                className={`btn btn-secondary text-xs py-2 px-4 flex items-center gap-2 ${
                  selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Publish {selectedCount} to Bank
              </button>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {results.map((q, index) => {
              const isEditing = editingId === q.id;

              return (
                <div
                  key={q.id}
                  className={`card group transition-all ${
                    q.selected
                      ? "border-secondary/30 bg-secondary/[0.02]"
                      : "opacity-60"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleSelect(q.id)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          q.selected
                            ? "border-secondary bg-secondary text-white"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {q.selected && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-xs font-mono text-white/20">
                        Q{index + 1}
                      </span>

                      <div className="flex gap-2">
                        <span className="tag tag-primary">{q.type}</span>
                        <span className="tag tag-secondary">
                          {q.difficulty}
                        </span>
                        {q.taxonomy?.curriculum && (
                          <span className="tag bg-purple-500/10 text-purple-400 border-purple-500/20">
                            {q.taxonomy.curriculum}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingId(isEditing ? null : q.id)}
                      className="btn btn-outline text-xs py-1 px-3 flex items-center gap-1.5"
                    >
                      {isEditing ? (
                        <>
                          <X className="w-3 h-3" />
                          Close
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question Content */}
                  {isEditing ? (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">
                          Question Text (LaTeX: $x^2$)
                        </label>
                        <textarea
                          value={q.stem}
                          onChange={(e) =>
                            handleFieldUpdate(q.id, "stem", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-2">
                            Domain
                          </label>
                          <input
                            type="text"
                            value={q.taxonomy?.domain || ""}
                            onChange={(e) =>
                              handleFieldUpdate(
                                q.id,
                                "taxonomy.domain",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            placeholder="e.g., Algebra"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-2">
                            Topic
                          </label>
                          <input
                            type="text"
                            value={q.taxonomy?.topic || ""}
                            onChange={(e) =>
                              handleFieldUpdate(
                                q.id,
                                "taxonomy.topic",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            placeholder="e.g., Polynomials"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-2">
                            Difficulty
                          </label>
                          <select
                            value={q.difficulty}
                            onChange={(e) =>
                              handleFieldUpdate(
                                q.id,
                                "difficulty",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                          >
                            <option>Fluency</option>
                            <option>Conceptual</option>
                            <option>Application</option>
                            <option>Synthesis</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <MathText className="text-lg font-medium text-white/90 mb-4 leading-relaxed">
                        {q.stem}
                      </MathText>

                      {/* Taxonomy breadcrumb */}
                      <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                        <span>
                          <strong className="text-white/60">Domain:</strong>{" "}
                          {q.taxonomy?.domain || "-"}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-white/60">Topic:</strong>{" "}
                          {q.taxonomy?.topic || "-"}
                        </span>
                        {q.taxonomy?.subTopic && (
                          <>
                            <span>•</span>
                            <span>
                              <strong className="text-white/60">
                                Sub-topic:
                              </strong>{" "}
                              {q.taxonomy.subTopic}
                            </span>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Options (MCQ) */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded-lg border text-sm ${
                            opt.isCorrect
                              ? "bg-secondary/10 border-secondary/30 text-secondary"
                              : "bg-white/5 border-white/5 text-white/60"
                          }`}
                        >
                          <span className="font-bold text-white/30 mr-2">
                            {String.fromCharCode(65 + i)})
                          </span>
                          {opt.text}
                          {opt.isCorrect && (
                            <CheckCircle className="inline w-3.5 h-3.5 ml-2 text-secondary" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Correct Answer (non-MCQ) */}
                  {q.correctAnswer && !q.options && (
                    <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <span className="text-xs font-bold text-secondary/60 uppercase tracking-wider">
                        Answer:
                      </span>
                      <span className="text-sm text-secondary ml-2">
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}

                  {/* Hint */}
                  {q.hint && (
                    <div className="mb-4 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                      <span className="text-xs font-bold text-yellow-500/60 uppercase tracking-wider">
                        Hint:
                      </span>
                      <span className="text-sm text-white/60 ml-2">
                        {q.hint}
                      </span>
                    </div>
                  )}

                  {/* Figures */}
                  {q.figures && q.figures.length > 0 && extractedPdfUrl && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {q.figures.map((fig, i) => (
                        <FigureRenderer
                          key={i}
                          pdfUrl={extractedPdfUrl}
                          pageNumber={fig.page}
                          box={fig.box}
                          label={fig.label}
                          figureUrl={
                            q.figureUrls && q.figureUrls[i]
                              ? q.figureUrls[i]
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Publish Bar */}
          {selectedCount > 0 && (
            <div className="sticky bottom-4 mt-8">
              <div className="card bg-secondary/10 border-secondary/30 flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">
                    {selectedCount} of {results.length} questions selected
                  </span>
                </div>
                <button
                  onClick={handlePublish}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Publish to Question Bank
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Publishing ── */}
      {step === "publishing" && (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            {isPublishing ? (
              <>
                <LoaderIcon className="w-12 h-12 animate-spin text-secondary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-2">
                  Publishing {selectedCount} Questions...
                </h2>
                <p className="text-white/40">
                  Saving to your Question Bank with approved status
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-6 animate-bounce" />
                <h2 className="text-2xl font-bold mb-2">Published!</h2>
                <p className="text-white/40 mb-6">
                  {selectedCount} questions have been added to your Question
                  Bank
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleStartOver}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Extract More
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/questions")}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    View Question Bank
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
