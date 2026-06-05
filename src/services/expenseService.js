/**
 * Expense Service
 * 
 * CRUD operations for expense documents in Firestore.
 * All expenses are scoped to the authenticated user via userId.
 */
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION_NAME = 'expenses';

/**
 * Adds a new expense document to Firestore.
 * @param {Object} data - Expense data (date, category, amount, description, receiptUrl, receiptName).
 * @param {string} userId - The authenticated user's UID.
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export async function addExpense(data, userId) {
  return addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    amount: Number(data.amount),
    userId,
    status: 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetches all expenses belonging to a specific user, ordered by creation date.
 * @param {string} userId - The authenticated user's UID.
 * @returns {Promise<Array<Object>>} Array of expense objects with IDs.
 */
export async function getExpenses(userId) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Updates the status of an expense document.
 * @param {string} expenseId - The Firestore document ID.
 * @param {string} status - New status ('draft' | 'submitted' | 'approved' | 'rejected').
 * @returns {Promise<void>}
 */
export async function updateExpenseStatus(expenseId, status) {
  const docRef = doc(db, COLLECTION_NAME, expenseId);
  return updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes an expense document from Firestore.
 * @param {string} expenseId - The Firestore document ID.
 * @returns {Promise<void>}
 */
export async function deleteExpense(expenseId) {
  const docRef = doc(db, COLLECTION_NAME, expenseId);
  return deleteDoc(docRef);
}
