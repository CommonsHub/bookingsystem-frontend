import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { formatDateTime, getRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarDays, Filter, PlusCircle, Clock, Check, X, MessageSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HomePage = () => {
  const { bookings, user } = useBooking();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
    }
  };

  // Filter bookings to show only visible ones
  const visibleBookings = bookings.filter(booking => {
    // Show all non-draft bookings
    if (booking.status !== 'draft') return true;
    
    // Show draft bookings only to the creator
    return user && user.email === booking.createdBy.email;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Bookings</h1>
          <p className="text-muted-foreground mt-1">
            View all room booking requests and their status
          </p>
        </div>
        
        <Button asChild>
          <Link to="/bookings/new" className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Booking</span>
          </Link>
        </Button>
      </div>
      
      <Separator />

      {visibleBookings.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium">No booking requests yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Create your first room booking request to get started.
          </p>
          <Button asChild variant="default" className="mt-4">
            <Link to="/bookings/new">New Booking Request</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Table View */}
          <div className="rounded-md border">
            <Table>
              <TableCaption>A list of all room booking requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created by</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleBookings.map((booking) => (
                  <TableRow key={booking.id} className="cursor-pointer" onClick={() => window.location.href = `/bookings/${booking.id}`}>
                    <TableCell className="font-medium">{booking.title}</TableCell>
                    <TableCell>{booking.room.name}</TableCell>
                    <TableCell>{formatDateTime(booking.startTime)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{booking.room.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{booking.createdBy.email.split('@')[0]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{booking.comments.filter(c => c.status === 'published').length}</span>
                        {booking.comments.length > 0 && <MessageSquare className="h-3 w-3" />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Card View - Keep the original card layout as an alternative view */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Card View</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBookings.map(booking => (
              <Link 
                to={`/bookings/${booking.id}`}
                key={booking.id}
                className="block group"
              >
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'draft' && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Awaiting verification
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {booking.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {booking.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room:</span>
                        <span className="font-medium">{booking.room.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {formatDateTime(booking.startTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comments:</span>
                        <span className="font-medium flex items-center gap-1">
                          {booking.comments.filter(c => c.status === 'published').length}
                          {booking.comments.length > 0 && <MessageSquare className="h-3 w-3" />}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    <div className="w-full flex justify-between items-center">
                      <span>{booking.createdBy.email}</span>
                      <span>{getRelativeTime(booking.createdAt)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
