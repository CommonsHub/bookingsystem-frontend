
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTime } from "@/lib/utils";
import { Booking } from "@/types";
import { CheckCircle2, ChevronLeft, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface BookingHeaderProps {
  booking: Booking;
}

export const BookingHeader = ({ booking }: BookingHeaderProps) => {
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
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get the creator's display name
  const creatorName = booking.createdBy.name || booking.createdBy.email;

  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
            Back to bookings
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge
            className={`${statusColor(booking.status)} text-md px-3 py-1`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>

          {booking.status === "pending" && (
            <Badge variant="outline" className="text-muted-foreground">
              Awaiting approval
            </Badge>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {booking.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            Requested by {creatorName} •{" "}
            {getRelativeTime(booking.createdAt)}
          </p>
        </div>

        {booking.status === "pending" && (
          <Alert>
            <MailCheck className="h-4 w-4" />
            <AlertTitle>Awaiting Approval</AlertTitle>
            <AlertDescription>
              This booking request is waiting for administrator approval.
            </AlertDescription>
          </Alert>
        )}

        {booking.status === "approved" &&
          booking.approvedBy &&
          booking.approvedAt && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Booking Approved</AlertTitle>
              <AlertDescription>
                Approved by {booking.approvedBy.name || booking.approvedBy.email} on{" "}
                {formatDate(booking.approvedAt)}
              </AlertDescription>
            </Alert>
          )}
      </div>
    </>
  );
};
