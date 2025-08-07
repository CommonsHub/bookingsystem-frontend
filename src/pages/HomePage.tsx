
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { useRequest } from "@/context/RequestProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
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
import { RequestControls } from "@/components/home/RequestControls";
import { RequestTableView } from "@/components/home/RequestTableView";
import { RequestCardView } from "@/components/home/RequestCardView";
import { CancelRequestDialog } from "@/components/home/CancelRequestDialog";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { bookings, user, canUserCancelBooking, cancelBookingRequest } = useBooking();
  const { requests, canUserCancelRequest, canUserCompleteRequest, cancelRequest, completeRequest } = useRequest();
  const isMobile = useIsMobile();
  const [bookingViewMode, setBookingViewMode] = useState<'list' | 'grid'>(isMobile ? 'grid' : 'list');
  const [requestViewMode, setRequestViewMode] = useState<'list' | 'grid'>(isMobile ? 'grid' : 'list');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null);

  const handleCancelBooking = (id: string) => {
    cancelBookingRequest(id);
    setBookingToCancel(null);
  };

  const handleCancelRequest = (id: string) => {
    cancelRequest(id);
    setRequestToCancel(null);
  };

  const handleCompleteRequest = (id: string) => {
    completeRequest(id);
  };

  // const visibleBookings = bookings;
  const visibleBookings = bookings.filter((booking) => {
    // First filter for permissions - hide drafts not created by the current user
    if (booking.status === "draft" && (!user || user.email !== booking.createdBy.email)) {
      return false;
    }

    // Then filter by date and cancelled status
    if (!showAllBookings) {
      // For upcoming bookings: hide cancelled bookings and only show future bookings OR approved/pending bookings from the past
      if (booking.status === "cancelled") {
        return false;
      }
      
      const bookingDate = new Date(booking.startTime);
      const now = new Date();
      
      // Show future bookings regardless of status (except cancelled)
      if (bookingDate >= now) {
        return true;
      }
      
      // For past bookings, hide paid bookings and only show approved or pending ones
      return booking.status === "approved" || booking.status === "pending";
    }

    // For all bookings: show everything (including cancelled)
    return true;
  });

  const visibleRequests = requests.filter((request) => {
    // First filter for permissions - hide drafts not created by the current user
    if (request.status === "draft" && (!user || user.email !== request.createdBy.email)) {
      return false;
    }

    // Then filter by status
    if (!showAllRequests) {
      // For active requests: hide cancelled and completed requests
      if (request.status === "cancelled" || request.status === "completed") {
        return false;
      }
      return true;
    }

    // For all requests: show everything (including cancelled and completed)
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

      <CancelRequestDialog
        isOpen={!!requestToCancel}
        onClose={() => setRequestToCancel(null)}
        onConfirm={() => requestToCancel && handleCancelRequest(requestToCancel)}
      />

      <BookingLoadingState 
        visibleBookings={visibleBookings}
        showAllBookings={showAllBookings}
        onShowAllBookings={() => setShowAllBookings(true)}
      >
        <div>
          <BookingControls
            viewMode={bookingViewMode}
            showAllBookings={showAllBookings}
            onViewModeChange={setBookingViewMode}
            onToggleShowAll={() => setShowAllBookings(!showAllBookings)}
          />

          {bookingViewMode === 'list' ? (
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

      {/* Requests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('requests.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('requests.subtitle')}
            </p>
          </div>
        </div>

        <RequestControls
          viewMode={requestViewMode}
          showAllRequests={showAllRequests}
          onViewModeChange={setRequestViewMode}
          onToggleShowAll={() => setShowAllRequests(!showAllRequests)}
        />

        {requestViewMode === 'list' ? (
          <RequestTableView
            requests={visibleRequests}
            canUserCancelRequest={canUserCancelRequest}
            canUserCompleteRequest={canUserCompleteRequest}
            user={user}
            onCancelRequest={(id) => setRequestToCancel(id)}
            onCompleteRequest={handleCompleteRequest}
          />
        ) : (
          <RequestCardView
            requests={visibleRequests}
            canUserCancelRequest={canUserCancelRequest}
            canUserCompleteRequest={canUserCompleteRequest}
            user={user}
            onCancelRequest={(id) => setRequestToCancel(id)}
            onCompleteRequest={handleCompleteRequest}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
