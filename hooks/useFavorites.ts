import { useEffect, useState } from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { doc, collection, addDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../src/firebase';

export const useFavorites = () => {
  const { user } = useFirebaseAuth();
  const [favorites, setFavorites] = useState<string[]>([]); // Product IDs
  const [loading, setLoading] = useState(true);

  // Load and subscribe to favorites from Firestore
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Subscribe to user's favorites collection
      const favoritesRef = collection(db, `favorites/${user.id}/items`);
      const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
        const productIds = snapshot.docs.map(doc => doc.data().productId);
        setFavorites(productIds);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to favorites:', err);
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    const isFavorited = favorites.includes(productId);
    
    try {
      if (isFavorited) {
        // Find and delete the favorite
        const favoritesRef = collection(db, `favorites/${user.id}/items`);
        const snapshot = await getDocs(favoritesRef);
        const favDoc = snapshot.docs.find(doc => doc.data().productId === productId);
        if (favDoc) {
          await deleteDoc(doc(db, `favorites/${user.id}/items`, favDoc.id));
        }
        setFavorites(favs => favs.filter(id => id !== productId));
      } else {
        // Add new favorite
        const favoritesRef = collection(db, `favorites/${user.id}/items`);
        await addDoc(favoritesRef, {
          productId,
          addedAt: new Date().toISOString()
        });
        setFavorites(favs => [...favs, productId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorited = (productId: string) => favorites.includes(productId);

  return { favorites, loading, toggleFavorite, isFavorited };
};
