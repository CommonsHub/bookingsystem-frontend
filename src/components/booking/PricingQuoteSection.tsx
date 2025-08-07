
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormData } from "./BookingFormSchema";
import { Room } from "@/types";
import { PricingPlaceholder } from "./PricingPlaceholder";
import { PricingDisplay } from "./PricingDisplay";
import { QuoteConfirmationSection } from "./QuoteConfirmationSection";
import { 
  calculateRoomPrice, 
  calculateMemberDiscount, 
  isWeekendDate, 
  calculateDurationHours,
  getVATMessage,
  QuoteData 
} from "@/utils/pricingCalculations";
import { calculateCateringCosts } from "@/utils/cateringCalculations";

interface PricingQuoteSectionProps {
  rooms: Room[];
}

export const PricingQuoteSection = ({ rooms }: PricingQuoteSectionProps) => {
  const { watch, control } = useFormContext<FormData>();
  
  const roomId = watch("roomId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const estimatedAttendees = watch("estimatedAttendees") || 0;
  const selectedCatering = watch("cateringOptions") || [];
  const membershipStatus = watch("membershipStatus");
  const isPublicEvent = watch("isPublicEvent");

  const quote = useMemo((): QuoteData | null => {
    // Early return if required data is missing or invalid
    if (!roomId || !startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      return null;
    }

    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      return null;
    }

    // Calculate duration in hours
    const durationHours = calculateDurationHours(startDate, endDate);
    
    // Validate duration
    if (durationHours <= 0) {
      return null;
    }
    
    // Check if weekend
    const isWeekend = isWeekendDate(startDate, endDate);

    // Calculate room pricing
    const roomPricing = calculateRoomPrice(roomId, durationHours, estimatedAttendees, isWeekend);
    if (!roomPricing) {
      return null;
    }

    // Calculate member discount
    const isMember = membershipStatus === "yes";
    const memberPricing = calculateMemberDiscount(roomPricing.roomPrice, isMember);

    // Calculate catering costs
    const catering = calculateCateringCosts(selectedCatering, estimatedAttendees);

    // Calculate non-public event surcharge (30% on room price)
    const nonPublicSurcharge = !isPublicEvent ? Math.round(memberPricing.discountedRoomPrice * 0.3) : 0;

    const totalPrice = memberPricing.discountedRoomPrice + catering.cateringPrice + nonPublicSurcharge;

    return {
      room: room.name,
      originalRoomPrice: memberPricing.originalRoomPrice,
      roomPrice: memberPricing.discountedRoomPrice,
      pricingType: roomPricing.pricingType,
      isWeekend,
      weekendSurcharge: roomPricing.weekendSurcharge,
      cateringPrice: catering.cateringPrice,
      cateringItems: catering.cateringItems,
      totalPrice,
      attendees: estimatedAttendees,
      duration: durationHours,
      isMember,
      memberDiscount: memberPricing.memberDiscount,
      discountAmount: memberPricing.discountAmount,
      isPublicEvent: !!isPublicEvent,
      nonPublicSurcharge
    };
  }, [roomId, startDate, endDate, estimatedAttendees, selectedCatering, rooms, membershipStatus, isPublicEvent]);

  // Show placeholder when no quote is available
  if (!quote) {
    return <PricingPlaceholder />;
  }

  const vatMessage = getVATMessage(roomId);

  return (
    <>
      <PricingDisplay quote={quote} vatMessage={vatMessage} />
      <QuoteConfirmationSection control={control} />
    </>
  );
};
