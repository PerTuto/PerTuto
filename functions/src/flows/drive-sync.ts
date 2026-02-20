import { z } from 'zod';
import { ai } from '../config/genkit';
import { DriveService } from '../utils/drive';
import * as admin from 'firebase-admin';

const DriveSyncInput = z.object({
    folderId: z.string(),
    serviceAccountKey: z.any(),
    curriculum: z.string().optional(),
    subject: z.string().optional(),
});

export const syncDriveFolderFlow = ai.defineFlow(
    {
        name: 'syncDriveFolder',
        inputSchema: DriveSyncInput,
        outputSchema: z.object({
            newFilesCount: z.number(),
            processedFiles: z.array(z.string())
        }),
    },
    async (input) => {
        const { folderId, serviceAccountKey, curriculum, subject } = input;
        const drive = new DriveService(serviceAccountKey);
        const db = admin.firestore();

        // 1. List files in folder
        const files = await drive.listFiles(folderId);
        const processedFiles: string[] = [];
        let newFilesCount = 0;

        for (const file of files) {
            if (!file.id || !file.name || file.mimeType !== 'application/pdf') continue;

            // 2. Check if already processed
            const doc = await db.collection('processed_drive_files').doc(file.id).get();
            if (doc.exists) continue;

            // 3. Mark as pending
            await db.collection('content_queue').add({
                fileId: file.id,
                fileName: file.name,
                status: 'pending',
                curriculum: curriculum || 'Unknown',
                subject: subject || 'Unknown',
                source: 'google_drive',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // 4. Record as processed (to avoid re-syncing)
            await db.collection('processed_drive_files').doc(file.id).set({
                name: file.name,
                syncedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            processedFiles.push(file.name);
            newFilesCount++;
        }

        return { newFilesCount, processedFiles };
    }
);
