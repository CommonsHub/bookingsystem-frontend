
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
  skipDraftLoading?: boolean;
}

export const useFormDraftManager = ({ 
  form, 
  bookingId, 
  rooms,
  onDraftLoaded,
  skipDraftLoading = false
}: UseFormDraftManagerProps) => {
  const { t } = useTranslation();
  const { saveDraft, loadDraft, clearDraft, resetClearedFlag, isLoading, isDraftCleared } = useDraftBooking(bookingId);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);

  // Load saved draft on initial render (only if not skipping draft loading)
  useEffect(() => {
    if (skipDraftLoading) {
      console.log("Skipping draft loading for edit form - performance optimization");
      return;
    }

    const fetchDraft = async () => {
      try {
        const draftData = await loadDraft();
        if (draftData && !draftLoaded) {
          // Ensure dates are properly converted to Date objects
          if (draftData.startDate && typeof draftData.startDate === 'string') {
            draftData.startDate = new Date(draftData.startDate);
          }
          if (draftData.endDate && typeof draftData.endDate === 'string') {
            draftData.endDate = new Date(draftData.endDate);
          }
          
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
  }, [form, loadDraft, draftLoaded, t, onDraftLoaded, skipDraftLoading]);

  // Auto-save form values when they change (only if not skipping draft loading)
  useEffect(() => {
    // Don't auto-save if draft was cleared or if we're skipping draft loading
    if (isDraftCleared || skipDraftLoading) return;

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
  }, [form, saveDraft, isDraftCleared, autoSaveTimerId, rooms, skipDraftLoading]);

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
    isLoading: skipDraftLoading ? false : isLoading,
    isDraftCleared,
    draftLoaded: skipDraftLoading ? false : draftLoaded,
    handleClearDraft,
    handleStartNewDraft,
    clearDraft
  };
};
