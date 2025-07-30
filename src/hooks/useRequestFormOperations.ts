import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RequestFormData } from "@/components/request/RequestFormSchema";
import { useTranslation } from "react-i18next";
import { useRequest } from "@/context/RequestProvider";

export const useRequestFormOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { createRequest, updateRequest } = useRequest();

  const handleCreateRequest = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      // Transform the form data to match the Request type
      const requestData = {
        ...data,
        expectedCompletionDate: data.expectedCompletionDate?.toISOString(),
      };
      
      // Create the request using the context
      await createRequest(requestData);
      
      toast({
        title: t('requests.messages.requestSubmitted.title'),
        description: t('requests.messages.requestSubmitted.description'),
      });
      
      // Navigate back to home page
      navigate("/");
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: t('requests.messages.requestError.title'),
        description: t('requests.messages.requestError.description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequest = async (requestId: string, data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      // Transform the form data to match the Request type
      const requestData = {
        ...data,
        expectedCompletionDate: data.expectedCompletionDate?.toISOString(),
      };
      
      // Update the request using the context
      await updateRequest(requestId, requestData);
      
      toast({
        title: t('requests.messages.requestUpdated.title'),
        description: t('requests.messages.requestUpdated.description'),
      });
      
      // Navigate back to request detail page
      navigate(`/requests/${requestId}`);
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: t('requests.messages.requestUpdateError.title'),
        description: t('requests.messages.requestUpdateError.description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleCreateRequest,
    handleUpdateRequest,
  };
}; 