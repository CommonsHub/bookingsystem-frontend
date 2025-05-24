
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/toast-utils";
import { useTranslation } from "react-i18next";
import { useDraftBooking } from "./useDraftBooking";
import { FormData } from "@/components/booking/BookingFormSchema";
import { Room } from "@/types";

interface UseFormDraftManagerProps {
  form: UseFormReturn<FormData>;
  bookingId?: string;
  rooms: Room[];
  onDraftLoaded?: (roomId: string) => void;
}

export const useFormDraftManager = ({ 
  form, 
  bookingId, 
  rooms,
  onDraftLoaded 
}: UseFormDraftManagerProps) => {
  const { t } = useTranslation();
  const { saveDraft, loadDraft, clearDraft, resetClearedFlag, isLoading, isDraftCleared } = useDraftBooking(bookingId);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);

  // Load saved draft on initial render
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const draftData = await loadDraft();
        if (draftData && !draftLoaded) {
          form.reset(draftData);
          if (draftData.roomId && onDraftLoaded) {
            onDraftLoaded(draftData.roomId);
          }
          setDraftLoaded(true);
          toast.success(t('messages.draftLoaded'));
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    fetchDraft();
  }, [form, loadDraft, draftLoaded, t, onDraftLoaded]);

  // Auto-save form values when they change
  useEffect(() => {
    // Don't auto-save if draft was cleared
    if (isDraftCleared) return;

    // Watch for form changes
    const subscription = form.watch((formValues) => {
      // Debounce the auto-save to prevent too many saves
      if (autoSaveTimerId) {
        clearTimeout(autoSaveTimerId);
      }

      // Only save if there are actual values and draft wasn't cleared
      if ((formValues.title || formValues.description || formValues.roomId) && !isDraftCleared) {
        const timerId = setTimeout(() => {
          // Add timestamp to detect which version is newer
          const dataToSave = {
            ...formValues,
            updatedAt: new Date().toISOString(),
            selectedRoom: rooms.find(r => r.id === formValues.roomId)
          };
          saveDraft(dataToSave);
        }, 2000); // Save after 2 seconds of inactivity

        setAutoSaveTimerId(timerId);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form, saveDraft, isDraftCleared, autoSaveTimerId, rooms]);

  const handleClearDraft = async (resetValues: FormData) => {
    // Clear the draft data
    await clearDraft();

    // Reset form to provided values
    form.reset(resetValues);

    // Reset UI state
    setDraftLoaded(false);

    toast.success(t('messages.draftCleared'));
  };

  const handleStartNewDraft = () => {
    resetClearedFlag();
  };

  return {
    isLoading,
    isDraftCleared,
    draftLoaded,
    handleClearDraft,
    handleStartNewDraft,
    clearDraft
  };
};
