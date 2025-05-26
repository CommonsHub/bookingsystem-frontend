
import { Booking, User } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MessageSquare, Trash2, Users, Hash, Copy } from "lucide-react";
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
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCopyBooking = (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    window.location.href = `/bookings/new?copy=${bookingId}`;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableCaption>
          {showAllBookings ? t('bookings.caption') : t('bookings.captionUpcoming')}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{t('booking.room')}</TableHead>
            <TableHead>{t('booking.room')}</TableHead>
            <TableHead>{t('booking.date')}</TableHead>
            <TableHead>{t('booking.attendees')}</TableHead>
            <TableHead>{t('booking.status')}</TableHead>
            <TableHead>{t('booking.createdBy')}</TableHead>
            <TableHead>{t('booking.comments')}</TableHead>
            <TableHead>{t('booking.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="cursor-pointer"
              onClick={() =>
                (window.location.href = `/bookings/${booking.id}`)
              }
            >
              <TableCell className="font-medium">{booking.title}</TableCell>
              <TableCell>{booking.room.name}</TableCell>
              <TableCell>{formatDateTime(booking.startTime)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span>{booking.estimatedAttendees || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell><StatusBadge status={booking.status} /></TableCell>
              <TableCell>
                {booking.createdBy.name || booking.createdBy.email.split("@")[0]}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span>{booking.comments.length}</span>
                  {booking.comments.length > 0 && (
                    <MessageSquare className="h-3 w-3" />
                  )}
                </div>
              </TableCell>
              <TableCell onClick={stopPropagation}>
                <div className="flex items-center gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
