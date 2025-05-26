
import { Separator } from "@/components/ui/separator";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingBasicDetailsProps {
  booking: Booking;
}

export const BookingBasicDetails = ({ booking }: BookingBasicDetailsProps) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="space-y-2">
        <h3 className="font-medium">{t('booking.description')}</h3>
        <p className="text-muted-foreground">{booking.description}</p>
      </div>

      <Separator />
    </>
  );
};
