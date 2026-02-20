/**
 * Content Service - Firestore Operations
 * CRUD for Topics, Resources, Questions
 */

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Topic, Resource, Question, Curriculum, Subject } from '@/types/content';

// ============================
// COLLECTIONS
// ============================

const COLLECTIONS = {
    curricula: 'curricula',
    subjects: 'subjects',
    topics: 'topics',
    resources: 'resources',
    questions: 'questions',
    uploads: 'uploads',
} as const;

// ============================
// CURRICULA
// ============================

export async function getCurricula(): Promise<Curriculum[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.curricula));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Curriculum));
}

export async function getCurriculumBySlug(slug: string): Promise<Curriculum | null> {
    const q = query(collection(db, COLLECTIONS.curricula), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Curriculum;
}

// ============================
// SUBJECTS
// ============================

export async function getSubjectsByCurriculum(curriculumId: string): Promise<Subject[]> {
    const q = query(
        collection(db, COLLECTIONS.subjects),
        where('curriculumId', '==', curriculumId),
        orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
}

// ============================
// TOPICS
// ============================

export async function getTopicsBySubject(subjectId: string, curriculumId: string): Promise<Topic[]> {
    const q = query(
        collection(db, COLLECTIONS.topics),
        where('subjectId', '==', subjectId),
        where('curriculumId', '==', curriculumId),
        orderBy('order')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic));
}

export async function getTopicByPath(path: string): Promise<Topic | null> {
    const q = query(collection(db, COLLECTIONS.topics), where('path', '==', path), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Topic;
}

export async function createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.topics), {
        ...topic,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
    return docRef.id;
}

export async function updateTopic(id: string, data: Partial<Topic>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.topics, id), {
        ...data,
        updatedAt: Timestamp.now()
    });
}

// ============================
// RESOURCES (Notes, Formula Sheets)
// ============================

export async function getResourcesByTopic(topicId: string): Promise<Resource[]> {
    const q = query(
        collection(db, COLLECTIONS.resources),
        where('topicId', '==', topicId),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
    const q = query(collection(db, COLLECTIONS.resources), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Resource;
}

export async function getResourcesForAdmin(): Promise<Resource[]> {
    const q = query(
        collection(db, COLLECTIONS.resources),
        orderBy('updatedAt', 'desc'),
        limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
}

export async function createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.resources), {
        ...resource,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
    return docRef.id;
}

export async function updateResource(id: string, data: Partial<Resource>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.resources, id), {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteResource(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.resources, id));
}

// ============================
// QUESTIONS
// ============================

export async function getQuestionsByTopic(topicId: string): Promise<Question[]> {
    const q = query(
        collection(db, COLLECTIONS.questions),
        where('topicId', '==', topicId),
        where('isPublished', '==', true),
        orderBy('difficulty')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
}

export async function getPendingQuestions(): Promise<Question[]> {
    const q = query(
        collection(db, COLLECTIONS.questions),
        where('isApproved', '==', false),
        orderBy('createdAt', 'desc'),
        limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
}

export async function createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.questions), {
        ...question,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
    return docRef.id;
}

export async function approveQuestion(id: string): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.questions, id), {
        isApproved: true,
        isPublished: true,
        updatedAt: Timestamp.now()
    });
}

export async function rejectQuestion(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.questions, id));
}

// ============================
// SEED DATA (IB MYP Math)
// ============================

export async function seedIBMYPMath(): Promise<void> {
    // Check if already seeded
    const existing = await getCurriculumBySlug('ib-myp');
    if (existing) {
        console.log('IB MYP already seeded');
        return;
    }

    // Create Curriculum
    const curriculumRef = await addDoc(collection(db, COLLECTIONS.curricula), {
        name: 'IB Middle Years Programme',
        slug: 'ib-myp',
        description: 'International Baccalaureate Middle Years Programme (Ages 11-16)',
        createdAt: Timestamp.now()
    });

    // Create Math Subject
    const subjectRef = await addDoc(collection(db, COLLECTIONS.subjects), {
        curriculumId: curriculumRef.id,
        name: 'Mathematics',
        slug: 'math',
        description: 'MYP Mathematics for Years 1-5',
        icon: 'Calculator',
        createdAt: Timestamp.now()
    });

    // Create Topics (MYP Math strands)
    const topics = [
        { name: 'Number', slug: 'number', order: 1 },
        { name: 'Algebra', slug: 'algebra', order: 2 },
        { name: 'Geometry & Trigonometry', slug: 'geometry', order: 3 },
        { name: 'Statistics & Probability', slug: 'statistics', order: 4 },
    ];

    for (const topic of topics) {
        await addDoc(collection(db, COLLECTIONS.topics), {
            ...topic,
            subjectId: subjectRef.id,
            curriculumId: curriculumRef.id,
            path: `ib-myp/math/${topic.slug}`,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    }

    console.log('✅ IB MYP Math seeded successfully');
}
