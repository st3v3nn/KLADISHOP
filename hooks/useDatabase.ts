import { useState, useEffect } from 'react';
import { supabase } from '../src/supabase';

export const useDatabase = <T extends { id: string }>(tableName: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: result, error: err } = await supabase
                .from(tableName)
                .select('*');

            if (err) throw err;
            setData(result as T[] || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToAll = () => {
        setLoading(true);
        // Initial fetch
        fetchAll();

        const channel = supabase
            .channel(`public:${tableName}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: tableName },
                (payload) => {
                    // Handle realtime updates
                    // Simplest is to refetch or manually merge
                    // For now, let's just refetch to be safe/lazy
                    fetchAll();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const create = async (docData: Omit<T, 'id'>) => {
        setError(null);
        try {
            // We assume the schema handles ID generation if not provided, or we can generate one if needed.
            // However, the generic T has ID. 
            // If the table has UUID default, we don't send it. 
            // If it is text ID (products), we might need to send it if we are creating. 

            const { data: newDoc, error: err } = await supabase
                .from(tableName)
                .insert(docData)
                .select()
                .single();

            if (err) throw err;

            setData(prev => [...prev, newDoc as T]);
            return newDoc as T;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const update = async (id: string, updates: Partial<T>) => {
        setError(null);
        try {
            const { error: err } = await supabase
                .from(tableName)
                .update(updates)
                .eq('id', id);

            if (err) throw err;

            setData(prev =>
                prev.map(item => item.id === id ? { ...item, ...updates } : item)
            );
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const remove = async (id: string) => {
        setError(null);
        try {
            const { error: err } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (err) throw err;

            setData(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        data,
        loading,
        error,
        fetchAll,
        subscribeToAll,
        create,
        update,
        remove
    };
};
