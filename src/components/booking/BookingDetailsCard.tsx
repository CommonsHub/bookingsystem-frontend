
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";
import { BookingBasicDetails } from "./BookingBasicDetails";
import { BookingDateTime } from "./BookingDateTime";
import { BookingLocationInfo } from "./BookingLocationInfo";
import { BookingContactInfo } from "./BookingContactInfo";
import { BookingEventLinks } from "./BookingEventLinks";
import { BookingServicesInfo } from "./BookingServicesInfo";
import { BookingAdditionalInfo } from "./BookingAdditionalInfo";
import { BookingPriceInfo } from "./BookingPriceInfo";

interface BookingDetailsCardProps {
  booking: Booking;
}

export const BookingDetailsCard = ({ booking }: BookingDetailsCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingBasicDetails booking={booking} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BookingDateTime booking={booking} />
          <BookingLocationInfo booking={booking} />
          <BookingContactInfo booking={booking} />
          <BookingEventLinks booking={booking} />
          <BookingPriceInfo booking={booking} />
        </div>

        <BookingAdditionalInfo booking={booking} />
        <BookingServicesInfo booking={booking} />
      </CardContent>
    </Card>
  );
};
