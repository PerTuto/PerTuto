
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";

/**
 * Uploads a buffer to Firebase Storage and returns a public download URL.
 * Uses Firebase download tokens for public access.
 */
export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string = "image/png"
): Promise<string> {
  const bucket = getStorage().bucket();
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: { contentType },
  });

  const downloadToken = randomUUID();
  await file.setMetadata({
    metadata: {
      firebaseStorageDownloadTokens: downloadToken,
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
}
