import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../src/supabase';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]); // Product IDs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Initial fetch
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (data) {
        setFavorites(data.map(f => f.product_id));
      }
      setLoading(false);
    };

    fetchFavorites();

    // Subscribe
    const channel = supabase
      .channel(`public:favorites:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'favorites', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Reload on change
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    const isFavorited = favorites.includes(productId);

    try {
      if (isFavorited) {
        // Remove
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        setFavorites(favs => favs.filter(id => id !== productId));
      } else {
        // Add
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        setFavorites(favs => [...favs, productId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorited = (productId: string) => favorites.includes(productId);

  return { favorites, loading, toggleFavorite, isFavorited };
};
