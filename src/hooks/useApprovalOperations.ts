
import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User } from "@/types";
import { callEdgeFunction, createBookingPayload } from "@/utils/edgeFunctionUtils";

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
      // Get the current booking data
      const { data: currentBooking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !currentBooking) {
        console.error("Error fetching booking:", fetchError);
        toast.error("Failed to fetch booking data");
        return;
      }

      // Prepare the updated booking data to send to edge function
      const updatedBookingRecord = {
        ...currentBooking,
        status: "approved",
        approved_by_email: user.email,
      };
      
      // Call edge function to handle database update and notifications
      const edgeFunctionResult = await callEdgeFunction(
        createBookingPayload(updatedBookingRecord, 'confirmed_booking')
      );

      if (!edgeFunctionResult.success) {
        console.error("Edge function call failed:", edgeFunctionResult.error);
        toast.error("Failed to approve booking");
        throw new Error(edgeFunctionResult.error || "Failed to approve booking");
      }

      // Update local state
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
