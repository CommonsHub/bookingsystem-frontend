
import { User, Mail } from "lucide-react";
import { Booking } from "@/types";

interface BookingContactInfoProps {
  booking: Booking;
}

export const BookingContactInfo = ({ booking }: BookingContactInfoProps) => {
  return (
    <>
      <div className="flex items-start gap-2">
        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">Contact Name</h4>
          <p className="text-muted-foreground">{booking.createdBy.name}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">Contact Email</h4>
          <p className="text-muted-foreground">{booking.createdBy.email}</p>
        </div>
      </div>
    </>
  );
};
