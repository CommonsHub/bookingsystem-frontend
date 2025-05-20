import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type DraftBookingData = Record<string, any>;

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

  // Save draft data to localStorage only
  const saveDraft = async (data: DraftBookingData): Promise<void> => {
    if (!draftKey) return;

    try {
      setIsLoading(true);

      // Save to localStorage with timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(dataWithTimestamp));

      console.log("Draft saved successfully:", data);
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load draft data from localStorage
  const loadDraft = async (): Promise<DraftBookingData | null> => {
    if (!draftKey) return null;

    setIsLoading(true);
    try {
      // Load from localStorage
      const localData = localStorage.getItem(draftKey);

      if (!localData) return null;

      // Parse the data
      const parsedData = JSON.parse(localData) as DraftBookingData;

      // Ensure date field is properly loaded as a Date object if it exists
      if (parsedData.date && typeof parsedData.date === "string") {
        parsedData.date = new Date(parsedData.date);
      }

      return parsedData;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear draft data from localStorage
  const clearDraft = async (): Promise<void> => {
    if (!draftKey) return;

    try {
      // Clear from localStorage
      localStorage.removeItem(draftKey);
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
    draftKey,
  };
};
