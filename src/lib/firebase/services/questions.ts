
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../client-app";
import {
  Question,
  QuestionDifficulty,
  QuestionType,
  QuestionStatus,
  CognitiveDepth,
} from "../../types";

// --- Normalizer ---
/**
 * Normalizes a raw Firestore document into a well-typed PerTuto Question.
 * Handles legacy field names from TutorOS (content/stem, images/figures, etc.)
 */
export function normalizeQuestion(id: string, data: any): Question {
  return {
    id: id || "",
    stem: data.stem || data.content || data.stemMarkdown || "",
    type: (data.type as QuestionType) || "MCQ_SINGLE",
    difficulty: (data.difficulty as QuestionDifficulty) || "EASY",
    status: (data.status as QuestionStatus) || "DRAFT",
    options: data.options || [],
    correctAnswer: data.correctAnswer || "",
    explanation: data.explanation || "",
    figures: data.figures || data.images?.map((url: string) => ({ url })) || [],
    taxonomy: {
      domainId: data.taxonomy?.domainId || data.domainId || "",
      topicId: data.taxonomy?.topicId || data.topicId || "",
      subTopicId: data.taxonomy?.subTopicId || data.subTopicId || "",
      cognitiveDepth: (data.taxonomy?.cognitiveDepth as CognitiveDepth) || "CONCEPTUAL",
      scaffoldLevel: data.taxonomy?.scaffoldLevel || 1,
      curriculum: data.taxonomy?.curriculum || "",
      standardMapping: data.taxonomy?.standardMapping || "",
    },
    source: data.source || { origin: "MANUAL" },
    confidenceScore: data.confidenceScore || 0,
    createdBy: data.createdBy || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
  };
}

// --- Sanitizer ---
const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) {
      delete result[key];
    } else if (
      result[key] !== null &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      !(result[key] instanceof Date) &&
      !(result[key] instanceof Timestamp)
    ) {
      result[key] = sanitizeForFirestore(result[key]);
    }
  });
  return result;
};

// --- CRUD Operations ---

export async function createQuestion(
  tenantId: string,
  questionData: Omit<Question, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const questionsRef = collection(firestore, `tenants/${tenantId}/questions`);
  const sanitized = sanitizeForFirestore({
    ...questionData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  const docRef = await addDoc(questionsRef, sanitized);
  return docRef.id;
}

export async function getQuestions(
  tenantId: string,
  filter?: {
    domainId?: string;
    topicId?: string;
    difficulty?: QuestionDifficulty;
    status?: QuestionStatus;
  },
  pageSize: number = 20,
  lastDocSnap?: any
) {
  const questionsRef = collection(firestore, `tenants/${tenantId}/questions`);
  let q = query(questionsRef, orderBy("createdAt", "desc"), limit(pageSize));

  if (filter?.domainId) {
    q = query(q, where("taxonomy.domainId", "==", filter.domainId));
  }
  if (filter?.topicId) {
    q = query(q, where("taxonomy.topicId", "==", filter.topicId));
  }
  if (filter?.difficulty) {
    q = query(q, where("difficulty", "==", filter.difficulty));
  }
  if (filter?.status) {
    q = query(q, where("status", "==", filter.status));
  }

  if (lastDocSnap) {
    q = query(q, startAfter(lastDocSnap));
  }

  const snapshot = await getDocs(q);
  const questions = snapshot.docs.map((d) => normalizeQuestion(d.id, d.data()));

  return {
    questions,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
}

export async function getQuestionById(
  tenantId: string,
  id: string
): Promise<Question | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/questions`, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return normalizeQuestion(docSnap.id, docSnap.data());
  }
  return null;
}

export async function updateQuestion(
  tenantId: string,
  id: string,
  data: Partial<Question>
): Promise<void> {
  const docRef = doc(firestore, `tenants/${tenantId}/questions`, id);
  const sanitized = sanitizeForFirestore({
    ...data,
    updatedAt: Timestamp.now(),
  });
  await updateDoc(docRef, sanitized);
}

export async function deleteQuestion(
  tenantId: string,
  id: string
): Promise<void> {
  const docRef = doc(firestore, `tenants/${tenantId}/questions`, id);
  await deleteDoc(docRef);
}

export async function batchCreateQuestions(
  tenantId: string,
  questions: Omit<Question, "id" | "createdAt" | "updatedAt">[]
): Promise<string[]> {
  const batch = writeBatch(firestore);
  const questionsRef = collection(firestore, `tenants/${tenantId}/questions`);
  const results: string[] = [];

  questions.forEach((q) => {
    const docRef = doc(questionsRef);
    const sanitized = sanitizeForFirestore({
      ...q,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    batch.set(docRef, sanitized);
    results.push(docRef.id);
  });

  await batch.commit();
  return results;
}

export async function batchUpdateStatus(
  tenantId: string,
  ids: string[],
  status: QuestionStatus
): Promise<void> {
  const batch = writeBatch(firestore);
  ids.forEach((id) => {
    const docRef = doc(firestore, `tenants/${tenantId}/questions`, id);
    batch.update(docRef, { status, updatedAt: Timestamp.now() });
  });
  await batch.commit();
}
