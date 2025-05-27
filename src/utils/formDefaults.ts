
import { FormData } from "@/components/booking/BookingFormSchema";

export const createDefaultFormValues = (email: string = "", overrides: Partial<FormData> = {}): FormData => {
  return {
    title: "",
    description: "",
    roomId: "",
    setupOption: "",
    requiresAdditionalSpace: false,
    startDate: undefined,
    endDate: undefined,
    email,
    name: "",
    cateringOptions: [],
    cateringComments: "",
    eventSupportOptions: [],
    membershipStatus: "",
    additionalComments: "",
    isPublicEvent: false,
    lumaEventUrl: "",
    calendarUrl: "",
    publicUri: "",
    roomNotes: "",
    ...overrides,
  };
};

export const transformBookingToFormData = (booking: any): FormData => {
  return {
    title: booking.title,
    description: booking.description,
    roomId: booking.room.id,
    setupOption: booking.selectedSetup || "",
    requiresAdditionalSpace: booking.requiresAdditionalSpace || false,
    startDate: booking.startTime ? new Date(booking.startTime) : undefined,
    endDate: booking.endTime ? new Date(booking.endTime) : undefined,
    email: booking.createdBy.email,
    name: booking.createdBy.name,
    cateringOptions: [],
    cateringComments: "",
    eventSupportOptions: [],
    membershipStatus: "",
    additionalComments: booking.additionalComments || "",
    isPublicEvent: booking.isPublicEvent || false,
    organizer: booking.organizer,
    estimatedAttendees: booking.estimatedAttendees,
    lumaEventUrl: booking.lumaEventUrl || "",
    calendarUrl: booking.calendarUrl || "",
    publicUri: booking.publicUri || "",
    roomNotes: booking.roomNotes || "",
  };
};
