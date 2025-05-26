
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface RoomInfoCardProps {
  booking: Booking;
}

export const RoomInfoCard = ({ booking }: RoomInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('roomInfo.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">{t('roomInfo.location')}</h3>
          <p className="text-muted-foreground">{booking.room.location}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{t('roomInfo.capacity')}</h3>
          <p className="text-muted-foreground">
            {booking.room.capacity} {t('booking.people')}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{t('roomInfo.amenities')}</h3>
          <ul className="text-muted-foreground space-y-1">
            <li>{t('roomInfo.projector')}</li>
            <li>{t('roomInfo.whiteboards')}</li>
            <li>{t('roomInfo.videoConferencing')}</li>
            <li>{t('roomInfo.coffeeStation')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
