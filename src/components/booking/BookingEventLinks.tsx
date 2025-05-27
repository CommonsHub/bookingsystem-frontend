
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";
import { ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingEventLinksProps {
  booking: Booking;
}

export const BookingEventLinks = ({ booking }: BookingEventLinksProps) => {
  const { t } = useTranslation();

  const hasEventLinks = booking.lumaEventUrl || booking.calendarUrl || booking.publicUri;

  if (!hasEventLinks) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">Event Links</h4>
      <div className="space-y-2">
        {booking.lumaEventUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-blue-600 hover:text-blue-800"
              onClick={() => window.open(booking.lumaEventUrl, '_blank')}
            >
              {t('booking.lumaEvent')}
            </Button>
          </div>
        )}
        
        {booking.calendarUrl && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-blue-600 hover:text-blue-800"
              onClick={() => window.open(booking.calendarUrl, '_blank')}
            >
              {t('booking.calendarEvent')}
            </Button>
          </div>
        )}
        
        {booking.publicUri && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">{t('booking.publicUri')}: </span>
              <span className="font-mono text-xs">{booking.publicUri}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
