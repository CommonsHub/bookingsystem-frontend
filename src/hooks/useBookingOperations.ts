
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { generateId } from "@/lib/utils";
import { Booking, Comment, User } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useBookingOperations = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  const createBooking = async (
    bookingData: Omit<
      Booking,
      "id" | "createdAt" | "status" | "comments" | "createdBy"
    > & { createdBy: User },
  ): Promise<string> => {
    // generate uuid v4
    const id = uuidv4();

    try {
      const { error } = await supabase.from("bookings").insert({
        id,
        title: bookingData.title,
        description: bookingData.description,
        room_id: bookingData.room.id,
        room_name: bookingData.room.name,
        room_capacity: bookingData.room.capacity,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        status: "draft",
        created_by_email: bookingData.createdBy.email,
        created_by_name: bookingData.createdBy.name,
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
            status: "draft" as const,
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

  const addCommentToBooking = async (
    bookingId: string,
    content: string,
    email: string,
    name: string = "",
  ): Promise<string> => {
    try {
      // Insert comment into the database
      const { data, error } = await supabase
        .from("comments")
        .insert({
          booking_id: bookingId,
          content,
          created_by_email: email,
          created_by_name: name,
          status: "draft"
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating comment:", error);
        toast.error("Failed to create comment");
        throw error;
      }

      const newComment: Comment = {
        id: data.id,
        bookingId,
        content,
        createdAt: data.created_at,
        createdBy: { 
          email, 
          name: name || "",
          verified: false 
        },
        status: "draft",
      };

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, comments: [...booking.comments, newComment] }
            : booking,
        ),
      );

      return data.id;
    } catch (error) {
      console.error("Error in addCommentToBooking:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const approveBookingRequest = async (
    id: string,
    user: User,
  ): Promise<void> => {
    if (!user) {
      toast.error("You must be logged in to approve bookings");
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "approved",
          approved_by_email: user.email,
          approved_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Error approving booking:", error);
        toast.error("Failed to approve booking");
        return;
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: "approved",
                approvedBy: user,
                approvedAt: new Date().toISOString(),
              }
            : booking,
        ),
      );

      toast.success("Booking request approved successfully!");
    } catch (error) {
      console.error("Error in approveBookingRequest:", error);
      toast.error("Failed to approve booking");
    }
  };

  return {
    createBooking,
    addCommentToBooking,
    approveBookingRequest,
  };
};
