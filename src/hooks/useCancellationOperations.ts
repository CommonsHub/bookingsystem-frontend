
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User } from "@/types";

export const useCancellationOperations = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  const cancelBookingRequest = async (bookingId: string, user: User | null) => {
    if (!user) {
      toast.error("You must be logged in to cancel a booking");
      return;
    }

    try {
      // Update the booking status in the database
      // The RLS policies will ensure only authorized users can cancel bookings
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancelled_by_email: user.email,
        })
        .eq("id", bookingId);

      if (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
        throw error;
      }

      // Update the local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
                cancelledBy: user,
              }
            : booking,
        ),
      );

      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error in cancelBookingRequest:", error);
      toast.error("Failed to cancel booking");
    }
  };

  return { cancelBookingRequest };
};
