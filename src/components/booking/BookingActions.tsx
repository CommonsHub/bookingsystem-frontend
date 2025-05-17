
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Booking, User } from "@/types";
import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";

interface BookingActionsProps {
  booking: Booking;
  canApproveBooking: boolean;
  canCancelBooking: boolean;
  onApprove: () => void;
  onCancel: () => void;
}

export const BookingActions = ({
  booking,
  canApproveBooking,
  canCancelBooking,
  onApprove,
  onCancel,
}: BookingActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approve Button */}
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

        {/* Cancel Button */}
        {booking.status !== "cancelled" && canCancelBooking && (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <X className="h-4 w-4" />
                Cancel Booking
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel booking</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep the booking</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    onCancel();
                    setIsDialogOpen(false);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, cancel booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {booking.status === "cancelled" && (
          <div className="text-center text-sm text-destructive">
            This booking has been cancelled
          </div>
        )}
      </CardContent>
    </Card>
  );
};
