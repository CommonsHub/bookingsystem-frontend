
import { MapPin, Users } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingLocationInfoProps {
  booking: Booking;
}

export const BookingLocationInfo = ({ booking }: BookingLocationInfoProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">{t('booking.room')}</h4>
          <p className="text-muted-foreground">
            {booking.room.name} ({booking.room.location})
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">{t('booking.estimatedAttendees')}</h4>
          <p className="text-muted-foreground">
            {booking.estimatedAttendees || t("booking.notSpecified")} {booking.estimatedAttendees ? t('booking.people') : ""}
          </p>
        </div>
      </div>
    </>
  );
};
