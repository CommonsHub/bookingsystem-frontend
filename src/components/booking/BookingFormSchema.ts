
import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  roomId: z.string({ required_error: "Please select a room" }),
  setupOption: z.string().optional(),
  requiresAdditionalSpace: z.boolean().default(false),
  startDate: z.date({ required_error: "Please enter a valid start time" }),
  endDate: z.date({ required_error: "Please enter a valid end time" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Please enter your name" }),
  // New fields
  organizer: z.string().optional(),
  estimatedAttendees: z.coerce.number().optional(),
  cateringOptions: z.array(z.string()).optional(),
  cateringComments: z.string().optional(),
  eventSupportOptions: z.array(z.string()).optional(),
  membershipStatus: z.string().optional(),
  additionalComments: z.string().optional(),
  // Public event field - now defaults to true
  isPublicEvent: z.boolean().default(true),
  // New URL fields
  lumaEventUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  calendarUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  publicUri: z.string().optional(),
  // Additional room notes field
  roomNotes: z.string().optional(),
  // Add the missing fields
  bookingId: z.string().optional(),
  language: z.string().optional(),
  // Add price and currency fields
  price: z.number().min(0, { message: "Price must be positive" }).optional(),
  currency: z.string().default("EUR"),
  // Add quote confirmation field
  quoteConfirmed: z.boolean().refine(val => val === true, {
    message: "Please confirm the quote before submitting your booking request"
  }),
});

export type FormData = z.infer<typeof formSchema>;
