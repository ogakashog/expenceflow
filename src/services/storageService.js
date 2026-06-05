/**
 * Storage Service
 * 
 * Handles file uploads and deletions in Firebase Storage.
 * Receipts are stored under receipts/{userId}/{timestamp}_{filename}.
 */
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../firebase/firebase';

/**
 * Uploads a receipt file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} userId - The authenticated user's UID.
 * @returns {Promise<{url: string, path: string}>} The download URL and storage path.
 */
export async function uploadReceipt(file, userId) {
  const storagePath = `receipts/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return { url, path: storagePath };
}

/**
 * Deletes a receipt file from Firebase Storage.
 * @param {string} storagePath - The full path of the file in Storage.
 * @returns {Promise<void>}
 */
export async function deleteReceipt(storagePath) {
  if (!storagePath) return;
  const storageRef = ref(storage, storagePath);
  return deleteObject(storageRef);
}
