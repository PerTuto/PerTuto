import { getStorage } from "firebase-admin/storage";

/**
 * Uploads a buffer to Firebase Storage and returns a public download URL.
 * Uses Firebase download tokens, which work with Uniform Bucket-Level Access
 * and don't require iam.serviceAccounts.signBlob permissions.
 */
export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string = "image/png",
): Promise<string> {
  const bucket = getStorage().bucket();
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: { contentType },
  });

  // Generate a Firebase-style download token for public access.
  // This works with Uniform Bucket-Level Access (which blocks makePublic/signedUrl).
  const crypto = await import("crypto");
  const downloadToken = crypto.randomUUID();
  await file.setMetadata({
    metadata: {
      firebaseStorageDownloadTokens: downloadToken,
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
}
