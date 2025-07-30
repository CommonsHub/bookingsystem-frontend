import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Request, RequestComment } from "@/types";
import { toast } from "@/components/ui/toast-utils";

export const useFetchRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch requests");
        return;
      }

      if (data) {
        // Transform the database data to match our Request type
        const transformedRequests: Request[] = data.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          requestType: row.request_type,
          priority: row.priority as "low" | "medium" | "high" | "urgent",
          status: row.status as "draft" | "pending" | "in_progress" | "completed" | "cancelled",
          createdAt: row.created_at,
          createdBy: {
            id: row.id,
            email: row.created_by_email,
            name: row.created_by_name || undefined,
          },
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          organization: row.organization || undefined,
          expectedCompletionDate: row.expected_completion_date || undefined,
          additionalDetails: row.additional_details || undefined,
          attachments: row.attachments || undefined,
          language: row.language || undefined,
          completedAt: row.completed_at || undefined,
          completedBy: row.completed_by_email ? {
            id: row.id,
            email: row.completed_by_email,
            name: undefined,
          } : undefined,
          cancelledAt: row.cancelled_at || undefined,
          cancelledBy: row.cancelled_by_email ? {
            id: row.id,
            email: row.cancelled_by_email,
            name: undefined,
          } : undefined,
          comments: [], // Initialize with empty comments array
        }));

        setRequests(transformedRequests);
      }
    } catch (error) {
      console.error("Error in fetchRequests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, setRequests, loading, refetch: fetchRequests };
}; 