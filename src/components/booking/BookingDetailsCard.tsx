
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Booking } from "@/types";
import { CalendarDays, Clock, MapPin, Users, User, Hash, Link, Mail } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BookingDetailsCardProps {
  booking: Booking;
}

export const BookingDetailsCard = ({ booking }: BookingDetailsCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">{t('booking.description')}</h3>
          <p className="text-muted-foreground">{booking.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <h4 className="font-medium">{t('booking.roomCapacity')}</h4>
              <p className="text-muted-foreground">
                {booking.room.capacity} {t('booking.people')}
              </p>
            </div>
          </div>

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

          {booking.organizer && (
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">{t('booking.eventOrganizer')}</h4>
                <p className="text-muted-foreground">{booking.organizer}</p>
              </div>
            </div>
          )}

          {booking.estimatedAttendees && (
            <div className="flex items-start gap-2">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">{t('booking.estimatedAttendees')}</h4>
                <p className="text-muted-foreground">{booking.estimatedAttendees} {t('booking.people')}</p>
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
        </div>

        {booking.selectedSetup && (
          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.roomSetup')}</h3>
            <p className="text-muted-foreground">{booking.selectedSetup}</p>
          </div>
        )}

        {booking.requiresAdditionalSpace && (
          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.additionalSpace')}</h3>
            <p className="text-muted-foreground">{t('booking.additionalSpaceRequired')}</p>
          </div>
        )}

        {booking.isPublicEvent && (
          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.eventType')}</h3>
            <p className="text-muted-foreground">{t('booking.publicEvent')}</p>
          </div>
        )}

        {booking.additionalComments && (
          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.additionalComments')}</h3>
            <p className="text-muted-foreground">{booking.additionalComments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
