
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useCreateBooking = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const createBooking = async (
    bookingData: Omit<
      Booking,
      "id" | "createdAt" | "status" | "comments" | "createdBy"
    > & { createdBy: User; additionalComments?: string; isPublicEvent?: boolean },
  ): Promise<string> => {
    // generate uuid v4
    const id = uuidv4();

    try {
      // Get the draft key if it exists in localStorage
      const draftKey = localStorage.getItem("anonymous-booking-draft-key") || 
        (bookingData.createdBy?.email ? `booking-draft-${bookingData.createdBy.email}` : null);

      // Store room capacity as a string (no need to convert since it's already a string)
      const roomCapacity = bookingData.room.capacity;

      // Create a sanitized version of the data for JSON storage
      // This prevents type errors by ensuring we only store JSON-compatible data
      const sanitizedDraftData = {
        title: bookingData.title,
        description: bookingData.description,
        roomId: bookingData.room.id,
        roomName: bookingData.room.name,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        createdByEmail: bookingData.createdBy.email,
        createdByName: bookingData.createdBy.name,
        selectedSetup: bookingData.selectedSetup,
        requiresAdditionalSpace: bookingData.requiresAdditionalSpace,
        additionalComments: bookingData.additionalComments,
        isPublicEvent: bookingData.isPublicEvent
      };

      const { error } = await supabase.from("bookings").insert({
        id,
        title: bookingData.title,
        description: bookingData.description,
        room_id: bookingData.room.id,
        room_name: bookingData.room.name,
        room_capacity: roomCapacity, // Store as string
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        status: "pending", // Changed from "draft" to "pending" to skip email verification
        created_by_email: bookingData.createdBy.email,
        created_by_name: bookingData.createdBy.name,
        draft_key: draftKey, // Store the draft key
        draft_data: sanitizedDraftData, // Keep storing sanitized data for compatibility
        additional_comments: bookingData.additionalComments, // Store in dedicated column
        is_public_event: bookingData.isPublicEvent // Store in dedicated column
      });

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
            status: "pending" as const, // Changed from "draft" to "pending"
            comments: [],
            createdBy: bookingData.createdBy,
          };
          return [transformedNewBooking, ...prevBookings];
        });
      }

      // Clear the draft data from localStorage after successful submission
      if (draftKey) {
        localStorage.removeItem(draftKey);
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
