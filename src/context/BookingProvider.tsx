
import React from "react";
import { BookingContext } from "./BookingContext";
import { useAuth } from "./AuthContext";
import { useBookingData } from "@/hooks/useBookingData";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { canUserApproveBookings, canUserCancelBooking, getBookingById } from "@/utils/bookingHelpers";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { bookings, setBookings, isLoading } = useBookingData();
  const { user } = useAuth();

  const { createBooking, addCommentToBooking, approveBookingRequest, cancelBookingRequest } =
    useBookingOperations(bookings, setBookings);

  const getUserEmail = (): string | null => {
    return user?.email || null;
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        user,
        isLoading,
        createBooking,
        addCommentToBooking,
        getBookingById: (id: string) => getBookingById(bookings, id),
        approveBookingRequest: (id: string) => approveBookingRequest(id, user!),
        cancelBookingRequest: (id: string) => cancelBookingRequest(id, user!),
        getUserEmail,
        canUserApproveBookings,
        canUserCancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
