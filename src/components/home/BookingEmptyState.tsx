
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookingEmptyStateProps {
  showAllBookings: boolean;
  onShowAllBookings: () => void;
}

export const BookingEmptyState = ({ showAllBookings, onShowAllBookings }: BookingEmptyStateProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12 space-y-4">
      <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="text-xl font-medium">
        {showAllBookings ? t('bookings.none') : t('bookings.upcoming')}
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {showAllBookings
          ? t('bookings.none')
          : t('bookings.noneUpcoming')}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <Button asChild variant="default">
          <Link to="/bookings/new">{t('bookings.create')}</Link>
        </Button>
        {!showAllBookings && (
          <Button
            variant="outline"
            onClick={onShowAllBookings}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('bookings.viewAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
