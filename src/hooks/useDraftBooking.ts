
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast-utils";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";

type DraftBookingData = Record<string, any>;

export const useDraftBooking = () => {
  const { user } = useAuth();
  const [draftKey, setDraftKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a consistent draft key for the current user
  useEffect(() => {
    if (user?.email) {
      const userDraftKey = `booking-draft-${user.email}`;
      setDraftKey(userDraftKey);
    } else {
      // For anonymous users, generate a random key and store it
      const storedKey = localStorage.getItem("anonymous-booking-draft-key");
      if (storedKey) {
        setDraftKey(storedKey);
      } else {
        const newKey = `booking-draft-anonymous-${uuidv4()}`;
        localStorage.setItem("anonymous-booking-draft-key", newKey);
        setDraftKey(newKey);
      }
    }
  }, [user?.email]);

  // Save draft data to both localStorage and Supabase
  const saveDraft = async (data: DraftBookingData): Promise<void> => {
    if (!draftKey) return;

    try {
      // Save to localStorage
      localStorage.setItem(draftKey, JSON.stringify(data));
      
      // If user is logged in, also save to Supabase
      if (user?.email) {
        setIsLoading(true);
        
        // Check if there's already a draft booking for this user
        const { data: existingDrafts } = await supabase
          .from("bookings")
          .select("id")
          .eq("draft_key", draftKey)
          .eq("status", "draft")
          .limit(1);

        if (existingDrafts && existingDrafts.length > 0) {
          // Update existing draft
          await supabase
            .from("bookings")
            .update({ 
              draft_data: data,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingDrafts[0].id);
        } else {
          // Create a new draft record
          await supabase
            .from("bookings")
            .insert({
              id: uuidv4(),
              draft_key: draftKey,
              draft_data: data,
              title: data.title || "Draft Booking",
              description: data.description || "",
              room_id: data.roomId || "",
              room_name: data.roomId ? (data.selectedRoom?.name || "") : "",
              room_capacity: data.roomId ? (data.selectedRoom?.capacity || 0) : 0,
              start_time: data.startTime || new Date().toISOString(),
              end_time: data.endTime || new Date().toISOString(),
              created_by_email: user.email,
              created_by_name: user.name || "",
              status: "draft"
            });
        }
      }
      
      console.log("Draft saved successfully:", data);
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load draft data from localStorage or Supabase
  const loadDraft = async (): Promise<DraftBookingData | null> => {
    if (!draftKey) return null;
    
    setIsLoading(true);
    try {
      // First, try loading from localStorage
      const localData = localStorage.getItem(draftKey);
      
      // If user is logged in, check if there's a more recent version in Supabase
      if (user?.email) {
        const { data: draftBookings } = await supabase
          .from("bookings")
          .select("draft_data, created_at")
          .eq("draft_key", draftKey)
          .eq("status", "draft")
          .order("created_at", { ascending: false })
          .limit(1);

        if (draftBookings && draftBookings.length > 0 && draftBookings[0].draft_data) {
          // If both local and remote drafts exist, compare timestamps if available
          if (localData) {
            const localDataObj = JSON.parse(localData);
            const remoteDraftData = draftBookings[0].draft_data as DraftBookingData;
            
            // Use the most recent version
            if (remoteDraftData.updatedAt && localDataObj.updatedAt) {
              if (new Date(remoteDraftData.updatedAt) > new Date(localDataObj.updatedAt)) {
                return remoteDraftData;
              } else {
                return localDataObj;
              }
            }
          }
          return draftBookings[0].draft_data as DraftBookingData;
        }
      }
      
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear draft data from both localStorage and Supabase
  const clearDraft = async (): Promise<void> => {
    if (!draftKey) return;
    
    try {
      // Clear from localStorage
      localStorage.removeItem(draftKey);
      
      // If user is logged in, clear from Supabase by marking as "submitted" rather than deleting
      if (user?.email) {
        const { data: draftBookings } = await supabase
          .from("bookings")
          .select("id")
          .eq("draft_key", draftKey)
          .eq("status", "draft");

        if (draftBookings && draftBookings.length > 0) {
          await supabase
            .from("bookings")
            .update({ 
              draft_data: null,
              draft_key: null, 
              status: "submitted" 
            })
            .eq("id", draftBookings[0].id);
        }
      }
      
      console.log("Draft cleared successfully");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    isLoading,
    draftKey
  };
};
