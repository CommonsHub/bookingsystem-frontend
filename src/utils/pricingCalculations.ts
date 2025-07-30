import { Room } from "@/types";

// Room pricing data based on screenshots and mock data
export const roomPricing = {
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

export interface QuoteData {
  room: string;
  originalRoomPrice: number;
  roomPrice: number;
  pricingType: string;
  isWeekend: boolean;
  weekendSurcharge: number;
  cateringPrice: number;
  cateringItems: Array<{ id: string; cost: number }>;
  totalPrice: number;
  attendees: number;
  duration: number;
  isMember: boolean;
  memberDiscount: number;
  discountAmount: number;
  isPublicEvent: boolean;
  nonPublicSurcharge: number;
}

export const calculateRoomPrice = (
  roomId: string,
  durationHours: number,
  estimatedAttendees: number,
  isWeekend: boolean
) => {
  const pricing = roomPricing[roomId as keyof typeof roomPricing];
  if (!pricing) return null;

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

  return { roomPrice, pricingType, weekendSurcharge: isWeekend ? pricing.weekendSurcharge : 0 };
};

export const calculateMemberDiscount = (roomPrice: number, isMember: boolean) => {
  // Only apply discount if explicitly a member (not for "interested" status)
  const memberDiscount = isMember ? 0.3 : 0; // 30% discount
  const originalRoomPrice = roomPrice;
  const discountedRoomPrice = isMember ? Math.round(roomPrice * (1 - memberDiscount)) : roomPrice;
  const discountAmount = originalRoomPrice - discountedRoomPrice;

  return {
    originalRoomPrice,
    discountedRoomPrice,
    memberDiscount: memberDiscount * 100,
    discountAmount
  };
};

export const isWeekendDate = (startDate: Date, endDate: Date): boolean => {
  return startDate.getDay() === 0 || startDate.getDay() === 6 || 
         endDate.getDay() === 0 || endDate.getDay() === 6;
};

export const calculateDurationHours = (startDate: Date, endDate: Date): number => {
  const durationMs = endDate.getTime() - startDate.getTime();
  return durationMs / (1000 * 60 * 60);
};

export const getVATMessage = (roomId: string): string => {
  if (roomId === "room-001") return "VAT excluded for Elinor Ostrom room.";
  if (roomId === "room-003") return "VAT excluded for Angel Room.";
  if (["room-002", "room-004", "room-005"].includes(roomId)) return "VAT included.";
  return "";
};
