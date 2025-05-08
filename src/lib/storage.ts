import { User, Booking, Comment } from "@/types";
import { generateMockBookings } from "@/data/mockData";

// LocalStorage keys
const BOOKINGS_KEY = "room-time-scribe-bookings";
const USER_KEY = "room-time-scribe-user";
const TOKENS_KEY = "room-time-scribe-tokens";

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(generateMockBookings()));
  }
};

// Call initialization
initializeStorage();

// User management
export const saveUser = (
  email: string,
  name: string = "",
  verified: boolean = false,
): User => {
  const user: User = { email, name, verified };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data) as User;
};

export const verifyUser = (email: string): void => {
  const user = getUser();
  if (user && user.email === email) {
    saveUser(email, user.name || "", true);
  }
};

// Tokens for email verification
export const saveToken = (
  id: string,
  token: string,
  type: "booking" | "comment",
): void => {
  const existingTokensStr = localStorage.getItem(TOKENS_KEY) || "{}";
  const existingTokens = JSON.parse(existingTokensStr);

  existingTokens[`${type}-${id}`] = token;
  localStorage.setItem(TOKENS_KEY, JSON.stringify(existingTokens));
};

export const verifyToken = (
  id: string,
  token: string,
  type: "booking" | "comment",
): boolean => {
  const existingTokensStr = localStorage.getItem(TOKENS_KEY) || "{}";
  const existingTokens = JSON.parse(existingTokensStr);

  const storedToken = existingTokens[`${type}-${id}`];
  return storedToken === token;
};

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
