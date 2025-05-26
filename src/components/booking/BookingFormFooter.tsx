
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormData } from "./BookingFormSchema";
import { MarkAsPaidButton } from "./MarkAsPaidButton";
import { useBooking } from "@/context/BookingContext";

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
  onStartNewDraft,
}: BookingFormFooterProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormData>();
  const { bookings } = useBooking();
  
  const bookingId = watch("bookingId");
  const booking = bookings.find(b => b.id === bookingId);

  return (
    <CardFooter className="flex flex-col gap-3 pt-6">
      {/* Mark as paid button for admins (only in edit mode) */}
      {isEdit && booking && (
        <div className="w-full flex justify-center">
          <MarkAsPaidButton booking={booking} />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 order-2 sm:order-1"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? t('form.actions.update') : t('form.actions.submit')}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 order-1 sm:order-2"
        >
          {t('form.actions.cancel')}
        </Button>
      </div>

      {!isEdit && (
        <div className="flex flex-col sm:flex-row gap-2 w-full text-sm">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearDraft}
            className="flex-1"
          >
            <Trash2 className="mr-2 h-3 w-3" />
            {t('form.actions.clearDraft')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onStartNewDraft}
            className="flex-1"
          >
            <FileText className="mr-2 h-3 w-3" />
            {t('form.actions.startNew')}
          </Button>
        </div>
      )}
    </CardFooter>
  );
};
