import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '../src/firebase';
import { User } from '../types';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enable persistence on init
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(err =>
      console.error('Persistence error:', err)
    );
  }, []);

  // Listen for auth state changes and check admin claims
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        });
        // Get custom claims to check admin status
        const claims = await firebaseUser.getIdTokenResult();
        setIsAdmin(claims.claims?.admin === true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        email: result.user.email || email,
        name,
      });
      return result.user;
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        email: result.user.email || email,
        name: result.user.displayName || email.split('@')[0],
      });
      return result.user;
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Logout failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    user,
    isAdmin,
    loading,
    error,
    register,
    login,
    logout,
  };
};
