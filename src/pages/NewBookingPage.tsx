
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FormData, formSchema } from "@/components/booking/BookingFormSchema";
import { BookingFormContent } from "@/components/booking/BookingFormContent";
import { BookingFormFooter } from "@/components/booking/BookingFormFooter";
import { BookingFormHeader } from "@/components/booking/BookingFormHeader";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/rooms";
import { useFormDraftManager } from "@/hooks/useFormDraftManager";
import { Room } from "@/types";

const NewBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const defaultEmail = user?.email || "";
  const enhancedRooms = rooms;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      roomId: selectedRoomId || "",
      setupOption: "",
      requiresAdditionalSpace: false,
      startDate: undefined,
      endDate: undefined,
      email: defaultEmail,
      name: "",
      cateringOptions: [],
      cateringComments: "",
      eventSupportOptions: [],
      membershipStatus: "",
      additionalComments: "",
      isPublicEvent: false,
    },
  });

  const {
    isLoading,
    isDraftCleared,
    draftLoaded,
    handleClearDraft,
    handleStartNewDraft,
    clearDraft
  } = useFormDraftManager({
    form,
    rooms: enhancedRooms,
    onDraftLoaded: setSelectedRoomId
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Find the selected room
      const selectedRoom = enhancedRooms.find(
        (room) => room.id === data.roomId,
      ) as Room;

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Create booking with correct type structure
      const bookingId = await createBooking({
        title: data.title,
        description: data.description,
        room: selectedRoom,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        createdBy: {
          id: user?.id || crypto.randomUUID(),
          email: data.email,
          name: data.name,
          verified: false
        },
        selectedSetup: data.setupOption,
        requiresAdditionalSpace: data.requiresAdditionalSpace,
        additionalComments: data.additionalComments,
        isPublicEvent: data.isPublicEvent,
        organizer: data.organizer,
        estimatedAttendees: data.estimatedAttendees
      });

      // Clear the draft data after successful submission
      await clearDraft();

      toast.success(t('messages.bookingSubmitted'));
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error(t('messages.bookingError'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearDraftWrapper = () => {
    const resetValues: FormData = {
      title: "",
      description: "",
      roomId: "",
      setupOption: "",
      requiresAdditionalSpace: false,
      startDate: undefined,
      endDate: undefined,
      email: defaultEmail,
      name: "",
      cateringOptions: [],
      cateringComments: "",
      eventSupportOptions: [],
      isPublicEvent: false,
      membershipStatus: "",
      additionalComments: "",
    };

    handleClearDraft(resetValues);
    setSelectedRoomId(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <BookingFormHeader 
              isEdit={false}
              isLoading={isLoading}
              draftLoaded={draftLoaded}
            />

            <BookingFormContent
              control={form.control}
              rooms={enhancedRooms}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
            />

            <BookingFormFooter
              isEdit={false}
              submitting={submitting}
              onCancel={() => navigate("/")}
              onClearDraft={handleClearDraftWrapper}
              onStartNewDraft={handleStartNewDraft}
            />
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewBookingPage;
