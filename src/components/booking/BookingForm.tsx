
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { FormData, formSchema } from "./BookingFormSchema";
import { BookingFormHeader } from "./BookingFormHeader";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormFooter } from "./BookingFormFooter";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFormDraftManager } from "@/hooks/useFormDraftManager";
import { Room } from "@/types";
import { createDefaultFormValues } from "@/utils/formDefaults";
import { useAuth } from "@/context/AuthContext";

interface BookingFormProps {
  isEdit?: boolean;
  bookingId?: string;
  rooms: Room[];
  defaultValues: FormData;
  onSubmit: (data: FormData, clearDraft?: () => Promise<void>) => Promise<void>;
  onCancel: () => void;
  skipDraftLoading?: boolean;
}

export const BookingForm = ({
  isEdit = false,
  bookingId,
  rooms,
  defaultValues,
  onSubmit,
  onCancel,
  skipDraftLoading = false
}: BookingFormProps) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    defaultValues.roomId || null
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    isLoading,
    draftLoaded,
    handleClearDraft,
    handleStartNewDraft,
    clearDraft
  } = useFormDraftManager({
    form,
    bookingId,
    rooms,
    onDraftLoaded: (roomId: string) => setSelectedRoomId(roomId),
    skipDraftLoading
  });

  const handleSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await onSubmit(data, isEdit ? undefined : clearDraft);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearDraftClick = () => {
    const resetValues = createDefaultFormValues(user?.email || "", {
      roomId: isEdit ? defaultValues.roomId : "",
    });
    handleClearDraft(resetValues);
    setSelectedRoomId(isEdit ? defaultValues.roomId || null : null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <BookingFormHeader
        isEdit={isEdit}
        isLoading={isLoading}
        draftLoaded={draftLoaded}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <BookingFormContent
              control={form.control}
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
            />

            <BookingFormFooter
              isEdit={isEdit}
              submitting={submitting}
              onCancel={onCancel}
              onClearDraft={handleClearDraftClick}
              onStartNewDraft={handleStartNewDraft}
            />
          </Card>
        </form>
      </Form>
    </div>
  );
};
