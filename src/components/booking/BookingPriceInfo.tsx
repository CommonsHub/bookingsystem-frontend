
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingPriceInfoProps {
  booking: Booking;
}

export const BookingPriceInfo = ({ booking }: BookingPriceInfoProps) => {
  const { t } = useTranslation();

  if (!booking.price) {
    return null;
  }

  return (
    <div>
      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
        {t('booking.price')}
      </h4>
      <p className="text-sm">
        {booking.price.toLocaleString()} {booking.currency || 'EUR'}
      </p>
    </div>
  );
};
