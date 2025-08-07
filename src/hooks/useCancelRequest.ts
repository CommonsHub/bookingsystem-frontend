import { toast } from "@/components/ui/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { Request, User } from "@/types";

export const useCancelRequest = (
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
) => {
  const cancelRequest = async (id: string, user: User | null): Promise<void> => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancelled_by_email: user?.email || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Error cancelling request:", error);
        toast.error("Failed to cancel request");
        throw error;
      }

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: "cancelled" as const,
                cancelledAt: new Date().toISOString(),
                cancelledBy: user || undefined,
              }
            : request
        )
      );

      toast.success("Request cancelled successfully");
    } catch (error) {
      console.error("Error in cancelRequest:", error);
      toast.error("Failed to cancel request");
      throw error;
    }
  };

  return { cancelRequest };
}; 