
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
  Timestamp,
  where,
  addDoc,
} from "firebase/firestore";
import { firestore } from "../client-app";
import { Quiz, QuizAttempt } from "../../types";

// --- CRUD Operations ---

export async function createQuiz(
  tenantId: string,
  quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const quizzesRef = collection(firestore, `tenants/${tenantId}/quizzes`);
  const id = doc(quizzesRef).id;
  const now = Timestamp.now();

  // Calculate total points
  const totalPoints = (quizData.questions || []).reduce(
    (sum, q) => sum + (q.points || 0),
    0
  );

  const quiz: Quiz = {
    id,
    ...quizData,
    totalPoints,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };

  await setDoc(doc(firestore, `tenants/${tenantId}/quizzes`, id), {
    ...quiz,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function getQuizzes(tenantId: string): Promise<Quiz[]> {
  const quizzesRef = collection(firestore, `tenants/${tenantId}/quizzes`);
  const q = query(quizzesRef, orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
    } as Quiz;
  });
}

export async function getQuizById(
  tenantId: string,
  id: string
): Promise<Quiz | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/quizzes`, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
  } as Quiz;
}

export async function updateQuiz(
  tenantId: string,
  id: string,
  updates: Partial<Quiz>
): Promise<void> {
  const docRef = doc(firestore, `tenants/${tenantId}/quizzes`, id);
  const now = Timestamp.now();

  // Recalculate points if questions changed
  const extraUpdates: any = { updatedAt: now };
  if (updates.questions) {
    extraUpdates.totalPoints = updates.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );
  }

  await updateDoc(docRef, {
    ...updates,
    ...extraUpdates,
  });
}

export async function deleteQuiz(
  tenantId: string,
  id: string
): Promise<void> {
  const docRef = doc(firestore, `tenants/${tenantId}/quizzes`, id);
  await deleteDoc(docRef);
}

// --- Quiz Attempt Operations ---

export async function saveQuizAttempt(
  tenantId: string,
  attempt: Omit<QuizAttempt, "id">
): Promise<string> {
  const attemptsRef = collection(firestore, `tenants/${tenantId}/quizAttempts`);
  const docRef = await addDoc(attemptsRef, {
    ...attempt,
    startedAt: Timestamp.fromDate(attempt.startedAt),
    completedAt: attempt.completedAt ? Timestamp.fromDate(attempt.completedAt) : null,
  });
  return docRef.id;
}

export async function getQuizAttempts(
  tenantId: string,
  filter: { studentId?: string; quizId?: string }
): Promise<QuizAttempt[]> {
  const attemptsRef = collection(firestore, `tenants/${tenantId}/quizAttempts`);
  let q = query(attemptsRef, orderBy("startedAt", "desc"));

  if (filter.studentId) {
    q = query(q, where("studentId", "==", filter.studentId));
  }
  if (filter.quizId) {
    q = query(q, where("quizId", "==", filter.quizId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      startedAt: data.startedAt?.toDate?.() || new Date(data.startedAt),
      completedAt: data.completedAt?.toDate?.() || (data.completedAt ? new Date(data.completedAt) : null),
    } as QuizAttempt;
  });
}
