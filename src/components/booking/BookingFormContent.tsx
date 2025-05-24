
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
    <CardContent className="space-y-12 mt-32 pb-8">
      <div data-wizard-section="0" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p className="text-muted-foreground text-sm">Tell us about your event</p>
        </div>
        <BookingInfoSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="1" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
          <p className="text-muted-foreground text-sm">When will your event take place?</p>
        </div>
        <DateTimeSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="2" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Room Selection</h2>
          <p className="text-muted-foreground text-sm">Choose the perfect space for your event</p>
        </div>
        <RoomSelectionSection
          control={control}
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="3" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Catering Options</h2>
          <p className="text-muted-foreground text-sm">Add food and beverages to your event (optional)</p>
        </div>
        <CateringSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="4" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Event Support</h2>
          <p className="text-muted-foreground text-sm">Additional services for your event (optional)</p>
        </div>
        <EventSupportSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="5" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Contact & Membership</h2>
          <p className="text-muted-foreground text-sm">Your contact information and membership details</p>
        </div>
        <div className="space-y-6">
          <ContactInfoSection control={control} isReadOnly={false} />
          <MembershipSection control={control} />
        </div>
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="6" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
          <p className="text-muted-foreground text-sm">Any other details you'd like to share (optional)</p>
        </div>
        <AdditionalInfoSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="7" className="scroll-mt-40 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pricing Estimate</h2>
          <p className="text-muted-foreground text-sm">Review the estimated costs for your booking</p>
        </div>
        <PricingQuoteSection rooms={rooms} />
      </div>
    </CardContent>
  );
};
