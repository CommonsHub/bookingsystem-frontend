
import { Booking, User } from "@/types";
import { useCreateBooking } from "./useCreateBooking";
import { useCommentOperations } from "./useCommentOperations";
import { useApprovalOperations } from "./useApprovalOperations";

export const useBookingOperations = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  const { createBooking } = useCreateBooking(setBookings);
  const { addCommentToBooking } = useCommentOperations(setBookings);
  const { approveBookingRequest } = useApprovalOperations(setBookings);

  return {
    createBooking,
    addCommentToBooking,
    approveBookingRequest,
  };
};
