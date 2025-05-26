
import { Booking, User } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { CalendarDays, MessageSquare, Trash2, Hash, Copy, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { languages } from "@/i18n/i18n";

interface BookingCardViewProps {
  bookings: Booking[];
  canUserCancelBooking: (booking: Booking, user?: User) => boolean;
  user?: User;
  onCancelBooking: (id: string) => void;
}

export const BookingCardView = ({
  bookings,
  canUserCancelBooking,
  user,
  onCancelBooking,
}: BookingCardViewProps) => {
  const handleCopyBooking = (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    window.location.href = `/bookings/new?copy=${bookingId}`;
  };

  const getLanguageDisplay = (languageCode?: string) => {
    if (!languageCode) return 'EN';
    const language = languages[languageCode as keyof typeof languages];
    return language ? language.flag : languageCode.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => (window.location.href = `/bookings/${booking.id}`)}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg line-clamp-2">{booking.title}</h3>
              <StatusBadge status={booking.status} />
            </div>

            <div className="text-sm text-muted-foreground space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{formatDateTime(booking.startTime)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Attendees: {booking.estimatedAttendees || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Language: {getLanguageDisplay(booking.language)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-xs text-muted-foreground">
              By {booking.createdBy.name || booking.createdBy.email.split("@")[0]}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{booking.comments.length}</span>
                <MessageSquare className="h-3 w-3" />
              </div>
              
              {(booking.status === "pending" || booking.status === "approved") && 
                canUserCancelBooking(booking, user) && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-destructive" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelBooking(booking.id);
                    }}
                    title="Cancel booking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              )}
              
              {booking.status === "cancelled" && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-blue-600" 
                  onClick={(e) => handleCopyBooking(e, booking.id)}
                  title="Copy booking"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
