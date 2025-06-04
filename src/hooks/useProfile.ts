import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      setLoading(true);

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (profileError) {
        toast.error("Error updating profile");
        console.error("Error updating profile:", profileError);
        return false;
      }

      // If full_name is being updated, also update user metadata
      if (updates.full_name !== undefined) {
        const { error: userError } = await supabase.auth.updateUser({
          data: { full_name: updates.full_name },
        });

        if (userError) {
          console.error("Error updating user metadata:", userError);
          // Don't return false here as the profile was updated successfully
        }
      }

      toast.success("Profile updated successfully");
      await fetchProfile();
      return true;
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating profile:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
  };
}
