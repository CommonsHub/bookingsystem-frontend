
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface BookingFormHeaderProps {
  isEdit?: boolean;
  isLoading?: boolean;
  draftLoaded?: boolean;
}

export const BookingFormHeader = ({
  isEdit = false,
  isLoading = false,
  draftLoaded = false
}: BookingFormHeaderProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? t('bookings.editTitle') : t('bookings.newTitle')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEdit ? t('bookings.editDescription') : t('bookings.newDescription')}
          {isLoading && ` (${t('messages.savingDraft')})`}
          {!isLoading && draftLoaded && ` (${t('messages.draftLoaded')})`}
        </p>
      </div>
    </>
  );
};
