import * as z from "zod";

export const requestFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  requestType: z.string({ required_error: "Please select a request type" }),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Please select a priority level",
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Please enter your name" }),
  phone: z.string().optional(),
  organization: z.string().optional(),
  expectedCompletionDate: z.date().optional(),
  additionalDetails: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  // Internal fields
  requestId: z.string().optional(),
  language: z.string().optional(),
  status: z.enum(["draft", "pending", "in_progress", "completed", "cancelled"]).default("draft"),
});

export type RequestFormData = z.infer<typeof requestFormSchema>; 