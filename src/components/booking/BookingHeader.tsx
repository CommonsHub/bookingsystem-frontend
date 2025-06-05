
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, getRelativeTime } from "@/lib/utils";
import { Booking } from "@/types";
import { CheckCircle2, Info, MailCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BookingHeaderNavigation } from "./BookingHeaderNavigation";

interface BookingHeaderProps {
  booking: Booking;
  actionButtons?: React.ReactNode;
  order: {
    status: string, // "success" | "error"
    orderId: string | undefined
  }
}

export const BookingHeader = ({ booking, actionButtons, order }: BookingHeaderProps) => {
  const { t } = useTranslation();


  // Get the creator's display name
  const creatorName = booking.createdBy.name || booking.createdBy.email;

  return (
    <>
      <BookingHeaderNavigation booking={booking} actionButtons={actionButtons} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {booking.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('booking.createdBy')} {creatorName} •{" "}
            {getRelativeTime(booking.createdAt)}
          </p>
        </div>

        {booking.status === "pending" && (
          <Alert>
            <MailCheck className="h-4 w-4" />
            <AlertTitle>{t('alerts.awaitingApproval')}</AlertTitle>
            <AlertDescription>
              {t('alerts.awaitingApprovalDesc')}
            </AlertDescription>
          </Alert>
        )}

        {booking.status === "approved" &&
          order.status !== "success" &&
          booking.approvedBy &&
          booking.approvedAt && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>{t('alerts.bookingApproved')}</AlertTitle>
              <AlertDescription>
                {t('alerts.approvedBy')} {booking.approvedBy.name || booking.approvedBy.email} {t('alerts.on')}{" "}
                {formatDate(booking.approvedAt)}
              </AlertDescription>
            </Alert>
          )}

        {booking.status === "cancelled" &&
          booking.cancelledBy &&
          booking.cancelledAt && (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <X className="h-4 w-4" />
              <AlertTitle>{t('alerts.bookingCancelled')}</AlertTitle>
              <AlertDescription>
                {t('alerts.cancelledBy')} {booking.cancelledBy.name || booking.cancelledBy.email} {t('alerts.on')}{" "}
                {formatDate(booking.cancelledAt)}
              </AlertDescription>
            </Alert>
          )}

        {order.status === "success" &&
          (order.orderId ? (
            <Alert className="bg-green-50 text-green-800 border-green-200 cursor-pointer"
              onClick={() => window.open(`https://checkout.pay.brussels/commonshub/pay/${order.orderId}/success`, '_blank', 'noopener,noreferrer')}>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>{t('messages.paymentSuccess')}</AlertTitle>
              <AlertDescription>{t("messages.paymentSuccessDetails", { orderId: order.orderId })}</AlertDescription>

            </Alert>
          )
            :
            <Alert className="bg-slate-300 text-slate-900 border-slate-400">
              <Info className="h-4 w-4" />
              <AlertTitle>{t('messages.paymentSuccessWithoutOrderId')}</AlertTitle>
              <AlertDescription>{t("messages.paymentSuccessWithoutOrderIdResolution")}</AlertDescription>
            </Alert>
          )
        }

        {order.status === "error" && (
          <Alert className="bg-red-50 text-red-800 border-red-200">
            <X className="h-4 w-4" />
            <AlertTitle>{t('messages.paymentError')}</AlertTitle>
          </Alert>
        )}
      </div>
    </>
  );
};
