/**
 * Authentication Service
 * 
 * Wraps Firebase Authentication methods for sign-up, sign-in,
 * sign-out, and auth state observation.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

/**
 * Creates a new user account with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in a user using Google Authentication popup.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  return firebaseSignOut(auth);
}

/**
 * Subscribes to authentication state changes.
 * @param {function} callback - Called with the user object (or null).
 * @returns {function} Unsubscribe function.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
