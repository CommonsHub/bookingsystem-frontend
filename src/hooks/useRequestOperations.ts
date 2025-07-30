import { Request } from "@/types";
import { useCreateRequest } from "./useCreateRequest";
import { useUpdateRequest } from "./useUpdateRequest";
import { useCancelRequest } from "./useCancelRequest";
import { useCompleteRequest } from "./useCompleteRequest";
import { useFetchRequests } from "./useFetchRequests";

export const useRequestOperations = () => {
  const { requests, setRequests, loading, refetch } = useFetchRequests();
  const { createRequest } = useCreateRequest(setRequests);
  const { updateRequest } = useUpdateRequest(setRequests);
  const { cancelRequest } = useCancelRequest(setRequests);
  const { completeRequest } = useCompleteRequest(setRequests);

  const getRequestById = (id: string): Request | undefined => {
    return requests.find(request => request.id === id);
  };

  return {
    requests,
    setRequests,
    loading,
    refetch,
    getRequestById,
    createRequest,
    updateRequest,
    cancelRequest,
    completeRequest,
  };
}; 