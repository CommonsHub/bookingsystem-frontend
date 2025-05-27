
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";
import { MarkAsPaidButton } from "./MarkAsPaidButton";
import { canUserApproveBookings } from "@/utils/bookingHelpers";

interface BookingActionsProps {
  booking: Booking;
  canApproveBooking: boolean;
  canCancelBooking: boolean;
  canMarkAsPaid: boolean;
  onApprove: () => void;
  onCancel: () => void;
}

export const BookingActions = ({
  booking,
  canApproveBooking,
  canCancelBooking,
  canMarkAsPaid,
  onApprove,
  onCancel,
}: BookingActionsProps) => {
  const { t } = useTranslation();
  // Don't show the card if no actions are available
  if (!canApproveBooking && !canCancelBooking && !canMarkAsPaid) {
    return null;
  }
  console.log('BookingActions rendered', { booking, canApproveBooking, canCancelBooking, canMarkAsPaid });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.actions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {canApproveBooking && (
          <Button
            onClick={onApprove}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t('buttons.approve')}
          </Button>
        )}

        {canMarkAsPaid &&
          < MarkAsPaidButton booking={booking} />
        }

        {canCancelBooking && (
          <Button
            onClick={onCancel}
            variant="destructive"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            {t('buttons.cancel')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
