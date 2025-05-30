
import { Utensils, Headphones } from "lucide-react";
import { Booking } from "@/types";

interface BookingServicesInfoProps {
  booking: Booking;
}

export const BookingServicesInfo = ({ booking }: BookingServicesInfoProps) => {
  return (
    <>
      {/* Catering Services Section */}
      {booking.cateringOptions && booking.cateringOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Catering Services</h3>
          </div>
          <ul className="text-muted-foreground space-y-1 ml-7">
            {booking.cateringOptions.map((option, index) => (
              <li key={index}>• {option}</li>
            ))}
          </ul>
          {booking.cateringComments && (
            <div className="ml-7">
              <p className="text-sm text-muted-foreground font-medium">Additional Notes:</p>
              <p className="text-muted-foreground">{booking.cateringComments}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Services Section */}
      {booking.eventSupportOptions && booking.eventSupportOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Additional Services</h3>
          </div>
          <ul className="text-muted-foreground space-y-1 ml-7">
            {booking.eventSupportOptions.map((option, index) => (
              <li key={index}>• {option}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
