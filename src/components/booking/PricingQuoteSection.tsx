
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormData } from "./BookingFormSchema";
import { Room } from "@/types";
import { cateringOptions } from "./CateringSection";

interface PricingQuoteSectionProps {
  rooms: Room[];
}

// Room pricing data based on screenshots and mock data
const roomPricing = {
  "room-001": { // Elinor Ostrom room
    hourly: null,
    halfDay: { base: 500, perPersonUnder33: 15 },
    fullDay: { base: 900, perPersonUnder33: 25 },
    weekendSurcharge: 100
  },
  "room-002": { // Satoshi room  
    hourly: 50,
    halfDay: 150,
    fullDay: 250,
    weekendSurcharge: 0
  },
  "room-003": { // Angel Room
    hourly: 35,
    halfDay: 120,
    fullDay: 200,
    weekendSurcharge: 0
  },
  "room-004": { // Mush Room (mock data)
    hourly: 25,
    halfDay: 80,
    fullDay: 140,
    weekendSurcharge: 0
  },
  "room-005": { // Somatic Studio (mock data)
    hourly: 20,
    halfDay: 60,
    fullDay: 100,
    weekendSurcharge: 0
  }
};

export const PricingQuoteSection = ({ rooms }: PricingQuoteSectionProps) => {
  const { watch } = useFormContext<FormData>();
  
  const roomId = watch("roomId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const estimatedAttendees = watch("estimatedAttendees") || 0;
  const selectedCatering = watch("cateringOptions") || [];
  const membershipStatus = watch("membershipStatus");

  const quote = useMemo(() => {
    // Early return if required data is missing or invalid
    if (!roomId || !startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      return null;
    }

    const room = rooms.find(r => r.id === roomId);
    const pricing = roomPricing[roomId as keyof typeof roomPricing];
    
    if (!room || !pricing) {
      return null;
    }

    // Calculate duration in hours
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    // Validate duration
    if (durationHours <= 0) {
      return null;
    }
    
    // Check if weekend (Saturday = 6, Sunday = 0)
    const isWeekend = startDate.getDay() === 0 || startDate.getDay() === 6 || 
                     endDate.getDay() === 0 || endDate.getDay() === 6;

    let roomPrice = 0;
    let pricingType = "";

    // Determine best pricing option
    if (durationHours <= 4 && pricing.hourly) {
      // Hourly pricing
      roomPrice = pricing.hourly * Math.ceil(durationHours);
      pricingType = `${Math.ceil(durationHours)} hour(s) @ €${pricing.hourly}/hour`;
    } else if (durationHours <= 6) {
      // Half day pricing
      if (typeof pricing.halfDay === 'object') {
        // Elinor Ostrom room special pricing
        if (estimatedAttendees > 0 && estimatedAttendees < 33) {
          roomPrice = pricing.halfDay.perPersonUnder33 * estimatedAttendees;
          pricingType = `Half day @ €${pricing.halfDay.perPersonUnder33}/person (${estimatedAttendees} people)`;
        } else {
          roomPrice = pricing.halfDay.base;
          pricingType = `Half day @ €${pricing.halfDay.base} (33+ people)`;
        }
      } else {
        roomPrice = pricing.halfDay;
        pricingType = `Half day @ €${pricing.halfDay}`;
      }
    } else {
      // Full day pricing
      if (typeof pricing.fullDay === 'object') {
        // Elinor Ostrom room special pricing
        if (estimatedAttendees > 0 && estimatedAttendees < 33) {
          roomPrice = pricing.fullDay.perPersonUnder33 * estimatedAttendees;
          pricingType = `Full day @ €${pricing.fullDay.perPersonUnder33}/person (${estimatedAttendees} people)`;
        } else {
          roomPrice = pricing.fullDay.base;
          pricingType = `Full day @ €${pricing.fullDay.base} (33+ people)`;
        }
      } else {
        roomPrice = pricing.fullDay;
        pricingType = `Full day @ €${pricing.fullDay}`;
      }
    }

    // Add weekend surcharge
    if (isWeekend && pricing.weekendSurcharge > 0) {
      roomPrice += pricing.weekendSurcharge;
    }

    // Calculate member discount
    const isMember = membershipStatus === "yes";
    const memberDiscount = isMember ? 0.3 : 0; // 30% discount
    const originalRoomPrice = roomPrice;
    const discountedRoomPrice = isMember ? Math.round(roomPrice * (1 - memberDiscount)) : roomPrice;

    // Calculate catering costs
    let cateringPrice = 0;
    const cateringItems: string[] = [];
    
    selectedCatering.forEach(cateringId => {
      const option = cateringOptions.find(opt => opt.id === cateringId);
      if (option && estimatedAttendees > 0) {
        const itemCost = option.price * estimatedAttendees;
        cateringPrice += itemCost;
        cateringItems.push(`${option.name}: €${itemCost}`);
      }
    });

    const totalPrice = discountedRoomPrice + cateringPrice;

    return {
      room: room.name,
      originalRoomPrice,
      roomPrice: discountedRoomPrice,
      pricingType,
      isWeekend,
      weekendSurcharge: isWeekend ? pricing.weekendSurcharge : 0,
      cateringPrice,
      cateringItems,
      totalPrice,
      attendees: estimatedAttendees,
      duration: durationHours,
      isMember,
      memberDiscount: memberDiscount * 100,
      discountAmount: originalRoomPrice - discountedRoomPrice
    };
  }, [roomId, startDate, endDate, estimatedAttendees, selectedCatering, rooms, membershipStatus]);

  if (!quote) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Tentative Price Quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{quote.room}</span>
            <div className="flex items-center gap-2">
              {quote.isMember && quote.discountAmount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  €{quote.originalRoomPrice}
                </span>
              )}
              <span className={`font-semibold ${quote.isMember && quote.discountAmount > 0 ? 'text-green-600' : ''}`}>
                €{quote.roomPrice}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{quote.pricingType}</p>
          {quote.isMember && quote.discountAmount > 0 && (
            <p className="text-sm text-green-600 font-medium">
              Member discount (30%): -€{quote.discountAmount}
            </p>
          )}
          {quote.isWeekend && quote.weekendSurcharge > 0 && (
            <p className="text-sm text-muted-foreground">
              Weekend surcharge: €{quote.weekendSurcharge}
            </p>
          )}
        </div>

        {quote.cateringPrice > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Catering ({quote.attendees} people)</span>
                <span className="font-semibold">€{quote.cateringPrice}</span>
              </div>
              {quote.cateringItems.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground">{item}</p>
              ))}
            </div>
          </>
        )}

        <Separator />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Estimate</span>
          <span>€{quote.totalPrice}</span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          * This is a tentative quote. Final pricing may vary and will be confirmed upon approval.
          {roomId === "room-001" && " VAT excluded for Elinor Ostrom room."}
          {roomId === "room-003" && " VAT excluded for Angel Room."}
          {(roomId === "room-002" || roomId === "room-004" || roomId === "room-005") && " VAT included."}
        </p>
      </CardContent>
    </Card>
  );
};
