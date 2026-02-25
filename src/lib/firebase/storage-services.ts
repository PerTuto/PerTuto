import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './client-app';

/**
 * Uploads a file to Firebase Storage under the tenant's assignment path.
 * Returns the download URL.
 */
export async function uploadAssignmentFile(
  file: File,
  assignmentId: string,
  studentId: string,
  tenantId: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `tenants/${tenantId}/assignments/${assignmentId}/${studentId}_${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      studentId,
      assignmentId,
      uploadedAt: new Date().toISOString(),
    },
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * Lists all submitted files for a specific assignment.
 */
export async function getAssignmentFiles(
  tenantId: string,
  assignmentId: string
): Promise<{ name: string; url: string }[]> {
  const folderRef = ref(storage, `tenants/${tenantId}/assignments/${assignmentId}`);
  
  try {
    const result = await listAll(folderRef);
    const files = await Promise.all(
      result.items.map(async (itemRef) => ({
        name: itemRef.name,
        url: await getDownloadURL(itemRef),
      }))
    );
    return files;
  } catch (error) {
    // Folder may not exist yet — that's fine
    console.warn('No files found or error listing files:', error);
    return [];
  }
}
