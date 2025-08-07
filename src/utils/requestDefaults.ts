import { RequestFormData } from "@/components/request/RequestFormSchema";

export const createDefaultRequestValues = (
  email: string = "",
  overrides: Partial<RequestFormData> = {}
): RequestFormData => {
  return {
    title: "",
    description: "",
    requestType: "",
    priority: "medium",
    email,
    name: "",
    phone: "",
    organization: "",
    expectedCompletionDate: undefined,
    additionalDetails: "",
    attachments: [],
    requestId: undefined,
    language: "en",
    status: "draft",
    ...overrides,
  };
}; 