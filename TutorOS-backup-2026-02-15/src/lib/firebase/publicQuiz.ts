import {
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "./config";
import { Quiz } from "@/types/quiz";
import { getQuestionById } from "./questions";
import { Question } from "@/types/question";

/**
 * Generate a URL-friendly slug from a quiz title.
 * Appends a short random suffix to ensure uniqueness.
 */
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 40)
    .replace(/^-|-$/g, "");

  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}

/**
 * Enable public sharing for a quiz.
 * Generates a unique slug and sets isPublic = true.
 */
export const enablePublicSharing = async (
  quizId: string,
  title: string,
  password?: string,
): Promise<string> => {
  try {
    const slug = generateSlug(title);

    const updateData: {
      publicSlug: string;
      isPublic: boolean;
      updatedAt: number;
      accessPassword?: string;
    } = {
      publicSlug: slug,
      isPublic: true,
      updatedAt: Date.now(),
    };

    if (password) {
      updateData.accessPassword = password;
    }

    await updateDoc(doc(db, "quizzes", quizId), updateData);
    return slug;
  } catch (error) {
    console.error("Error enabling public sharing:", error);
    throw new Error("Failed to enable public sharing.");
  }
};

/**
 * Disable public sharing for a quiz.
 */
export const disablePublicSharing = async (quizId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "quizzes", quizId), {
      isPublic: false,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error disabling public sharing:", error);
    throw new Error("Failed to disable public sharing.");
  }
};

/**
 * Look up a quiz by its public slug.
 * Returns null if not found or not public.
 */
export const getQuizBySlug = async (slug: string): Promise<Quiz | null> => {
  try {
    const q = query(
      collection(db, "quizzes"),
      where("publicSlug", "==", slug),
      where("isPublic", "==", true),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Quiz;
  } catch (error) {
    console.error("Error fetching quiz by slug:", error);
    return null;
  }
};

/**
 * Fetch all questions for a public quiz.
 */
export const getPublicQuizQuestions = async (
  quiz: Quiz,
): Promise<Question[]> => {
  const questions = await Promise.all(
    quiz.questions.map((qConfig) => getQuestionById(qConfig.questionId)),
  );
  return questions.filter((q): q is Question => q !== null);
};

/**
 * Submit an anonymous public quiz attempt.
 */
export const submitPublicAttempt = async (
  quizId: string,
  quizSlug: string,
  playerName: string,
  answers: Record<string, string | number | boolean>,
  score: number,
  totalPoints: number,
): Promise<string> => {
  try {
    const attempt = {
      quizId,
      quizSlug,
      playerName,
      answers,
      score,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
      completedAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, "public_attempts"), attempt);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting public attempt:", error);
    throw new Error("Failed to submit your answers.");
  }
};
