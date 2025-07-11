import { Booking, User } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { CalendarDays, MessageSquare, Trash2, Hash, Copy, Globe, CreditCard, ExternalLink, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { languages } from "@/i18n/i18n";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { canUserApproveBookings } from "@/utils/bookingHelpers";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { updateBooking } = useBooking();
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());

  const handleCopyBooking = (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    window.location.href = `/bookings/new?copy=${bookingId}`;
  };

  const handleMarkAsPaid = async (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    setUpdatingBookings(prev => new Set(prev).add(booking.id));
    try {
      await updateBooking(booking.id, { ...booking, status: "paid" });
    } catch (error) {
      console.error("Error marking booking as paid:", error);
    } finally {
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(booking.id);
        return newSet;
      });
    }
  };

  const getLanguageDisplay = (languageCode?: string) => {
    if (!languageCode) return 'EN';
    const language = languages[languageCode as keyof typeof languages];
    return language ? language.flag : languageCode.toUpperCase();
  };

  const canMarkAsPaid = (booking: Booking) => {
    return user && canUserApproveBookings(user) && booking.status === "approved";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          role="article"
          aria-label={`Booking: ${booking.title}`}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => (window.location.href = `/bookings/${booking.id}`)}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg line-clamp-2">{booking.title}</h3>
              <StatusBadge status={booking.status} aria-label={`Status: ${booking.status}`} />
            </div>

            <div className="text-sm text-muted-foreground space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
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

              {booking.price && (
                <div className="flex items-center gap-2">
                  <Euro className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Price: €{booking.price.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Event Links */}
            {(booking.lumaEventUrl || booking.calendarUrl) && (
              <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                {booking.lumaEventUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(booking.lumaEventUrl, '_blank');
                    }}
                    aria-label="Open Luma event in new tab"
                    title="Open Luma event"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                {booking.calendarUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-green-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(booking.calendarUrl, '_blank');
                    }}
                    title="Open calendar event"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
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
              
              {canMarkAsPaid(booking) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-green-600"
                  onClick={(e) => handleMarkAsPaid(e, booking)}
                  aria-label={`Mark booking ${booking.title} as paid`}
                  title={t('booking.markAsPaid')}
                  disabled={updatingBookings.has(booking.id)}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Pay
                </Button>
              )}
              
              {(booking.status === "pending" || booking.status === "approved") && 
                canUserCancelBooking(booking, user) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelBooking(booking.id);
                    }}
                    aria-label={`Cancel booking ${booking.title}`}
                    title="Cancel booking"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
              )}
              
              {booking.status === "cancelled" && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-3 text-blue-600" 
                  onClick={(e) => handleCopyBooking(e, booking.id)}
                  aria-label={`Copy booking ${booking.title}`}
                  title="Copy booking"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
