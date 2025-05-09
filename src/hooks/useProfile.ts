
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.email)
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
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.email);
      
      if (error) {
        toast.error("Error updating profile");
        console.error("Error updating profile:", error);
        return false;
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

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile
  };
}
