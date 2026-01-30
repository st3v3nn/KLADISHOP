import { useEffect, useState } from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { useFirestore } from './useFirestore';

export const useFavorites = () => {
  const { user } = useFirebaseAuth();
  const { subscribeToAll, create, remove } = useFirestore();
  const [favorites, setFavorites] = useState<string[]>([]); // Product IDs
  const [loading, setLoading] = useState(true);

  // Load favorites from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Subscribe to user's favorites collection
    const unsubscribe = subscribeToAll(`favorites/${user.id}`, (favs: any[]) => {
      const productIds = favs.map(fav => fav.productId);
      setFavorites(productIds);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, subscribeToAll]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    const isFavorited = favorites.includes(productId);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        await remove(`favorites/${user.id}`, productId);
        setFavorites(favs => favs.filter(id => id !== productId));
      } else {
        // Add to favorites
        await create(`favorites/${user.id}`, {
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
