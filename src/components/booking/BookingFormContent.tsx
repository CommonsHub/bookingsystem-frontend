
import { Control } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { BookingInfoSection } from "./BookingInfoSection";
import { CateringSection } from "./CateringSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { DateTimeSection } from "./DateTimeSection";
import { EventSupportSection } from "./EventSupportSection";
import { MembershipSection } from "./MembershipSection";
import { RoomSelectionSection } from "./RoomSelectionSection";
import { PricingQuoteSection } from "./PricingQuoteSection";
import { FormData } from "./BookingFormSchema";
import { Room } from "@/types";

interface BookingFormContentProps {
  control: Control<FormData>;
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
}

export const BookingFormContent = ({
  control,
  rooms,
  selectedRoomId,
  setSelectedRoomId
}: BookingFormContentProps) => {
  return (
    <CardContent className="space-y-6 mt-20">
      <div data-wizard-section="0" className="scroll-mt-32">
        <BookingInfoSection control={control} />
      </div>

      <Separator />

      <div data-wizard-section="1" className="scroll-mt-32">
        <DateTimeSection control={control} />
      </div>

      <Separator />

      <div data-wizard-section="2" className="scroll-mt-32">
        <RoomSelectionSection
          control={control}
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </div>

      <Separator />

      <div data-wizard-section="3" className="scroll-mt-32">
        <CateringSection control={control} />
      </div>

      <Separator />

      <div data-wizard-section="4" className="scroll-mt-32">
        <EventSupportSection control={control} />
      </div>

      <Separator />

      <div data-wizard-section="5" className="scroll-mt-32">
        <ContactInfoSection control={control} isReadOnly={false} />
        <MembershipSection control={control} />
      </div>

      <Separator />

      <div data-wizard-section="6" className="scroll-mt-32">
        <AdditionalInfoSection control={control} />
      </div>

      <PricingQuoteSection rooms={rooms} />
    </CardContent>
  );
};
