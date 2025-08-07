import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Request, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { callEdgeFunction, createRequestPayload } from "@/utils/edgeFunctionUtils";

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
      // Prepare the request data to send to edge function
      const requestRecord = {
        id,
        title: requestData.title,
        description: requestData.description,
        request_type: requestData.requestType,
        priority: requestData.priority,
        status: "pending",
        created_by_email: requestData.email,
        created_by_name: requestData.name,
        email: requestData.email,
        name: requestData.name,
        phone: requestData.phone,
        organization: requestData.organization,
        expected_completion_date: requestData.expectedCompletionDate,
        additional_details: requestData.additionalDetails,
        attachments: requestData.attachments,
        language: i18n.language,
      };
      
      // Call edge function to handle database insertion and notifications
      const edgeFunctionResult = await callEdgeFunction(
        createRequestPayload(requestRecord, 'new_request')
      );

      if (!edgeFunctionResult.success) {
        console.error("Edge function call failed:", edgeFunctionResult.error);
        toast.error("Failed to create request");
        throw new Error(edgeFunctionResult.error || "Failed to create request");
      }

      // Update local state with the new request
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

// New hook for creating requests in an unauthenticated way (for embeddable use)
export const useCreateUnauthenticatedRequest = () => {
  const { i18n } = useTranslation();

  const createUnauthenticatedRequest = async (
    requestData: Omit<Request, "id" | "createdAt" | "status" | "createdBy" | "comments">,
  ): Promise<string> => {
    // generate uuid v4
    const id = uuidv4();

    try {
      // Prepare the request data to send to edge function
      const requestRecord = {
        id,
        title: requestData.title,
        description: requestData.description,
        request_type: requestData.requestType,
        priority: requestData.priority,
        status: "pending",
        created_by_email: requestData.email,
        created_by_name: requestData.name,
        email: requestData.email,
        name: requestData.name,
        phone: requestData.phone,
        organization: requestData.organization,
        expected_completion_date: requestData.expectedCompletionDate,
        additional_details: requestData.additionalDetails,
        attachments: requestData.attachments,
        language: i18n.language,
      };
      
      // Call edge function to handle database insertion and notifications
      const edgeFunctionResult = await callEdgeFunction(
        createRequestPayload(requestRecord, 'new_request')
      );

      if (!edgeFunctionResult.success) {
        console.error("Edge function call failed:", edgeFunctionResult.error);
        throw new Error(edgeFunctionResult.error || "Failed to create request");
      }

      return id;
    } catch (error) {
      console.error("Error in createUnauthenticatedRequest:", error);
      throw error;
    }
  };

  return { createUnauthenticatedRequest };
}; 