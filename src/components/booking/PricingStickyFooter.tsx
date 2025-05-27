
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { FormData } from "./BookingFormSchema";
import { Room } from "@/types";
import { useMemo, useState, useEffect } from "react";
import {
  calculateRoomPrice,
  calculateMemberDiscount,
  isWeekendDate,
  calculateDurationHours,
  QuoteData
} from "@/utils/pricingCalculations";
import { calculateCateringCosts } from "@/utils/cateringCalculations";
import { useTranslation } from "react-i18next";

interface PricingStickyFooterProps {
  rooms: Room[];
}

export const PricingStickyFooter = ({ rooms }: PricingStickyFooterProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormData>();
  const [isVisible, setIsVisible] = useState(false);

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

  // Monitor scroll to show/hide footer
  useEffect(() => {
    const handleScroll = () => {

      const pricingSection = document.querySelector('[data-wizard-section="7"]');

      if (pricingSection) {
        const pricingSectionRect = pricingSection.getBoundingClientRect();

        const pricingSectionNotYetVisible = pricingSectionRect.top > window.innerHeight;

        const shouldShow = pricingSectionNotYetVisible;

        setIsVisible(shouldShow);
      } else {
        console.log('Missing required elements for sticky footer', { pricingSection });
      }
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  if (!quote || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold text-lg">{t('pricing.totalEstimate')}</div>
                <div className="text-sm text-muted-foreground">
                  {quote.room} • {quote.duration}h • {quote.attendees} {t('booking.people')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">€{quote.totalPrice}</div>
                <div className="text-xs text-muted-foreground">{t('pricing.tentativeQuote')}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('pricing.tentativeDisclaimer')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
