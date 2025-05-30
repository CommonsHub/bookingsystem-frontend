import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { FormData } from "@/components/booking/BookingFormSchema";
import { Booking, BookingDatabaseFields, Room } from "@/types";
import {
  calculateRoomPrice,
  calculateMemberDiscount,
  isWeekendDate,
  calculateDurationHours,
} from "@/utils/pricingCalculations";
import { calculateCateringCosts } from "@/utils/cateringCalculations";

export const useBookingFormOperations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, updateBooking } = useBooking();

  const calculateTotalPrice = (data: FormData, rooms: Room[]) => {
    const room = rooms.find((r) => r.id === data.roomId);
    if (!room || !data.startDate || !data.endDate) return null;

    const durationHours = calculateDurationHours(data.startDate, data.endDate);
    if (durationHours <= 0) return null;

    const isWeekend = isWeekendDate(data.startDate, data.endDate);
    const roomPricing = calculateRoomPrice(
      data.roomId,
      durationHours,
      data.estimatedAttendees || 0,
      isWeekend,
    );
    if (!roomPricing) return null;

    const isMember = data.membershipStatus === "yes";
    const memberPricing = calculateMemberDiscount(
      roomPricing.roomPrice,
      isMember,
    );

    const catering = calculateCateringCosts(
      data.cateringOptions || [],
      data.estimatedAttendees || 0,
    );
    const nonPublicSurcharge = !data.isPublicEvent
      ? Math.round(memberPricing.discountedRoomPrice * 0.3)
      : 0;

    return (
      memberPricing.discountedRoomPrice +
      catering.cateringPrice +
      nonPublicSurcharge
    );
  };

  const transformFormDataToBooking = (
    data: FormData,
    rooms: Room[],
  ): Partial<Booking> => {
    const selectedRoom = rooms.find((room) => room.id === data.roomId) as Room;
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Calculate the total price
    const calculatedPrice = calculateTotalPrice(data, rooms);

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
      price: data.price || calculatedPrice || 0,
      currency: data.currency || "EUR",
      language: data.language,
      // Include catering and membership data
      cateringOptions: data.cateringOptions || [],
      cateringComments: data.cateringComments,
      membershipStatus: data.membershipStatus,
      eventSupportOptions: data.eventSupportOptions || [],
      roomNotes: data.roomNotes,
    };
  };

  const handleCreateBooking = async (
    data: FormData,
    rooms: Room[],
    clearDraft: () => Promise<void>,
  ) => {
    try {
      const bookingData = transformFormDataToBooking(data, rooms);

      const bookingId = await createBooking({
        ...bookingData,
        createdBy: {
          id: user?.id || crypto.randomUUID(),
          email: data.email,
          name: data.name,
        },
      });

      await clearDraft();
      toast.success(t("messages.bookingSubmitted"));
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error(t("messages.bookingError"));
      console.error(error);
      throw error;
    }
  };

  const handleUpdateBooking = async (
    bookingId: string,
    data: FormData,
    rooms: Room[],
  ) => {
    try {
      const bookingData = transformFormDataToBooking(data, rooms);
      await updateBooking(bookingId, bookingData);
      toast.success(t("messages.bookingUpdated"));

      // Add a small delay to ensure the booking is updated in the context before navigation
      setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 100);
    } catch (error) {
      toast.error(t("messages.bookingUpdateError"));
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
