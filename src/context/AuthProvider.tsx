import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_DEPLOY_URL || window.location.origin

  const fetchUserRoles = async (userId: string): Promise<UserRole[]> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data?.map(row => row.role as UserRole) || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  const supabaseUserToUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
    if (!supabaseUser) return null;
    
    const roles = await fetchUserRoles(supabaseUser.id);
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata.full_name || "",
      roles,
    };
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = await supabaseUserToUser(session?.user ?? null);
      setUser(user);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = await supabaseUserToUser(session?.user ?? null);
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    console.log("signInWithMagicLink baseUrl", baseUrl);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getDisplayName = (): string => {
    if (!user) return "anon";
    return user.name || user.email.split("@")[0] || "commoner";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithMagicLink, signOut, getDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
}
