
import { Booking, User } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MessageSquare, Trash2, Users, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
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
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableCaption>A list of {!showAllBookings && "upcoming"} room booking requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
