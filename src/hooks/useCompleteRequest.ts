import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Request, User } from "@/types";

export const useCompleteRequest = (
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
) => {
  const completeRequest = async (id: string, user: User | null): Promise<void> => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          completed_by_email: user?.email || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Error completing request:", error);
        toast.error("Failed to complete request");
        throw error;
      }

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: "completed" as const,
                completedAt: new Date().toISOString(),
                completedBy: user || undefined,
              }
            : request
        )
      );

      toast.success("Request completed successfully");
    } catch (error) {
      console.error("Error in completeRequest:", error);
      toast.error("Failed to complete request");
      throw error;
    }
  };

  return { completeRequest };
}; 