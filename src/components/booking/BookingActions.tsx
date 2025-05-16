
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking, User } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface BookingActionsProps {
  booking: Booking;
  canApproveBooking: boolean;
  onApprove: () => void;
}

export const BookingActions = ({ 
  booking, 
  canApproveBooking, 
  onApprove 
}: BookingActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canApproveBooking ? (
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
            Approve Booking
          </Button>
        )}

        {booking.status === "approved" && (
          <div className="text-center text-sm text-muted-foreground">
            This booking has already been approved
          </div>
        )}

        {booking.status === "pending" && !canApproveBooking && (
          <div className="text-center text-sm text-muted-foreground">
            Only administrators can approve bookings
          </div>
        )}
      </CardContent>
    </Card>
  );
};
