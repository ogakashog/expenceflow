/* eslint-disable react-refresh/only-export-components */
/**
 * useAuth Hook
 * 
 * Provides authentication context (user, loading state, login/signup/logout)
 * via React Context so any component in the tree can access auth state.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, signIn, signUp, signOutUser, signInWithGoogle } from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides auth state + methods to all children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Log in with email and password.
   */
  const login = async (email, password) => {
    return signIn(email, password);
  };

  /**
   * Log in with Google.
   */
  const loginWithGoogle = async () => {
    return signInWithGoogle();
  };

  /**
   * Create a new account with email and password.
   */
  const signup = async (email, password) => {
    return signUp(email, password);
  };

  /**
   * Sign out the current user.
   */
  const logout = async () => {
    return signOutUser();
  };

  const value = { user, loading, login, loginWithGoogle, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context from any component.
 * @returns {{ user: object|null, loading: boolean, login: function, signup: function, logout: function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
