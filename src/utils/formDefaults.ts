
import { FormData } from "@/components/booking/BookingFormSchema";
import { Booking } from "@/types";

export const createDefaultFormValues = (
  defaultEmail: string,
  overrides: Partial<FormData> = {}
): FormData => {
  return {
    title: "",
    description: "",
    roomId: "",
    setupOption: "",
    requiresAdditionalSpace: false,
    startDate: new Date(),
    endDate: new Date(),
    email: defaultEmail,
    name: "",
    organizer: "",
    estimatedAttendees: undefined,
    cateringOptions: [],
    cateringComments: "",
    eventSupportOptions: [],
    membershipStatus: "",
    additionalComments: "",
    isPublicEvent: true,
    lumaEventUrl: "",
    calendarUrl: "",
    publicUri: "",
    roomNotes: "",
    bookingId: "",
    language: "en",
    price: undefined,
    currency: "EUR",
    quoteConfirmed: false,
    ...overrides,
  };
};

export const transformBookingToFormData = (booking: Booking): FormData => {
  return {
    title: booking.title,
    description: booking.description || "",
    roomId: booking.room.id,
    setupOption: booking.selectedSetup || "",
    requiresAdditionalSpace: booking.requiresAdditionalSpace || false,
    startDate: new Date(booking.startTime),
    endDate: new Date(booking.endTime),
    email: booking.createdBy.email,
    name: booking.createdBy.name || "",
    organizer: booking.organizer || "",
    estimatedAttendees: booking.estimatedAttendees,
    cateringOptions: booking.cateringOptions || [],
    cateringComments: booking.cateringComments || "",
    eventSupportOptions: booking.eventSupportOptions || [],
    membershipStatus: booking.membershipStatus || "",
    additionalComments: booking.additionalComments || "",
    isPublicEvent: booking.isPublicEvent ?? true,
    lumaEventUrl: booking.lumaEventUrl || "",
    calendarUrl: booking.calendarUrl || "",
    publicUri: booking.publicUri || "",
    roomNotes: "",
    bookingId: booking.id,
    language: booking.language || "en",
    price: booking.price,
    currency: booking.currency || "EUR",
    quoteConfirmed: false, // Default to false for existing bookings being edited
  };
};
