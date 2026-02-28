import { describe, it, expect } from "vitest";
import { normalizeQuestion } from "./question";
import { QuestionType, QuestionDifficulty } from "./question";

// ─── normalizeQuestion Unit Tests ───────────────────────────────────────
// These tests cover the critical normalization paths that handle backward
// compatibility with legacy Firestore documents.

describe("normalizeQuestion", () => {
  // ─── Type Mapping ─────────────────────────────────────────────────

  it("maps legacy MULTIPLE_CHOICE to MCQ_SINGLE", () => {
    const q = normalizeQuestion({
      id: "q1",
      type: "MULTIPLE_CHOICE",
      content: "What is 2+2?",
      options: [
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: true },
      ],
    });
    expect(q.type).toBe(QuestionType.MCQ_SINGLE);
  });

  it("preserves valid QuestionType values", () => {
    const q = normalizeQuestion({
      id: "q2",
      type: "MCQ_MULTI",
      content: "Select all primes",
    });
    expect(q.type).toBe(QuestionType.MCQ_MULTI);
  });

  it("preserves FREE_RESPONSE type and retains correctAnswer", () => {
    const q = normalizeQuestion({
      id: "q3",
      type: "FREE_RESPONSE",
      content: "Explain gravity",
      correctAnswer: "Force of attraction...",
    });
    expect(q.type).toBe(QuestionType.FREE_RESPONSE);
    expect(q.correctAnswer).toBe("Force of attraction...");
  });

  it("clears correctAnswer for MCQ types (answers live in options)", () => {
    const q = normalizeQuestion({
      id: "q4",
      type: "MCQ_SINGLE",
      content: "Pick one",
      correctAnswer: "A",
      options: [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: false },
      ],
    });
    expect(q.correctAnswer).toBeUndefined();
  });

  // ─── Legacy String Options → QuestionOption[] ─────────────────────

  it("converts string[] options to QuestionOption[] with correctAnswer inference", () => {
    const q = normalizeQuestion({
      id: "q5",
      type: "MULTIPLE_CHOICE",
      content: "What is 1+1?",
      options: ["1", "2", "3"],
      correctAnswer: "2",
    });
    expect(q.options).toHaveLength(3);
    expect(q.options![0]).toEqual({ text: "1", isCorrect: false });
    expect(q.options![1]).toEqual({ text: "2", isCorrect: true });
    expect(q.options![2]).toEqual({ text: "3", isCorrect: false });
  });

  it("handles letter-prefixed options like 'A. Option text'", () => {
    const q = normalizeQuestion({
      id: "q6",
      type: "MULTIPLE_CHOICE",
      content: "Pick one",
      options: ["A. Apple", "B. Banana", "C. Cherry"],
      correctAnswer: "A",
    });
    expect(q.options![0].isCorrect).toBe(true);
    expect(q.options![1].isCorrect).toBe(false);
  });

  it("flags legacy questions for review when correctAnswer is missing", () => {
    const q = normalizeQuestion({
      id: "q7",
      type: "MULTIPLE_CHOICE",
      content: "Pick one",
      options: ["Alpha", "Beta", "Gamma"],
      // no correctAnswer field
    });
    expect(q.status).toBe("pending");
    expect(q.reviewNotes).toContain("Auto-flagged");
  });

  // ─── Field Fallbacks ──────────────────────────────────────────────

  it("falls back from stemMarkdown to content", () => {
    const q = normalizeQuestion({
      id: "q8",
      type: "MCQ_SINGLE",
      stemMarkdown: "Legacy markdown content",
    });
    expect(q.content).toBe("Legacy markdown content");
  });

  it("falls back from figureUrls to images", () => {
    const q = normalizeQuestion({
      id: "q9",
      type: "MCQ_SINGLE",
      content: "Question with figure",
      figureUrls: ["https://example.com/fig1.png"],
    });
    expect(q.images).toEqual(["https://example.com/fig1.png"]);
  });

  it("prefers content over stemMarkdown when both are present", () => {
    const q = normalizeQuestion({
      id: "q10",
      type: "MCQ_SINGLE",
      content: "Primary content field",
      stemMarkdown: "Legacy field",
    });
    expect(q.content).toBe("Primary content field");
  });

  it("prefers images over figureUrls when both are present", () => {
    const q = normalizeQuestion({
      id: "q11",
      type: "MCQ_SINGLE",
      content: "Test",
      images: ["img1.png"],
      figureUrls: ["fig1.png"],
    });
    expect(q.images).toEqual(["img1.png"]);
  });

  // ─── Default Values ───────────────────────────────────────────────

  it("defaults difficulty to BEGINNER", () => {
    const q = normalizeQuestion({
      id: "q12",
      type: "MCQ_SINGLE",
      content: "x",
    });
    expect(q.difficulty).toBe(QuestionDifficulty.BEGINNER);
  });

  it("defaults source.dataset to Manual", () => {
    const q = normalizeQuestion({
      id: "q13",
      type: "MCQ_SINGLE",
      content: "x",
    });
    expect(q.source).toEqual({ dataset: "Manual" });
  });

  it("defaults empty id to empty string", () => {
    const q = normalizeQuestion({ type: "MCQ_SINGLE", content: "x" });
    expect(q.id).toBe("");
  });

  // ─── Taxonomy Fallbacks ───────────────────────────────────────────

  it("extracts domainId and topicId from taxonomy if not top-level", () => {
    const q = normalizeQuestion({
      id: "q14",
      type: "MCQ_SINGLE",
      content: "Test",
      taxonomy: { domain: "Algebra", topic: "Linear Equations" },
    });
    expect(q.domainId).toBe("Algebra");
    expect(q.topicId).toBe("Linear Equations");
  });

  it("prefers top-level domainId/topicId over taxonomy nested values", () => {
    const q = normalizeQuestion({
      id: "q15",
      type: "MCQ_SINGLE",
      content: "Test",
      domainId: "TopLevel",
      topicId: "TopLevelTopic",
      taxonomy: { domain: "Nested", topic: "NestedTopic" },
    });
    expect(q.domainId).toBe("TopLevel");
    expect(q.topicId).toBe("TopLevelTopic");
  });
});
