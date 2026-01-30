import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../src/firebase';

export const useFirestore = <T extends { id: string }>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all documents from collection
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
      setData(docs);
    } catch (err: any) {
      const errorMsg = err.message || `Failed to fetch from ${collectionName}`;
      setError(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for collection
  const subscribeToAll = () => {
    setLoading(true);
    const collectionRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      collectionRef,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setData(docs);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  };

  // Query with filters
  const query_custom = async (constraints: QueryConstraint[]) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
      setData(docs);
      return docs;
    } catch (err: any) {
      const errorMsg = err.message || 'Query failed';
      setError(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create document
  const create = async (docData: Omit<T, 'id'>) => {
    setError(null);
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, docData);
      const newDoc: T = { id: docRef.id, ...docData } as T;
      setData(prev => [...prev, newDoc]);
      return newDoc;
    } catch (err: any) {
      const errorMsg = err.message || 'Create failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Update document
  const update = async (docId: string, updates: Partial<T>) => {
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, updates);
      setData(prev =>
        prev.map(item => (item.id === docId ? { ...item, ...updates } : item))
      );
    } catch (err: any) {
      const errorMsg = err.message || 'Update failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Delete document
  const remove = async (docId: string) => {
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      setData(prev => prev.filter(item => item.id !== docId));
    } catch (err: any) {
      const errorMsg = err.message || 'Delete failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    data,
    loading,
    error,
    fetchAll,
    subscribeToAll,
    query: query_custom,
    create,
    update,
    remove,
  };
};
