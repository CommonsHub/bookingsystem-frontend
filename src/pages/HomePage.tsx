
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { StatusBadge } from "@/components/home/StatusBadge";
import { BookingEmptyState } from "@/components/home/BookingEmptyState";
import { BookingControls } from "@/components/home/BookingControls";
import { BookingTableView } from "@/components/home/BookingTableView";
import { BookingCardView } from "@/components/home/BookingCardView";
import { CancelBookingDialog } from "@/components/home/CancelBookingDialog";
import { BookingLoadingState } from "@/components/home/BookingLoadingState";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { bookings, user, canUserCancelBooking, cancelBookingRequest } = useBooking();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isMobile ? 'grid' : 'list');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handleCancelBooking = (id: string) => {
    cancelBookingRequest(id);
    setBookingToCancel(null);
  };

  const visibleBookings = bookings.filter((booking) => {
    // First filter for permissions - hide drafts not created by the current user
    if (booking.status === "draft" && (!user || user.email !== booking.createdBy.email)) {
      return false;
    }

    // Then filter by date and cancelled status
    if (!showAllBookings) {
      // For upcoming bookings: hide cancelled bookings and only show future bookings OR approved/paid bookings from the past
      if (booking.status === "cancelled") {
        return false;
      }
      
      const bookingDate = new Date(booking.startTime);
      const now = new Date();
      
      // Show future bookings regardless of status (except cancelled)
      if (bookingDate >= now) {
        return true;
      }
      
      // For past bookings, only show approved or paid ones (unpaid approved bookings should be visible)
      return booking.status === "approved" || booking.status === "paid";
    }

    // For all bookings: show everything (including cancelled)
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('bookings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('bookings.subtitle')}
          </p>
        </div>
      </div>

      <Separator />

      <CancelBookingDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={() => bookingToCancel && handleCancelBooking(bookingToCancel)}
      />

      <BookingLoadingState 
        visibleBookings={visibleBookings}
        showAllBookings={showAllBookings}
        onShowAllBookings={() => setShowAllBookings(true)}
      >
        <div>
          <BookingControls
            viewMode={viewMode}
            showAllBookings={showAllBookings}
            onViewModeChange={setViewMode}
            onToggleShowAll={() => setShowAllBookings(!showAllBookings)}
          />

          {viewMode === 'list' ? (
            <BookingTableView
              bookings={visibleBookings}
              showAllBookings={showAllBookings}
              canUserCancelBooking={canUserCancelBooking}
              user={user}
              onCancelBooking={(id) => setBookingToCancel(id)}
            />
          ) : (
            <BookingCardView
              bookings={visibleBookings}
              canUserCancelBooking={canUserCancelBooking}
              user={user}
              onCancelBooking={(id) => setBookingToCancel(id)}
            />
          )}
        </div>
      </BookingLoadingState>
    </div>
  );
};

export default HomePage;
