import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Request, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

export const useCreateRequest = (
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
) => {
  const { i18n } = useTranslation();

  const createRequest = async (
    requestData: Omit<Request, "id" | "createdAt" | "status" | "createdBy">,
  ): Promise<string> => {
    // generate uuid v4
    const id = uuidv4();

    try {
      const row: Database["public"]["Tables"]["requests"]["Insert"] = {
        id,
        title: requestData.title,
        description: requestData.description,
        request_type: requestData.requestType,
        priority: requestData.priority,
        status: "pending",
        created_by_email: requestData.email, // Use the email from the form
        created_by_name: requestData.name, // Use the name from the form
        email: requestData.email,
        name: requestData.name,
        phone: requestData.phone,
        organization: requestData.organization,
        expected_completion_date: requestData.expectedCompletionDate,
        additional_details: requestData.additionalDetails,
        attachments: requestData.attachments,
        language: i18n.language, // Add current language
      };

      const { error } = await supabase.from("requests").insert(row);

      if (error) {
        console.error("Error creating request:", error);
        toast.error("Failed to create request");
        throw error;
      }

      const { data: newRequests } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (newRequests) {
        setRequests((prevRequests) => {
          const transformedNewRequest: Request = {
            ...requestData,
            id,
            createdAt: new Date().toISOString(),
            status: "pending" as const,
            createdBy: {
              id: id,
              email: requestData.email,
              name: requestData.name,
            },
          };
          return [transformedNewRequest, ...prevRequests];
        });
      }
      return id;
    } catch (error) {
      console.error("Error in createRequest:", error);
      toast.error("Failed to create request");
      throw error;
    }
  };

  return { createRequest };
}; 