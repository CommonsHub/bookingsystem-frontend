
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter } from "lucide-react";

interface BookingEmptyStateProps {
  showAllBookings: boolean;
  onShowAllBookings: () => void;
}

export const BookingEmptyState = ({ showAllBookings, onShowAllBookings }: BookingEmptyStateProps) => {
  return (
    <div className="text-center py-12 space-y-4">
      <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="text-xl font-medium">No booking requests {!showAllBookings && "upcoming"}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {showAllBookings
          ? "There are no bookings in the system yet."
          : "There are no upcoming bookings. You can create one or view past bookings."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <Button asChild variant="default">
          <Link to="/bookings/new">New Booking Request</Link>
        </Button>
        {!showAllBookings && (
          <Button
            variant="outline"
            onClick={onShowAllBookings}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            View All Bookings
          </Button>
        )}
      </div>
    </div>
  );
};
