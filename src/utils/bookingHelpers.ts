import { Booking, User } from "@/types";
import { isAdmin } from "./adminUtils";

// Function to check if a user can approve bookings
export const canUserApproveBookings = (user: User | null): boolean => {
  return isAdmin(user);
};

// Function to check if a user can cancel a specific booking
export const canUserCancelBooking = (
  booking: Booking,
  user: User | null,
): boolean => {
  if (!user) return false;

  // The creator of the booking can cancel it
  if (booking.createdBy.email === user.email) return true;

  // Also allow administrators to cancel bookings
  if (canUserApproveBookings(user)) return true;

  return false;
};

// Function to get booking by ID
export const getBookingById = (
  bookings: Booking[],
  id: string,
): Booking | undefined => {
  return bookings.find((booking) => booking.id === id);
};
