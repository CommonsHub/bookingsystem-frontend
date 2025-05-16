
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, Comment } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useCommentOperations = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const addCommentToBooking = async (
    bookingId: string,
    content: string,
    email: string,
    name: string = "",
  ): Promise<string> => {
    try {
      // Insert comment into the database as published instead of draft
      const { data, error } = await supabase
        .from("comments")
        .insert({
          booking_id: bookingId,
          content,
          created_by_email: email,
          created_by_name: name,
          status: "published"  // Changed from "draft" to "published"
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
          id: uuidv4(), // Generate a temporary ID for the user
          email, 
          name: name || "",
          verified: false 
        },
        status: "published",  // Changed from "draft" to "published"
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

  return { addCommentToBooking };
};
