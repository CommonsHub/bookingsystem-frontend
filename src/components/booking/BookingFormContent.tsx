
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
    <CardContent className="space-y-6">
      <BookingInfoSection control={control} />

      <Separator />

      <DateTimeSection control={control} />

      <Separator />

      <RoomSelectionSection
        control={control}
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
      />

      <Separator />

      <CateringSection control={control} />

      <Separator />

      <EventSupportSection control={control} />

      <Separator />

      <ContactInfoSection control={control} />
      <MembershipSection control={control} />

      <Separator />

      <AdditionalInfoSection control={control} />
    </CardContent>
  );
};
