
import { Link, CalendarDays, User } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingEventLinksProps {
  booking: Booking;
}

export const BookingEventLinks = ({ booking }: BookingEventLinksProps) => {
  const { t } = useTranslation();
  
  return (
    <>
      {booking.organizer && (
        <div className="flex items-start gap-2">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium">{t('booking.eventOrganizer')}</h4>
            <p className="text-muted-foreground">{booking.organizer}</p>
          </div>
        </div>
      )}
      
      {booking.lumaEventUrl && (
        <div className="flex items-start gap-2">
          <Link className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium">{t('booking.lumaEvent')}</h4>
            <a 
              href={booking.lumaEventUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t('booking.openEventPage')}
            </a>
          </div>
        </div>
      )}
      
      {booking.calendarUrl && (
        <div className="flex items-start gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium">{t('booking.calendarEvent')}</h4>
            <a 
              href={booking.calendarUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t('booking.openCalendarEvent')}
            </a>
          </div>
        </div>
      )}
      
      {booking.publicUri && (
        <div className="flex items-start gap-2">
          <Link className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium">{t('booking.publicUri')}</h4>
            <p className="text-muted-foreground">{booking.publicUri}</p>
          </div>
        </div>
      )}
    </>
  );
};
