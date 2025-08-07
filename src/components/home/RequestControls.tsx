import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { List, Grid3X3 } from "lucide-react";

interface RequestControlsProps {
  viewMode: 'list' | 'grid';
  showAllRequests: boolean;
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onToggleShowAll: () => void;
}

export const RequestControls = ({
  viewMode,
  showAllRequests,
  onViewModeChange,
  onToggleShowAll,
}: RequestControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
          <span className="ml-2">{t('requests.tableView')}</span>
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 className="h-4 w-4" />
          <span className="ml-2">{t('requests.cardView')}</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowAll}
        >
          {showAllRequests ? t('requests.showActive') : t('requests.showAll')}
        </Button>
      </div>
    </div>
  );
}; 