
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User } from "@/types";

export const useApprovalOperations = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
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

  return { approveBookingRequest };
};
