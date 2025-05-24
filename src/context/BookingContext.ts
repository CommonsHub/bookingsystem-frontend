
import { createContext, useContext } from "react";
import { Booking, User, Comment } from "@/types";

interface BookingContextType {
  bookings: Booking[];
  getBookingById: (id: string) => Booking | undefined;
  createBooking: (bookingData: Partial<Booking>) => Promise<string>;
  updateBooking: (id: string, bookingData: Partial<Booking>) => Promise<void>;
  addCommentToBooking: (
    bookingId: string,
    content: string,
    email: string,
    name?: string
  ) => Promise<string>;
  approveBookingRequest: (id: string) => void;
  cancelBookingRequest: (id: string) => void;
  user: User | null;
  canUserApproveBookings: (user: User | null) => boolean;
  canUserCancelBooking: (booking: Booking, user: User | null) => boolean;
}

export const BookingContext = createContext<BookingContextType>({
  bookings: [],
  getBookingById: () => undefined,
  createBooking: async () => "",
  updateBooking: async () => {},
  addCommentToBooking: async () => "",
  approveBookingRequest: () => {},
  cancelBookingRequest: () => {},
  user: null,
  canUserApproveBookings: () => false,
  canUserCancelBooking: () => false,
});

export const useBooking = () => useContext(BookingContext);
