
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  PlusCircle,
  Clock,
  Check,
  X,
  MessageSquare,
  Users,
  LayoutList,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";

const HomePage = () => {
  const { bookings, user } = useBooking();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isMobile ? 'grid' : 'list');
  const [showAllBookings, setShowAllBookings] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Cancelled</span>
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

  const visibleBookings = bookings.filter((booking) => {
    // First filter for permissions - hide drafts not created by the current user
    if (booking.status === "draft" && (!user || user.email !== booking.createdBy.email)) {
      return false;
    }
    
    // Then filter by date if not showing all bookings
    if (!showAllBookings) {
      // Only show bookings with start dates in the future
      return new Date(booking.startTime) >= new Date();
    }
    
    return true;
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
          <h3 className="text-xl font-medium">No booking requests {!showAllBookings && "upcoming"}</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {showAllBookings ? "There are no bookings in the system yet." : "There are no upcoming bookings. You can create one or view past bookings."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button asChild variant="default">
              <Link to="/bookings/new">New Booking Request</Link>
            </Button>
            {!showAllBookings && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllBookings(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                View All Bookings
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="px-3 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showAllBookings ? "Show upcoming only" : "Show all bookings"}</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <LayoutList className="h-4 w-4" />
                <span className="ml-2 hidden md:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="ml-2 hidden md:inline">Cards</span>
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableCaption>A list of {!showAllBookings && "upcoming"} room booking requests.</TableCaption>
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
                          <Users className="h-3 w-3" />
                          <span>{booking.room.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => (window.location.href = `/bookings/${booking.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg line-clamp-2">{booking.title}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-2 mt-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{formatDateTime(booking.startTime)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{booking.room.name} ({booking.room.capacity})</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      By {booking.createdBy.name || booking.createdBy.email.split("@")[0]}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{booking.comments.length}</span>
                      <MessageSquare className="h-3 w-3" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
