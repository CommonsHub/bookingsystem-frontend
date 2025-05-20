
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Booking } from "@/types";
import { CalendarDays, Clock, MapPin, Users, User, Hash } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingDetailsCardProps {
  booking: Booking;
}

export const BookingDetailsCard = ({ booking }: BookingDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{booking.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Date</h4>
              <p className="text-muted-foreground">
                {formatDate(booking.startTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Time</h4>
              <p className="text-muted-foreground">
                {formatTime(booking.startTime)} -{" "}
                {formatTime(booking.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Room</h4>
              <p className="text-muted-foreground">
                {booking.room.name} ({booking.room.location})
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Room Capacity</h4>
              <p className="text-muted-foreground">
                {booking.room.capacity} people
              </p>
            </div>
          </div>

          {booking.organizer && (
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Event Organizer</h4>
                <p className="text-muted-foreground">{booking.organizer}</p>
              </div>
            </div>
          )}

          {booking.estimatedAttendees && (
            <div className="flex items-start gap-2">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Estimated Attendees</h4>
                <p className="text-muted-foreground">{booking.estimatedAttendees} people</p>
              </div>
            </div>
          )}
        </div>

        {booking.selectedSetup && (
          <div className="space-y-2">
            <h3 className="font-medium">Room Setup</h3>
            <p className="text-muted-foreground">{booking.selectedSetup}</p>
          </div>
        )}

        {booking.requiresAdditionalSpace && (
          <div className="space-y-2">
            <h3 className="font-medium">Additional Space</h3>
            <p className="text-muted-foreground">Additional space required</p>
          </div>
        )}

        {booking.isPublicEvent && (
          <div className="space-y-2">
            <h3 className="font-medium">Event Type</h3>
            <p className="text-muted-foreground">Public event</p>
          </div>
        )}

        {booking.additionalComments && (
          <div className="space-y-2">
            <h3 className="font-medium">Additional Comments</h3>
            <p className="text-muted-foreground">{booking.additionalComments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
