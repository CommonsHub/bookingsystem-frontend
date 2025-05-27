import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { toast } from "@/components/ui/toast-utils";
import { BookingHeader } from "@/components/booking/BookingHeader";
import { BookingDetailsCard } from "@/components/booking/BookingDetailsCard";
import { BookingActions } from "@/components/booking/BookingActions";
import { RoomInfoCard } from "@/components/booking/RoomInfoCard";
import { CommentSection } from "@/components/booking/CommentSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/BookingDetail.css";

const BookingDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getBookingById,
    addCommentToBooking,
    approveBookingRequest,
    cancelBookingRequest,
    user,
    canUserApproveBookings,
    canUserCancelBooking,
    loading
  } = useBooking();
  const [submitting, setSubmitting] = useState(false);

  if (!id) return <div>{t('messages.bookingIdMissing')}</div>;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="booking-detail-grid">
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="booking-sidebar space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const booking = getBookingById(id);
  if (!booking) return <div>{t('messages.bookingNotFound')}</div>;

  // Check if user can approve bookings
  const canApproveBooking = booking.status === "pending" && canUserApproveBookings(user);
  const canMarkAsPaid = booking.status === "approved" && canUserApproveBookings(user);

  const canCancelBooking = (booking.status === "pending" || booking.status === "approved") &&
    canUserCancelBooking(booking, user);

  const canEditBooking = booking.status !== "cancelled" && canUserCancelBooking(booking, user);
  const canCopyBooking = booking.status === "cancelled";

  console.log("status", canApproveBooking, canMarkAsPaid, canCancelBooking, canEditBooking, canCopyBooking);
  console.log("user", user, canUserApproveBookings(user));

  const handleSubmitComment = async (commentData: {
    content: string;
    name: string;
    email: string;
  }) => {
    if (!commentData.content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      await addCommentToBooking(id, commentData.content, commentData.email, commentData.name);
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveBooking = () => {
    approveBookingRequest(id);
  };

  const handleCancelBooking = () => {
    cancelBookingRequest(id);
  };

  const handleEditBooking = () => {
    navigate(`/bookings/${id}/edit`);
  };

  const handleCopyBooking = () => {
    navigate(`/bookings/new?copy=${id}`);
  };

  // Create action buttons
  const actionButtons = (
    <>
      {canEditBooking && (
        <Button onClick={handleEditBooking} className="gap-2">
          <Edit className="h-4 w-4" />
          {t('buttons.editBooking')}
        </Button>
      )}

      {canCopyBooking && (
        <Button onClick={handleCopyBooking} variant="outline" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Booking
        </Button>
      )}
    </>
  );

  return (
    <div className="space-y-8">
      <BookingHeader booking={booking} actionButtons={actionButtons} />

      <div className="booking-detail-grid">
        <div className="space-y-6">
          <BookingDetailsCard booking={booking} />
          <CommentSection
            comments={booking.comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={submitting}
          />
        </div>

        <div className="booking-sidebar">
          <BookingActions
            booking={booking}
            canApproveBooking={canApproveBooking}
            canCancelBooking={canCancelBooking}
            canMarkAsPaid={canMarkAsPaid}
            onApprove={handleApproveBooking}
            onCancel={handleCancelBooking}
          />
          <RoomInfoCard booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
