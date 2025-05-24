
import { Button } from "@/components/ui/button";
import { Filter, LayoutGrid, LayoutList } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookingControlsProps {
  viewMode: 'list' | 'grid';
  showAllBookings: boolean;
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onToggleShowAll: () => void;
}

export const BookingControls = ({ 
  viewMode, 
  showAllBookings, 
  onViewModeChange, 
  onToggleShowAll 
}: BookingControlsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleShowAll}
        className="px-3 flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        <span>{showAllBookings ? t('bookings.showUpcoming') : t('bookings.showAll')}</span>
      </Button>

      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="px-3"
        >
          <LayoutList className="h-4 w-4" />
          <span className="ml-2 hidden md:inline">{t('bookings.tableView')}</span>
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="px-3"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="ml-2 hidden md:inline">{t('bookings.cardView')}</span>
        </Button>
      </div>
    </div>
  );
};
