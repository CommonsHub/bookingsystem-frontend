
import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  roomId: z.string({ required_error: "Please select a room" }),
  setupOption: z.string().optional(),
  requiresAdditionalSpace: z.boolean().default(false),
  date: z.date({ required_error: "Please enter a valid start date and time" }),
  startTime: z.string({ required_error: "Please enter a valid start time" }),
  endTime: z
    .string({ required_error: "Please enter a valid end time" })
    .refine((time) => time !== "", { message: "Please enter a valid end time" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Please enter your name" }),
  // New fields
  cateringOptions: z.array(z.string()).optional(),
  cateringComments: z.string().optional(),
  eventSupportOptions: z.array(z.string()).optional(),
  membershipStatus: z.string().optional(),
  additionalComments: z.string().optional(),
  // Add the public event field
  isPublicEvent: z.boolean().default(false),
});

export type FormData = z.infer<typeof formSchema>;
