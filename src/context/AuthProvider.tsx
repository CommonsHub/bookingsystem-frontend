
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(supabaseUserToUser(session?.user ?? null));
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(supabaseUserToUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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

const supabaseUserToUser = (user: SupabaseUser | null): User | null => {
  if (!user) return null;
  return {
    email: user.email || "",
    name: user.user_metadata.full_name || "",
    verified: user.user_metadata.email_verified || false,
  };
};
