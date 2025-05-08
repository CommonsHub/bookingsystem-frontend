import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBooking } from "@/context/BookingContext";
import { Booking } from "@/types";

export const VerifyEmail = () => {
  const { type, id, token } = useParams<{
    type: string;
    id: string;
    token: string;
  }>();
  const navigate = useNavigate();
  const { verifyBookingEmail, verifyCommentEmail, getBookingById } =
    useBooking();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id || !token) {
      setVerifying(false);
      return;
    }

    // Short delay for UX
    const timeoutId = setTimeout(() => {
      try {
        if (type === "booking") {
          const verified = verifyBookingEmail(id, token);
          setSuccess(verified);
          setBookingId(id);
        } else if (type === "comment") {
          // For comments, we need to find which booking the comment belongs to
          const bookings = localStorage.getItem("room-time-scribe-bookings");
          if (bookings) {
            const parsedBookings: Booking[] = JSON.parse(bookings);

            // Find the booking that contains this comment
            for (const booking of parsedBookings) {
              const commentExists = booking.comments.some((c) => c.id === id);
              if (commentExists) {
                const verified = verifyCommentEmail(booking.id, id, token);
                setSuccess(verified);
                setBookingId(booking.id);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [type, id, token, verifyBookingEmail, verifyCommentEmail]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {verifying
              ? "Verifying your email address..."
              : success
                ? "Your email has been verified!"
                : "Verification failed"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-6">
          {verifying ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium text-lg">Verification Successful!</p>
                <p className="text-muted-foreground">
                  {type === "booking"
                    ? "Your booking request has been verified and is now pending approval."
                    : "Your comment has been published successfully."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <div className="text-center space-y-2">
                <p className="font-medium text-lg">Verification Failed</p>
                <p className="text-muted-foreground">
                  The verification link is invalid or has expired.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="w-full flex flex-col space-y-2">
            {success && bookingId && (
              <Button asChild>
                <Link to={`/bookings/${bookingId}`} className="w-full">
                  View {type === "booking" ? "Booking" : "Comment"}
                </Link>
              </Button>
            )}

            <Button
              variant={success ? "outline" : "default"}
              asChild
              className="w-full"
            >
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
