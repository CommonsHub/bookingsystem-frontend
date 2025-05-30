
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingEmptyState } from "./BookingEmptyState";
import { useBookingData } from "@/hooks/useBookingData";

interface BookingLoadingStateProps {
  children: ReactNode;
  visibleBookings: any[];
  showAllBookings: boolean;
  onShowAllBookings: () => void;
}

export const BookingLoadingState = ({ 
  children, 
  visibleBookings, 
  showAllBookings, 
  onShowAllBookings 
}: BookingLoadingStateProps) => {
  const { loading } = useBookingData();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading state for controls */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        {/* Loading state for booking items */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visibleBookings.length === 0) {
    return (
      <BookingEmptyState 
        showAllBookings={showAllBookings} 
        onShowAllBookings={onShowAllBookings} 
      />
    );
  }

  return <>{children}</>;
};
