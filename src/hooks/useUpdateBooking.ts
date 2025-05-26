
import { useState } from "react";
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, Room } from "@/types";

export const useUpdateBooking = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const [loading, setLoading] = useState(false);

  const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<void> => {
    try {
      setLoading(true);

      // Extract the room object to get room_id and room_name
      const room = bookingData.room as Room;
      
      // Format the data for Supabase (snake_case for column names)
      const updateData = {
        title: bookingData.title,
        description: bookingData.description,
        room_id: room?.id,
        room_name: room?.name,
        room_capacity: room?.capacity,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        additional_comments: bookingData.additionalComments,
        is_public_event: bookingData.isPublicEvent,
        organizer: bookingData.organizer,
        estimated_attendees: bookingData.estimatedAttendees,
        luma_event_url: bookingData.lumaEventUrl,
        calendar_url: bookingData.calendarUrl,
        public_uri: bookingData.publicUri,
        // Note: We don't update the language field in updates to preserve the original language
      };

      // Update booking in the database
      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating booking:', error);
        toast.error('Failed to update booking');
        throw error;
      }

      // Update the local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id
            ? { ...booking, ...bookingData }
            : booking
        )
      );

      toast.success('Booking updated successfully');
    } catch (error) {
      console.error('Error in updateBooking:', error);
      toast.error('Failed to update booking');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateBooking, loading };
};
