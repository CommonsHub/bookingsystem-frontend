
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTime } from "@/lib/utils";
import { Booking } from "@/types";
import { CheckCircle2, ChevronLeft, MailCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BookingHeaderProps {
  booking: Booking;
}

export const BookingHeader = ({ booking }: BookingHeaderProps) => {
  const { t } = useTranslation();
  
  const statusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-yellow-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get the creator's display name
  const creatorName = booking.createdBy.name || booking.createdBy.email;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              {t('nav.backToBookings')}
            </Link>
          </Button>

          <Badge
            className={`${statusColor(booking.status)} text-md px-3 py-1`}
          >
            {t(`status.${booking.status}`)}
          </Badge>

          {booking.status === "pending" && (
            <Badge variant="outline" className="text-muted-foreground">
              {t('alerts.awaitingApproval')}
            </Badge>
          )}
        </div>
      </div>

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
      </div>
    </>
  );
};
