
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { BookingContext } from "./BookingContext";
import { useBookingData } from "@/hooks/useBookingData";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { Booking, User } from "@/types";
import { canUserApproveBookings, canUserCancelBooking } from "@/utils/bookingHelpers";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { bookings, setBookings } = useBookingData();
  const { createBooking, addCommentToBooking, approveBookingRequest, cancelBookingRequest, updateBooking } =
    useBookingOperations(bookings, setBookings);

  // Get booking by ID
  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id);
  };

  const value = {
    bookings,
    getBookingById,
    createBooking,
    updateBooking,
    addCommentToBooking,
    approveBookingRequest,
    cancelBookingRequest,
    user,
    canUserApproveBookings,
    canUserCancelBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
