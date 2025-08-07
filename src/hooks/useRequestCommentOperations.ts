import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Request, RequestComment } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { callEdgeFunction, createRequestCommentPayload } from "@/utils/edgeFunctionUtils";

export const useRequestCommentOperations = (
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
) => {
  const addCommentToRequest = async (
    requestId: string,
    content: string,
    email: string,
    name: string = "",
  ): Promise<string> => {
    try {
      // Insert comment into the database as published instead of draft
      const { data, error } = await supabase
        .from("request_comments")
        .insert({
          request_id: requestId,
          content,
          created_by_email: email,
          created_by_name: name,
          status: "published", // Changed from "draft" to "published"
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating request comment:", error);
        toast.error("Failed to create comment");
        throw error;
      }

      // Call edge function directly after successful database insert
      const commentRecord = {
        id: data.id,
        request_id: requestId,
        content,
        created_at: data.created_at,
        created_by_email: email,
        created_by_name: name,
        status: "published",
      };
      
      const edgeFunctionResult = await callEdgeFunction(
        createRequestCommentPayload(commentRecord, 'new_request_comment')
      );

      if (!edgeFunctionResult.success) {
        console.warn("Edge function call failed:", edgeFunctionResult.error);
        // Don't throw error here as the comment was created successfully
        // Just log the warning
      }

      const newComment: RequestComment = {
        id: data.id,
        requestId,
        content,
        createdAt: data.created_at,
        createdBy: {
          id: uuidv4(), // Generate a temporary ID for the user
          email,
          name: name || "",
        },
        status: "published", // Changed from "draft" to "published"
      };

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, comments: [...request.comments, newComment] }
            : request,
        ),
      );

      return data.id;
    } catch (error) {
      console.error("Error in addCommentToRequest:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  return { addCommentToRequest };
}; 