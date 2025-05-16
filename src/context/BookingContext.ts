
import { Booking, User } from "@/types";
import { createContext, useContext } from "react";

interface BookingContextType {
  bookings: Booking[];
  user: User | null;
  createBooking: (
    booking: Omit<
      Booking,
      "id" | "createdAt" | "status" | "comments" | "createdBy"
    > & { createdBy: User, additionalComments?: string, isPublicEvent?: boolean },
  ) => Promise<string>;
  addCommentToBooking: (
    bookingId: string,
    content: string,
    email: string,
    name?: string,
  ) => Promise<string>;
  getBookingById: (id: string) => Booking | undefined;
  approveBookingRequest: (id: string) => void;
  getUserEmail: () => string | null;
  canUserApproveBookings: (user: User | null) => boolean;
}

export const BookingContext = createContext<BookingContextType | undefined>(
  undefined,
);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
