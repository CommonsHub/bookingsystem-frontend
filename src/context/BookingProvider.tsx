
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BookingContext } from "./BookingContext";
import { useBookingData } from "@/hooks/useBookingData";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { Booking, User } from "@/types";
import { canUserApproveBookings, canUserCancelBooking } from "@/utils/bookingHelpers";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { bookings, setBookings, loading } = useBookingData();
  const { createBooking, addCommentToBooking, approveBookingRequest: approveBooking, cancelBookingRequest: cancelBooking, updateBooking } =
    useBookingOperations(bookings, setBookings);

  // Get booking by ID
  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id);
  };

  // Wrapper for approveBookingRequest that matches the interface
  const approveBookingRequest = (id: string): void => {
    if (user) {
      approveBooking(id, user);
    }
  };
  
  // Wrapper for cancelBookingRequest that matches the interface
  const cancelBookingRequest = (id: string): void => {
    if (user) {
      cancelBooking(id, user);
    }
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
