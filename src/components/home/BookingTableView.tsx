
import { Booking, User } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MessageSquare, Trash2, Users, Hash, Copy, Globe, Calendar, Clock, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { languages } from "@/i18n/i18n";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { canUserApproveBookings } from "@/utils/bookingHelpers";
import { useState } from "react";

interface BookingTableViewProps {
  bookings: Booking[];
  showAllBookings: boolean;
  canUserCancelBooking: (booking: Booking, user?: User) => boolean;
  user?: User;
  onCancelBooking: (id: string) => void;
}

export const BookingTableView = ({
  bookings,
  showAllBookings,
  canUserCancelBooking,
  user,
  onCancelBooking,
}: BookingTableViewProps) => {
  const { t } = useTranslation();
  const { updateBooking } = useBooking();
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canMarkAsPaid = (booking: Booking) => {
    return user && canUserApproveBookings(user) && booking.status === "approved";
  };

  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-card border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => (window.location.href = `/bookings/${booking.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate mb-1">
                  {booking.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{booking.room.name}</span>
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{formatDate(booking.startTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{formatTime(booking.startTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-muted-foreground" />
                <span>{booking.estimatedAttendees || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{getLanguageDisplay(booking.language)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate">
                  {booking.createdBy.name || booking.createdBy.email.split("@")[0]}
                </span>
                {booking.comments.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1">
                    <MessageSquare className="h-2 w-2 mr-1" />
                    {booking.comments.length}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1" onClick={stopPropagation}>
                {canMarkAsPaid(booking) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 w-7 p-0 text-green-600" 
                    onClick={(e) => handleMarkAsPaid(e, booking)}
                    title={t('booking.markAsPaid')}
                    disabled={updatingBookings.has(booking.id)}
                  >
                    <CreditCard className="h-3 w-3" />
                  </Button>
                )}
                
                {(booking.status === "pending" || booking.status === "approved") && 
                  canUserCancelBooking(booking, user) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelBooking(booking.id);
                      }}
                      title={t('buttons.cancel')}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                )}
                
                {booking.status === "cancelled" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 w-7 p-0 text-blue-600" 
                    onClick={(e) => handleCopyBooking(e, booking.id)}
                    title={t('booking.copyBooking')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border overflow-hidden">
        <Table>
          <TableCaption className="py-4">
            {showAllBookings ? t('bookings.caption') : t('bookings.captionUpcoming')}
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">{t('booking.title')}</TableHead>
              <TableHead className="font-semibold">{t('booking.room')}</TableHead>
              <TableHead className="font-semibold">{t('booking.date')}</TableHead>
              <TableHead className="font-semibold">{t('booking.attendees')}</TableHead>
              <TableHead className="font-semibold">{t('booking.status')}</TableHead>
              <TableHead className="font-semibold">{t('booking.language')}</TableHead>
              <TableHead className="font-semibold">{t('booking.createdBy')}</TableHead>
              <TableHead className="font-semibold">{t('booking.comments')}</TableHead>
              <TableHead className="font-semibold text-center">{t('booking.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.id}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() =>
                  (window.location.href = `/bookings/${booking.id}`)
                }
              >
                <TableCell className="font-medium max-w-[200px]">
                  <div className="truncate" title={booking.title}>
                    {booking.title}
                  </div>
                </TableCell>
                <TableCell className="max-w-[120px]">
                  <div className="truncate" title={booking.room.name}>
                    {booking.room.name}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{formatDate(booking.startTime)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span>{booking.estimatedAttendees || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguageDisplay(booking.language)}</span>
                    <span className="text-xs text-muted-foreground">
                      {booking.language?.toUpperCase() || 'EN'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px]">
                  <div className="truncate" title={booking.createdBy.name || booking.createdBy.email}>
                    {booking.createdBy.name || booking.createdBy.email.split("@")[0]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{booking.comments.length}</span>
                    {booking.comments.length > 0 && (
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={stopPropagation}>
                  <div className="flex items-center justify-center gap-1">
                    {canMarkAsPaid(booking) && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50" 
                        onClick={(e) => handleMarkAsPaid(e, booking)}
                        title={t('booking.markAsPaid')}
                        disabled={updatingBookings.has(booking.id)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {(booking.status === "pending" || booking.status === "approved") && 
                      canUserCancelBooking(booking, user) && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelBooking(booking.id);
                          }}
                          title={t('buttons.cancel')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    
                    {booking.status === "cancelled" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50" 
                        onClick={(e) => handleCopyBooking(e, booking.id)}
                        title={t('booking.copyBooking')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
