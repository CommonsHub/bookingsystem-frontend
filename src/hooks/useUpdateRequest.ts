import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Request } from "@/types";

export const useUpdateRequest = (
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
) => {
  const updateRequest = async (
    id: string,
    requestData: Partial<Request>,
  ): Promise<void> => {
    try {
      const updateData: Database["public"]["Tables"]["requests"]["Update"] = {};

      // Map the request data to database fields
      if (requestData.title !== undefined) updateData.title = requestData.title;
      if (requestData.description !== undefined) updateData.description = requestData.description;
      if (requestData.requestType !== undefined) updateData.request_type = requestData.requestType;
      if (requestData.priority !== undefined) updateData.priority = requestData.priority;
      if (requestData.status !== undefined) updateData.status = requestData.status;
      if (requestData.email !== undefined) updateData.email = requestData.email;
      if (requestData.name !== undefined) updateData.name = requestData.name;
      if (requestData.phone !== undefined) updateData.phone = requestData.phone;
      if (requestData.organization !== undefined) updateData.organization = requestData.organization;
      if (requestData.expectedCompletionDate !== undefined) updateData.expected_completion_date = requestData.expectedCompletionDate;
      if (requestData.additionalDetails !== undefined) updateData.additional_details = requestData.additionalDetails;
      if (requestData.attachments !== undefined) updateData.attachments = requestData.attachments;
      if (requestData.language !== undefined) updateData.language = requestData.language;

      const { error } = await supabase
        .from("requests")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Error updating request:", error);
        toast.error("Failed to update request");
        throw error;
      }

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, ...requestData } : request
        )
      );

      toast.success("Request updated successfully");
    } catch (error) {
      console.error("Error in updateRequest:", error);
      toast.error("Failed to update request");
      throw error;
    }
  };

  return { updateRequest };
}; 