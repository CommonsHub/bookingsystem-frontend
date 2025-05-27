
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { FormData } from "@/components/booking/BookingFormSchema";
import { Room } from "@/types";

export const useBookingFormOperations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, updateBooking } = useBooking();

  const transformFormDataToBooking = (data: FormData, rooms: Room[]) => {
    const selectedRoom = rooms.find(room => room.id === data.roomId) as Room;
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    return {
      title: data.title,
      description: data.description,
      room: selectedRoom,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      selectedSetup: data.setupOption,
      requiresAdditionalSpace: data.requiresAdditionalSpace,
      additionalComments: data.additionalComments,
      isPublicEvent: data.isPublicEvent,
      organizer: data.organizer,
      estimatedAttendees: data.estimatedAttendees,
      lumaEventUrl: data.lumaEventUrl,
      calendarUrl: data.calendarUrl,
      publicUri: data.publicUri,
      price: data.price,
      currency: data.currency,
      language: data.language,
      // Include catering and membership data
      cateringOptions: data.cateringOptions || [],
      cateringComments: data.cateringComments,
      membershipStatus: data.membershipStatus,
      eventSupportOptions: data.eventSupportOptions || [],
    };
  };

  const handleCreateBooking = async (data: FormData, rooms: Room[], clearDraft: () => Promise<void>) => {
    try {
      const bookingData = transformFormDataToBooking(data, rooms);
      
      const bookingId = await createBooking({
        ...bookingData,
        createdBy: {
          id: user?.id || crypto.randomUUID(),
          email: data.email,
          name: data.name,
          verified: false
        }
      });

      await clearDraft();
      toast.success(t('messages.bookingSubmitted'));
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error(t('messages.bookingError'));
      console.error(error);
      throw error;
    }
  };

  const handleUpdateBooking = async (bookingId: string, data: FormData, rooms: Room[]) => {
    try {
      const bookingData = transformFormDataToBooking(data, rooms);
      await updateBooking(bookingId, bookingData);
      toast.success(t('messages.bookingUpdated'));
      
      // Add a small delay to ensure the booking is updated in the context before navigation
      setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 100);
    } catch (error) {
      toast.error(t('messages.bookingUpdateError'));
      console.error(error);
      throw error;
    }
  };

  return {
    handleCreateBooking,
    handleUpdateBooking,
    transformFormDataToBooking,
  };
};
