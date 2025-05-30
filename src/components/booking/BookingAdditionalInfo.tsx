
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingAdditionalInfoProps {
  booking: Booking;
}

export const BookingAdditionalInfo = ({ booking }: BookingAdditionalInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <>
      {booking.selectedSetup && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('booking.roomSetup')}</h3>
          <p className="text-muted-foreground">{booking.selectedSetup}</p>
        </div>
      )}

      {booking.requiresAdditionalSpace && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('booking.additionalSpace')}</h3>
          <p className="text-muted-foreground">{t('booking.additionalSpaceRequired')}</p>
        </div>
      )}

      {booking.isPublicEvent && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('booking.eventType')}</h3>
          <p className="text-muted-foreground">{t('booking.publicEvent')}</p>
        </div>
      )}

      {booking.additionalComments && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('booking.additionalComments')}</h3>
          <p className="text-muted-foreground">{booking.additionalComments}</p>
        </div>
      )}
    </>
  );
};
