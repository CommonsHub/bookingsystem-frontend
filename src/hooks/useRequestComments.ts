import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequestComment } from "@/types";
import { toast } from "@/components/ui/toast-utils";

export const useRequestComments = (requestId: string) => {
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("request_comments")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching request comments:", error);
        toast.error("Failed to fetch comments");
        return;
      }

      if (data) {
        // Transform the database data to match our RequestComment type
        const transformedComments: RequestComment[] = data.map((row) => ({
          id: row.id,
          requestId: row.request_id,
          content: row.content,
          createdAt: row.created_at,
          createdBy: {
            id: row.id,
            email: row.created_by_email,
            name: row.created_by_name || undefined,
          },
          status: row.status as "draft" | "published",
        }));

        setComments(transformedComments);
      }
    } catch (error) {
      console.error("Error in fetchComments:", error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [requestId]);

  return { comments, setComments, loading, refetch: fetchComments };
}; 