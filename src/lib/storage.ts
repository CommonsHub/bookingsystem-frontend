import { User, Booking, Comment } from "@/types";
import { generateMockBookings } from "@/data/mockData";

// LocalStorage keys
const BOOKINGS_KEY = "chb-bs-bookings";

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(generateMockBookings()));
  }
};

// Call initialization
initializeStorage();

// Booking management
export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(BOOKINGS_KEY);
  if (!data) return [];
  return JSON.parse(data) as Booking[];
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  const existingIndex = bookings.findIndex((b) => b.id === booking.id);

  if (existingIndex !== -1) {
    bookings[existingIndex] = booking;
  } else {
    bookings.push(booking);
  }

  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const getBookingById = (id: string): Booking | undefined => {
  const bookings = getBookings();
  return bookings.find((booking) => booking.id === id);
};

export const approveBooking = (id: string, approver: User): void => {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);

  if (booking && booking.status === "pending") {
    booking.status = "approved";
    booking.approvedBy = approver;
    booking.approvedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};

// Comment management
export const addComment = (bookingId: string, comment: Comment): void => {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === bookingId);

  if (booking) {
    booking.comments.push(comment);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};

export const updateCommentStatus = (
  bookingId: string,
  commentId: string,
  status: "draft" | "published",
): void => {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === bookingId);

  if (booking) {
    const comment = booking.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.status = status;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }
};
