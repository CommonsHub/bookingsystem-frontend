
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types";

interface RoomInfoCardProps {
  booking: Booking;
}

export const RoomInfoCard = ({ booking }: RoomInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Location</h3>
          <p className="text-muted-foreground">{booking.room.location}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Capacity</h3>
          <p className="text-muted-foreground">
            {booking.room.capacity} people
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Amenities</h3>
          <ul className="text-muted-foreground space-y-1">
            <li>Projector</li>
            <li>Whiteboards</li>
            <li>Video conferencing</li>
            <li>Coffee station</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
