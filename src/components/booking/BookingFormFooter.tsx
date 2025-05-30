
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BookingFormFooterProps {
  isEdit?: boolean;
  submitting: boolean;
  onCancel: () => void;
  onClearDraft: () => void;
  onStartNewDraft: () => void;
}

export const BookingFormFooter = ({
  isEdit = false,
  submitting,
  onCancel,
  onClearDraft,
  onStartNewDraft
}: BookingFormFooterProps) => {
  const { t } = useTranslation();

  return (
    <CardFooter className="flex justify-between" data-form-footer>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClearDraft}
        >
          {t('buttons.clearDraft')}
        </Button>
      </div>
      <Button type="submit" disabled={submitting} onClick={onStartNewDraft}>
        {submitting 
          ? (isEdit ? t('buttons.updating') : t('buttons.submitting'))
          : (isEdit ? t('buttons.update') : t('buttons.submit'))
        }
      </Button>
    </CardFooter>
  );
};
