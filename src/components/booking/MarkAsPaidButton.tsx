
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { canUserApproveBookings } from "@/utils/bookingHelpers";
import { Booking } from "@/types";

interface MarkAsPaidButtonProps {
  booking: Booking;
}

export const MarkAsPaidButton = ({ booking }: MarkAsPaidButtonProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateBooking } = useBooking();
  const [isUpdating, setIsUpdating] = useState(false);

  // Only show for admins and only if booking is approved
  if (!user || !canUserApproveBookings(user) || booking.status !== "approved") {
    return null;
  }

  const handleMarkAsPaid = async () => {
    setIsUpdating(true);
    try {
      await updateBooking(booking.id, { ...booking, status: "paid" });
    } catch (error) {
      console.error("Error marking booking as paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      onClick={handleMarkAsPaid}
      disabled={isUpdating}
      variant="default"
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      {isUpdating ? t('booking.markingAsPaid') : t('booking.markAsPaid')}
    </Button>
  );
};
