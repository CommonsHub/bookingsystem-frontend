
import { CalendarDays, Clock } from "lucide-react";
import { Booking } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BookingDateTimeProps {
  booking: Booking;
}

export const BookingDateTime = ({ booking }: BookingDateTimeProps) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="flex items-start gap-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">{t('booking.date')}</h4>
          <p className="text-muted-foreground">
            {formatDate(booking.startTime)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium">{t('booking.time')}</h4>
          <p className="text-muted-foreground">
            {formatTime(booking.startTime)} -{" "}
            {formatTime(booking.endTime)}
          </p>
        </div>
      </div>
    </>
  );
};
