
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Copy, Edit, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MarkAsPaidButton } from "./MarkAsPaidButton";
import { PayNowButton } from "./PayNowButton";
import { Booking } from "@/types";

interface BookingActionsProps {
  booking: Booking;
  canCopyBooking?: boolean;
  canEditBooking?: boolean;
  canApproveBooking: boolean;
  canCancelBooking: boolean;
  canMarkAsPaid: boolean;
  onEditBooking?: () => void;
  onCopyBooking?: () => void;
  onApprove: () => void;
  onCancel: () => void;
}

export const BookingActions = ({
  booking,
  canEditBooking,
  canCopyBooking,
  canApproveBooking,
  canCancelBooking,
  canMarkAsPaid,
  onEditBooking,
  onCopyBooking,
  onApprove,
  onCancel,
}: BookingActionsProps) => {
  const { t } = useTranslation();

  // Check if "Pay now" button should be shown (only for approved bookings)
  const canPayNow = booking.status === "approved" && booking.currency === "EUR";

  // Don't show the card if no actions are available
  if (!canApproveBooking && !canCancelBooking && !canMarkAsPaid && !canPayNow) {
    return null;
  }
  console.log('BookingActions rendered', { booking, canApproveBooking, canCancelBooking, canMarkAsPaid });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.actions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approve Button (Admin Only) */}
        {
          canApproveBooking ? (
            <Button onClick={onApprove} className="w-full gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approve Booking
            </Button>
          ) : (
            <Button
              disabled
              className="w-full gap-2"
              title={
                booking.status !== "pending"
                  ? "This booking is not pending approval"
                  : "You need to be verified or have a commonshub.brussels email to approve bookings"
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              {t('buttons.approve')}
            </Button>
          )
        }

        {canPayNow && <PayNowButton booking={booking} />}

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

        {(canEditBooking || canCopyBooking) && (
          <div className="border-t" />)}
        {canEditBooking && (
          <Button onClick={onEditBooking} className="w-full gap-2">
            <Edit className="h-4 w-4" />
            {t('buttons.editBooking')}
          </Button>
        )}

        {canCopyBooking && (
          <Button onClick={onCopyBooking} variant="outline" className="w-full gap-2">
            <Copy className="h-4 w-4" />
            Copy Booking
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
