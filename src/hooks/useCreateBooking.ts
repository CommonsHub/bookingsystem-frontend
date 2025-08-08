
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Booking, BookingDatabaseFields, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { callEdgeFunction, createBookingPayload } from "@/utils/edgeFunctionUtils";

export const useCreateBooking = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  const { i18n } = useTranslation();

  const createBooking = async (
    bookingData: Omit<Booking, "id" | "createdAt" | "status" | "comments">,
  ): Promise<string> => {
    // generate uuid v4
    const id = uuidv4();

    try {
      // Store room capacity as a string (no need to convert since it's already a string)
      const roomCapacity = bookingData.room.capacity;

      // Prepare the booking data to send to edge function
      const bookingRecord = {
        id,
        title: bookingData.title,
        description: bookingData.description,
        room_id: bookingData.room.id,
        room_name: bookingData.room.name,
        room_capacity: roomCapacity,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        status: "pending",
        created_by_email: bookingData.createdBy.email,
        created_by_name: bookingData.createdBy.name,
        additional_comments: bookingData.additionalComments,
        is_public_event: bookingData.isPublicEvent,
        organizer: bookingData.organizer,
        estimated_attendees: bookingData.estimatedAttendees,
        language: i18n.language,
        price: bookingData.price,
        currency: bookingData.currency,
        catering_options: bookingData.cateringOptions,
        catering_comments: bookingData.cateringComments,
        event_support_options: bookingData.eventSupportOptions,
        membership_status: bookingData.membershipStatus,
      };
      
      // Call edge function to handle database insertion and notifications
      const edgeFunctionResult = await callEdgeFunction(
        createBookingPayload(bookingRecord, 'new_booking')
      );

      if (!edgeFunctionResult.success) {
        console.error("Edge function call failed:", edgeFunctionResult.error);
        toast.error("Failed to create booking");
        throw new Error(edgeFunctionResult.error || "Failed to create booking");
      }

      // Update local state with the new booking
      const { data: newBookings } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (newBookings) {
        setBookings((prevBookings) => {
          const transformedNewBooking = {
            ...bookingData,
            id,
            createdAt: new Date().toISOString(),
            status: "pending" as const,
            comments: [],
            createdBy: bookingData.createdBy,
          };
          return [transformedNewBooking, ...prevBookings];
        });
      }
      return id;
    } catch (error) {
      console.error("Error in createBooking:", error);
      toast.error("Failed to create booking");
      throw error;
    }
  };

  return { createBooking };
};
