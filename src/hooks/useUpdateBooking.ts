
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types";
import { toast } from "@/components/ui/toast-utils";

export const useUpdateBooking = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateBooking = async (bookingId: string, updatedBooking: Partial<Booking>): Promise<void> => {
    setIsUpdating(true);
    try {
      console.log("Updating booking:", bookingId, "with data:", updatedBooking);
      
      const { data, error } = await supabase
        .from("bookings")
        .update({
          title: updatedBooking.title,
          description: updatedBooking.description,
          room_id: updatedBooking.room?.id,
          room_name: updatedBooking.room?.name,
          room_capacity: updatedBooking.room?.capacity,
          start_time: updatedBooking.startTime,
          end_time: updatedBooking.endTime,
          status: updatedBooking.status,
          organizer: updatedBooking.organizer,
          estimated_attendees: updatedBooking.estimatedAttendees,
          additional_comments: updatedBooking.additionalComments,
          is_public_event: updatedBooking.isPublicEvent,
          luma_event_url: updatedBooking.lumaEventUrl,
          calendar_url: updatedBooking.calendarUrl,
          public_uri: updatedBooking.publicUri,
          language: updatedBooking.language,
          price: updatedBooking.price,
          currency: updatedBooking.currency,
          // Add the new fields
          catering_options: updatedBooking.cateringOptions,
          catering_comments: updatedBooking.cateringComments,
          event_support_options: updatedBooking.eventSupportOptions,
          membership_status: updatedBooking.membershipStatus,
        })
        .eq("id", bookingId)
        .select();

      if (error) {
        console.error("Error updating booking:", error);
        throw error;
      }

      console.log("Booking updated successfully:", data);

      // Update local state properly - merge the updated data with existing booking
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );

      toast.success("Booking updated successfully!");
    } catch (error: any) {
      console.error("Failed to update booking:", error);
      toast.error("Failed to update booking: " + error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateBooking, isUpdating };
};
