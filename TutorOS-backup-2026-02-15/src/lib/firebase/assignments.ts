import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import { QuizAssignment, AssignmentStatus, QuizAttempt } from "@/types/user";

const ASSIGNMENTS_COLLECTION = "assignments";
const ATTEMPTS_COLLECTION = "attempts";

export const assignQuizToStudent = async (
  quizId: string,
  studentId: string,
  assignedBy: string,
  dueDate?: number,
): Promise<string> => {
  try {
    const id = doc(collection(db, ASSIGNMENTS_COLLECTION)).id;
    const assignment: QuizAssignment = {
      id,
      quizId,
      studentId,
      assignedBy,
      assignedAt: Date.now(),
      dueDate,
      status: AssignmentStatus.ASSIGNED,
    };

    await setDoc(doc(db, ASSIGNMENTS_COLLECTION, id), assignment);
    return id;
  } catch (error) {
    console.error("Error in assignQuizToStudent:", error);
    throw new Error("Failed to assign quiz to student.");
  }
};

export const getStudentAssignments = async (
  studentId: string,
): Promise<QuizAssignment[]> => {
  try {
    const q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      where("studentId", "==", studentId),
      orderBy("assignedAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as QuizAssignment);
  } catch (error) {
    console.error("Error in getStudentAssignments:", error);
    throw new Error("Failed to fetch assignments.");
  }
};

export const startQuizAttempt = async (
  assignmentId: string,
  quizId: string,
  studentId: string,
): Promise<string> => {
  try {
    const attemptId = doc(collection(db, ATTEMPTS_COLLECTION)).id;
    const now = Date.now();

    const attempt: QuizAttempt = {
      id: attemptId,
      quizId,
      studentId,
      score: 0,
      totalPoints: 0, // Will be set on completion
      answers: {},
      status: AssignmentStatus.IN_PROGRESS,
      startedAt: now,
    };

    await setDoc(doc(db, ATTEMPTS_COLLECTION, attemptId), attempt);
    await updateDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId), {
      status: AssignmentStatus.IN_PROGRESS,
      attemptId,
    });

    return attemptId;
  } catch (error) {
    console.error("Error in startQuizAttempt:", error);
    throw new Error("Failed to start the quiz. Please check your connection.");
  }
};

export const submitQuizAttempt = async (
  attemptId: string,
  assignmentId: string,
  answers: Record<string, string | number | boolean>,
  score: number,
  totalPoints: number,
) => {
  try {
    const now = Date.now();
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, attemptId), {
      answers,
      score,
      totalPoints,
      status: AssignmentStatus.COMPLETED,
      completedAt: now,
    });

    await updateDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId), {
      status: AssignmentStatus.COMPLETED,
    });
  } catch (error) {
    console.error("Error in submitQuizAttempt:", error);
    throw new Error("Failed to submit your answers. Please try again.");
  }
};
