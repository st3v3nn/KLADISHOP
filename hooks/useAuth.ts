import { useState, useEffect } from 'react';
import { supabase } from '../src/supabase';
import { User } from '../types';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check active session and ensure loading is cleared after admin check
        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    });
                    await checkAdmin(session.user.id);
                }
            } catch (err) {
                console.warn('Error checking session:', err);
            } finally {
                setLoading(false);
            }
        })();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                });
                await checkAdmin(session.user.id);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAdmin = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Error fetching admin status:', error.message);
                // If profile doesn't exist yet, we can't be admin
                setIsAdmin(false);
            } else {
                setIsAdmin(data?.is_admin || false);
            }
        } catch (err) {
            console.error(err);
            setIsAdmin(false);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        setError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;

            // Profile creation is typically handled by a Trigger in Supabase,
            // but if we don't have triggers set up, we should manually create it.
            // We'll trust the schema trigger or manual insertion here.
            if (data.user) {
                // Manual insertion just in case
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    email: email,
                    full_name: name,
                    is_admin: false
                });
            }

            return data.user;
        } catch (err: any) {
            const errorMsg = err.message || 'Registration failed';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return data.user;
        } catch (err: any) {
            const errorMsg = err.message || 'Login failed';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setIsAdmin(false);
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
