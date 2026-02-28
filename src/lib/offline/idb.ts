
import { openDB, IDBPDatabase } from 'idb';
import { QuizAttempt } from '../types';

const DB_NAME = 'pertuto-offline-db';
const STORE_NAME = 'quiz-attempts';
const DB_VERSION = 1;

export async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('synced', 'synced');
        store.createIndex('studentId', 'studentId');
      }
    },
  });
}

export async function saveAttemptOffline(attempt: QuizAttempt): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, {
    ...attempt,
    synced: false,
    startedAt: attempt.startedAt.toISOString(), // IDB handles strings/dates but ISO is safer
    completedAt: attempt.completedAt?.toISOString(),
  });
}

export async function getUnsyncedAttempts(): Promise<any[]> {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, 'synced', 0); // 0 for false if using numeric or false if using boolean
}

export async function markAsSynced(id: string): Promise<void> {
  const db = await getDB();
  const attempt = await db.get(STORE_NAME, id);
  if (attempt) {
    attempt.synced = true;
    await db.put(STORE_NAME, attempt);
  }
}

export async function deleteOldAttempts(olderThanDays = 7): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const cursor = await store.openCursor();
  
  const cutOff = new Date();
  cutOff.setDate(cutOff.getDate() - olderThanDays);

  while (cursor) {
    const attemptDate = new Date(cursor.value.startedAt);
    if (attemptDate < cutOff && cursor.value.synced) {
      await cursor.delete();
    }
    await cursor.continue();
  }
}
