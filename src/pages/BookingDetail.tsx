
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { toast } from "@/components/ui/toast-utils";
import { BookingHeader } from "@/components/booking/BookingHeader";
import { BookingDetailsCard } from "@/components/booking/BookingDetailsCard";
import { BookingActions } from "@/components/booking/BookingActions";
import { RoomInfoCard } from "@/components/booking/RoomInfoCard";
import { CommentSection } from "@/components/booking/CommentSection";
import "../styles/BookingDetail.css";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getBookingById, 
    addCommentToBooking, 
    approveBookingRequest, 
    user,
    canUserApproveBookings 
  } = useBooking();
  const [submitting, setSubmitting] = useState(false);

  if (!id) return <div>Booking ID is missing</div>;

  const booking = getBookingById(id);
  if (!booking) return <div>Booking not found</div>;

  // Check if user can approve bookings
  const canApproveBooking = booking.status === "pending" && canUserApproveBookings(user);

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

  return (
    <div className="space-y-8">
      <BookingHeader booking={booking} />
      
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
            onApprove={handleApproveBooking} 
          />
          <RoomInfoCard booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
