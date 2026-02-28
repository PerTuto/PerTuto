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
} from "firebase/firestore";
import { db } from "./config";
import {
  Question,
  QuestionDifficulty,
  QuestionType,
  normalizeQuestion,
} from "@/types/question";

const QUESTIONS_COLLECTION = "questions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) {
      delete result[key];
    } else if (
      result[key] !== null &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      // Recursively sanitize nested objects
      result[key] = sanitizeForFirestore(result[key]);
    }
  });
  return result;
};

export const batchCreateQuestions = async (
  questions: Omit<Question, "id" | "createdAt" | "updatedAt">[],
) => {
  try {
    const batch = writeBatch(db);
    const results: string[] = [];

    questions.forEach((q) => {
      const docRef = doc(collection(db, QUESTIONS_COLLECTION));
      const sanitized = sanitizeForFirestore({
        ...q,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      batch.set(docRef, sanitized);
      results.push(docRef.id);
    });

    await batch.commit();
    return results;
  } catch (error) {
    console.error("Error in batchCreateQuestions:", error);
    throw new Error(
      "Failed to create multiple questions. Please check your data.",
    );
  }
};

// --- CRUD Operations ---

export const createQuestion = async (
  questionData: Omit<Question, "id" | "createdAt" | "updatedAt">,
) => {
  try {
    const sanitized = sanitizeForFirestore({
      ...questionData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const docRef = await addDoc(
      collection(db, QUESTIONS_COLLECTION),
      sanitized,
    );
    return docRef.id;
  } catch (error) {
    console.error("Error in createQuestion:", error);
    throw new Error("Failed to create question. You may not have permission.");
  }
};

export const getQuestions = async (
  filter?: {
    domainId?: string;
    topicId?: string;
    difficulty?: QuestionDifficulty;
  },
  pageSize: number = 20,
  lastDoc?: unknown,
) => {
  try {
    let q = query(
      collection(db, QUESTIONS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize),
    );

    if (filter?.domainId) {
      q = query(q, where("domainId", "==", filter.domainId));
    }
    if (filter?.topicId) {
      q = query(q, where("topicId", "==", filter.topicId));
    }
    if (filter?.difficulty) {
      q = query(q, where("difficulty", "==", filter.difficulty));
    }

    if (lastDoc) {
      q = query(
        q,
        startAfter(lastDoc as import("firebase/firestore").DocumentData),
      );
    }

    const snapshot = await getDocs(q);
    const questions = snapshot.docs.map((doc) =>
      normalizeQuestion({ id: doc.id, ...doc.data() }),
    );

    return {
      questions,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  } catch (error) {
    console.error("Error in getQuestions:", error);
    throw new Error("Failed to fetch questions. Please try again later.");
  }
};

export const getQuestionById = async (id: string): Promise<Question | null> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return normalizeQuestion({ id: docSnap.id, ...docSnap.data() });
  }
  return null;
};

export const updateQuestion = async (id: string, data: Partial<Question>) => {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, id);
    const sanitized = sanitizeForFirestore({
      ...data,
      updatedAt: Date.now(),
    });
    await updateDoc(docRef, sanitized);
  } catch (error) {
    console.error("Error in updateQuestion:", error);
    throw new Error("Failed to update question. Check your permissions.");
  }
};

export const deleteQuestion = async (id: string) => {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error in deleteQuestion:", error);
    throw new Error("Failed to delete question.");
  }
};

// --- Status-based queries ---

export const getQuestionsByStatus = async (
  status: "draft" | "pending" | "approved" | "rejected",
  pageSize: number = 50,
  lastDoc?: unknown,
) => {
  try {
    let q = query(
      collection(db, QUESTIONS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
      limit(pageSize),
    );

    if (lastDoc) {
      q = query(
        q,
        startAfter(lastDoc as import("firebase/firestore").DocumentData),
      );
    }

    const snapshot = await getDocs(q);
    const questions = snapshot.docs.map((doc) =>
      normalizeQuestion({ id: doc.id, ...doc.data() }),
    );

    return {
      questions,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  } catch (error) {
    console.error("Error in getQuestionsByStatus:", error);
    throw new Error("Failed to fetch questions by status.");
  }
};

export const batchUpdateStatus = async (
  ids: string[],
  status: "draft" | "pending" | "approved" | "rejected",
) => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, QUESTIONS_COLLECTION, id);
      batch.update(docRef, { status, updatedAt: Date.now() });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error in batchUpdateStatus:", error);
    throw new Error("Failed to update question statuses.");
  }
};

// --- Seeding Helper (Dev Only) ---

export const seedSampleQuestions = async () => {
  if (process.env.NODE_ENV === "production") {
    console.warn("seedSampleQuestions blocked in production");
    return;
  }

  const sampleCoT: Omit<Question, "id" | "createdAt" | "updatedAt"> = {
    title: "Complex Polish Notation",
    content: "Evaluate the expression $3 \\times (4 + 5) - 6$.",
    type: QuestionType.FREE_RESPONSE,
    correctAnswer: "21",
    difficulty: QuestionDifficulty.BEGINNER,
    chainOfThought: [
      "Step 1: Solve the expression inside the parentheses: $(4 + 5) = 9$.",
      "Step 2: Multiply the result by 3: $3 \\times 9 = 27$.",
      "Step 3: Subtract 6 from the result: $27 - 6 = 21$.",
    ],
    domainId: "math-core",
    topicId: "alg-1",
    source: {
      dataset: "NuminaMath",
      license: "CC-BY-4.0",
    },
    status: "approved",
  };

  const sampleGeo: Omit<Question, "id" | "createdAt" | "updatedAt"> = {
    title: "Triangle Properties",
    content: "In the given diagram, find the value of angle $x$.",
    type: QuestionType.MCQ_SINGLE,
    options: [
      { text: "30°", isCorrect: false },
      { text: "45°", isCorrect: false },
      { text: "60°", isCorrect: true },
      { text: "90°", isCorrect: false },
    ],
    difficulty: QuestionDifficulty.INTERMEDIATE,
    images: ["https://placehold.co/600x400/png?text=Triangle+Diagram"],
    domainId: "math-core",
    topicId: "geo",
    source: {
      dataset: "Seeded",
    },
    status: "approved",
  };

  await createQuestion(sampleCoT);
  await createQuestion(sampleGeo);
};

export const seedOpenStaxQuestions = async () => {
  if (process.env.NODE_ENV === "production") {
    console.warn("seedOpenStaxQuestions blocked in production");
    return;
  }

  const openStaxQuestions: Omit<Question, "id" | "createdAt" | "updatedAt">[] =
    [
      {
        title: "Multiplying Exponents",
        content: "Simplify the expression: $x^3 \\cdot x^4$.",
        type: QuestionType.FREE_RESPONSE,
        correctAnswer: "x^7",
        difficulty: QuestionDifficulty.BEGINNER,
        domainId: "math-openstax",
        topicId: "alg-trig-2e",
        subTopicId: "alg-ch-1",
        explanation:
          "When multiplying terms with the same base, you add the exponents: $x^a \\cdot x^b = x^{a+b}$.",
        source: { dataset: "OpenStax", license: "CC-BY-4.0" },
        status: "approved",
      },
      {
        title: "Solving Linear Equations",
        content: "Solve for $x$: $3x + 5 = 20$.",
        type: QuestionType.FREE_RESPONSE,
        correctAnswer: "5",
        difficulty: QuestionDifficulty.BEGINNER,
        domainId: "math-openstax",
        topicId: "alg-trig-2e",
        subTopicId: "alg-ch-2",
        chainOfThought: [
          "Subtract 5 from both sides: $3x = 15$.",
          "Divide both sides by 3: $x = 5$.",
        ],
        source: { dataset: "OpenStax", license: "CC-BY-4.0" },
        status: "approved",
      },
      {
        title: "Domain of a Square Root",
        content: "Find the domain of the function $f(x) = \\sqrt{x - 4}$.",
        type: QuestionType.MCQ_SINGLE,
        options: [
          { text: "$x \\ge 4$", isCorrect: true },
          { text: "$x > 4$", isCorrect: false },
          { text: "$x \\le 4$", isCorrect: false },
          { text: "All real numbers", isCorrect: false },
        ],
        difficulty: QuestionDifficulty.INTERMEDIATE,
        domainId: "math-openstax",
        topicId: "alg-trig-2e",
        subTopicId: "alg-ch-3",
        explanation:
          "The expression inside a square root must be non-negative. $x - 4 \\ge 0 \\implies x \\ge 4$.",
        source: { dataset: "OpenStax", license: "CC-BY-4.0" },
        status: "approved",
      },
    ];

  await batchCreateQuestions(openStaxQuestions);
};
