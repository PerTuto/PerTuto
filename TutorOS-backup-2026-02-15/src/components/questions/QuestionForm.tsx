"use client";

import React, { useState } from "react";
import {
  Question,
  QuestionDifficulty,
  QuestionType,
  QuestionOption,
} from "@/types/question";

import TaxonomyPicker from "@/components/taxonomy/TaxonomyPicker";
import { Save, Plus, X, Eye, Edit2, Check } from "lucide-react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface QuestionFormProps {
  initialData?: Partial<Question>;
  onSubmit: (data: Partial<Question>) => Promise<void>;
  loading?: boolean;
}

export default function QuestionForm({
  initialData,
  onSubmit,
  loading,
}: QuestionFormProps) {
  const [formData, setFormData] = useState<Partial<Question>>({
    title: "",
    content: "",
    type: QuestionType.FREE_RESPONSE,
    difficulty: QuestionDifficulty.BEGINNER,
    options: [],
    images: [],
    chainOfThought: [],
    source: { dataset: "Manual" },
    ...initialData,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [taxonomy, setTaxonomy] = useState({
    domainId: initialData?.domainId || "",
    topicId: initialData?.topicId || "",
    subTopicId: initialData?.subTopicId || "",
  });

  const handleTaxonomyChange = (val: {
    domainId: string;
    topicId?: string;
    subTopicId?: string;
  }) => {
    setTaxonomy({
      domainId: val.domainId,
      topicId: val.topicId || "",
      subTopicId: val.subTopicId || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...taxonomy,
      createdAt: formData.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  };

  // --- Option helpers (QuestionOption[]) ---

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        { text: "", isCorrect: false } as QuestionOption,
      ],
    }));
  };

  const updateOptionText = (index: number, text: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], text };
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const toggleOptionCorrect = (index: number) => {
    const newOptions = [...(formData.options || [])];
    // For MCQ_SINGLE, only one option can be correct
    if (formData.type === QuestionType.MCQ_SINGLE) {
      newOptions.forEach((opt, i) => {
        newOptions[i] = { ...opt, isCorrect: i === index };
      });
    } else {
      newOptions[index] = {
        ...newOptions[index],
        isCorrect: !newOptions[index].isCorrect,
      };
    }
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const updateOptionExplanation = (index: number, explanation: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], explanation };
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  // --- Image & CoT helpers (string[]) ---

  const addArrayItem = (field: "images" | "chainOfThought") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const updateArrayItem = (
    field: "images" | "chainOfThought",
    index: number,
    value: string,
  ) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const removeArrayItem = (
    field: "images" | "chainOfThought",
    index: number,
  ) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const isMCQType =
    formData.type === QuestionType.MCQ_SINGLE ||
    formData.type === QuestionType.MCQ_MULTI ||
    formData.type === QuestionType.TRUE_FALSE;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in bg-glass p-8 rounded-2xl border border-white/5"
    >
      {/* Header / Mode Switch */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Question Details</h2>
        <div className="flex bg-white/5 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-colors ${!previewMode ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-colors ${previewMode ? "bg-secondary text-white" : "text-white/40 hover:text-white"}`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {/* SECTION 1: Question Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Metadata */}
        <div className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Solving Linear Equations"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Difficulty</label>
              <select
                className="input"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as QuestionDifficulty,
                  })
                }
              >
                {Object.values(QuestionDifficulty).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as QuestionType,
                  })
                }
              >
                {Object.values(QuestionType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Taxonomy</label>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <TaxonomyPicker
                value={taxonomy}
                onChange={handleTaxonomyChange}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="space-y-6">
          <div>
            <label className="label">Problem Content (LaTeX supported)</label>
            {previewMode ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 min-h-[120px] prose prose-invert">
                <Latex>{formData.content || ""}</Latex>
              </div>
            ) : (
              <textarea
                className="input min-h-[120px] font-mono text-sm"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Type your question here... use $x^2$ for math."
              />
            )}
          </div>

          {/* Dynamic Options for MCQ types */}
          {isMCQType && (
            <div>
              <label className="label">Options</label>
              <p className="text-white/30 text-xs mb-3">
                Click the circle to mark the correct answer
                {formData.type === QuestionType.MCQ_MULTI &&
                  " (multiple allowed)"}
              </p>
              {formData.options?.map((opt, i) => (
                <div key={i} className="flex gap-2 mb-3 items-start">
                  {/* Correctness toggle */}
                  <button
                    type="button"
                    onClick={() => toggleOptionCorrect(i)}
                    className={`mt-2.5 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      opt.isCorrect
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-white/20 text-transparent hover:border-white/40"
                    }`}
                    title={opt.isCorrect ? "Correct answer" : "Mark as correct"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 space-y-1">
                    <input
                      className="input"
                      value={opt.text}
                      onChange={(e) => updateOptionText(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                    />
                    <input
                      className="input text-xs text-white/40"
                      value={opt.explanation || ""}
                      onChange={(e) =>
                        updateOptionExplanation(i, e.target.value)
                      }
                      placeholder="Explanation (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="text-red-400 hover:text-red-300 mt-2.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-primary text-xs font-bold hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* Answer for non-MCQ types */}
          {!isMCQType && (
            <div>
              <label className="label">Correct Answer</label>
              <input
                className="input"
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value })
                }
                placeholder="Enter the correct answer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section Divider */}
      <div className="border-t border-white/10 my-8">
        <span className="relative -top-3 bg-background px-3 text-xs font-semibold uppercase text-white/40 tracking-wider">
          Enrichment (Optional)
        </span>
      </div>

      {/* SECTION 2: Rich Content */}
      <div className="space-y-8">
        {/* Images */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">Images (URLs)</label>
            <button
              type="button"
              onClick={() => addArrayItem("images")}
              className="btn-icon-small"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.images?.map((url, i) => (
              <div key={i} className="relative group">
                <input
                  className="input text-xs"
                  value={url}
                  onChange={(e) => updateArrayItem("images", i, e.target.value)}
                  placeholder="https://..."
                />
                {url && (
                  <div className="mt-2 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                    <img
                      src={url}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeArrayItem("images", i)}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div>
          <label className="label">Hint</label>
          <input
            className="input"
            value={formData.hint || ""}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            placeholder="A helpful hint for students..."
          />
        </div>

        {/* Chain of Thought */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">
              Chain of Thought (Step-by-Step)
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("chainOfThought")}
              className="btn-icon-small"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.chainOfThought?.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs font-bold text-white/20 mt-3 w-6">
                  {i + 1}.
                </span>
                <textarea
                  className="input text-sm min-h-[60px]"
                  value={step}
                  onChange={(e) =>
                    updateArrayItem("chainOfThought", i, e.target.value)
                  }
                  placeholder="Explain this step..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("chainOfThought", i)}
                  className="text-white/20 hover:text-red-400 self-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/5">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary px-8"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Question
            </>
          )}
        </button>
      </div>
    </form>
  );
}
