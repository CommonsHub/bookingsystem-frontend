import { Booking, User } from "@/types";
import { verifyStorageUser, getStorageUser } from "@/utils/storage-helpers";

export const useVerification = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
  const verifyBookingEmail = (id: string, token: string): boolean => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return false;

    const tokensString =
      localStorage.getItem("room-time-scribe-tokens") || "{}";
    const tokens = JSON.parse(tokensString);

    if (tokens[`booking-${id}`] === token) {
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === id ? { ...b, status: "pending" as const } : b,
        ),
      );

      verifyStorageUser(booking.createdBy.email);
      setUser(getStorageUser());

      return true;
    }

    return false;
  };

  const verifyCommentEmail = (
    bookingId: string,
    commentId: string,
    token: string,
  ): boolean => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const comment = booking.comments.find((c) => c.id === commentId);
    if (!comment) return false;

    const tokensString =
      localStorage.getItem("room-time-scribe-tokens") || "{}";
    const tokens = JSON.parse(tokensString);

    if (tokens[`comment-${commentId}`] === token) {
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                comments: b.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, status: "published" as const }
                    : c,
                ),
              }
            : b,
        ),
      );

      verifyStorageUser(comment.createdBy.email);
      setUser(getStorageUser());

      return true;
    }

    return false;
  };

  return {
    verifyBookingEmail,
    verifyCommentEmail,
  };
};
