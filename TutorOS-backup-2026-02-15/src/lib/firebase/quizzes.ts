import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
import { Quiz, QuizDraft, QuizStatus } from "@/types/quiz";

const COLLECTION = "quizzes";

export const createQuiz = async (draft: QuizDraft): Promise<string> => {
  try {
    const id = doc(collection(db, COLLECTION)).id;
    const now = Date.now();

    // Calculate total points
    const totalPoints = (draft.questions || []).reduce(
      (sum, q) => sum + q.points,
      0,
    );

    const quiz: Quiz = {
      id,
      ...draft,
      status: draft.status || QuizStatus.DRAFT,
      questions: draft.questions || [],
      totalPoints,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, COLLECTION, id), quiz);
    return id;
  } catch (error) {
    console.error("Error in createQuiz:", error);
    throw new Error(
      "Failed to create quiz. Check your connection and permissions.",
    );
  }
};

export const getQuizzes = async (): Promise<Quiz[]> => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Quiz);
  } catch (error) {
    console.error("Error in getQuizzes:", error);
    throw new Error("Failed to fetch quizzes.");
  }
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Quiz;
};

export const updateQuiz = async (id: string, updates: Partial<Quiz>) => {
  try {
    const ref = doc(db, COLLECTION, id);
    const now = Date.now();

    // Recalculate points if questions changed
    const extraUpdates: Partial<Quiz> = { updatedAt: now };
    if (updates.questions) {
      extraUpdates.totalPoints = updates.questions.reduce(
        (sum, q) => sum + q.points,
        0,
      );
    }

    await updateDoc(ref, {
      ...updates,
      ...extraUpdates,
    });
  } catch (error) {
    console.error("Error in updateQuiz:", error);
    throw new Error("Failed to update quiz.");
  }
};

export const deleteQuiz = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    console.error("Error in deleteQuiz:", error);
    throw new Error("Failed to delete quiz.");
  }
};
