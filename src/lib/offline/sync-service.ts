
import { getUnsyncedAttempts, markAsSynced } from './idb';
import { saveQuizAttempt } from '../firebase/services/quizzes';

export async function syncOfflineAttempts(tenantId: string) {
  if (!navigator.onLine) return;

  try {
    const unsynced = await getUnsyncedAttempts();
    if (unsynced.length === 0) return;

    console.log(`[SyncService] Found ${unsynced.length} unsynced attempts. Starting sync...`);

    for (const attempt of unsynced) {
      try {
        const { id, synced, ...rest } = attempt;
        // Convert ISO strings back to Dates for Firestore
        const dataToSave = {
           ...rest,
           startedAt: new Date(attempt.startedAt),
           completedAt: attempt.completedAt ? new Date(attempt.completedAt) : null,
        };

        await saveQuizAttempt(tenantId, dataToSave);
        await markAsSynced(id);
        console.log(`[SyncService] Successfully synced attempt: ${id}`);
      } catch (err) {
        console.error(`[SyncService] Failed to sync attempt ${attempt.id}:`, err);
      }
    }
  } catch (error) {
    console.error('[SyncService] Global sync error:', error);
  }
}

// Background sync registration if supported
export function registerBackgroundSync(tenantId: string) {
  // 1. Initial sync on load
  syncOfflineAttempts(tenantId);

  // 2. Listen for online status
  window.addEventListener('online', () => syncOfflineAttempts(tenantId));

  // 3. Periodic interval (fallback for long-running sessions)
  setInterval(() => syncOfflineAttempts(tenantId), 5 * 60 * 1000); // Every 5 mins
}
