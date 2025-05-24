
import { Booking, User } from "@/types";
import { useCreateBooking } from "./useCreateBooking";
import { useCommentOperations } from "./useCommentOperations";
import { useApprovalOperations } from "./useApprovalOperations";
import { useCancellationOperations } from "./useCancellationOperations";
import { useUpdateBooking } from "./useUpdateBooking";

export const useBookingOperations = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  const { createBooking } = useCreateBooking(setBookings);
  const { addCommentToBooking } = useCommentOperations(setBookings);
  const { approveBookingRequest } = useApprovalOperations(setBookings);
  const { cancelBookingRequest } = useCancellationOperations(setBookings);
  const { updateBooking } = useUpdateBooking(setBookings);

  return {
    createBooking,
    addCommentToBooking,
    approveBookingRequest,
    cancelBookingRequest,
    updateBooking,
  };
};
