
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Booking, BookingDatabaseFields, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

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

      const row: Database["public"]["Tables"]["bookings"]["Insert"] = {
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
        language: i18n.language, // Add current language
        price: bookingData.price,
        currency: bookingData.currency,
        // Add the new fields
        catering_options: bookingData.cateringOptions,
        catering_comments: bookingData.cateringComments,
        event_support_options: bookingData.eventSupportOptions,
        membership_status: bookingData.membershipStatus,
      };

      const { error } = await supabase.from("bookings").insert(row);

      if (error) {
        console.error("Error creating booking:", error);
        toast.error("Failed to create booking");
        throw error;
      }

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
