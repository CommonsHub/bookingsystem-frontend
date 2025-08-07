import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { RequestFormData } from "@/components/request/RequestFormSchema";
import { RequestForm } from "@/components/request/RequestForm";
import { useCreateUnauthenticatedRequest } from "@/hooks/useCreateRequest";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { createDefaultRequestValues } from "@/utils/requestDefaults";

const EmbeddableRequestPage = () => {
  const { createUnauthenticatedRequest } = useCreateUnauthenticatedRequest();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDefaultValues, setFormDefaultValues] = useState<RequestFormData | null>(null);

  // Get URL parameters for customization
  const showHeader = searchParams.get('showHeader') !== 'false';
  const redirectUrl = searchParams.get('redirectUrl') || '/';
  const requestType = searchParams.get('requestType') || 'general';
  const priority = searchParams.get('priority') || 'medium';
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';

  // Initialize default values
  useEffect(() => {
    setFormDefaultValues(
      createDefaultRequestValues("", {
        name: "",
        requestType: requestType || undefined,
        priority: (priority as "low" | "medium" | "high" | "urgent") || undefined,
        title: title || undefined,
        description: description || undefined,
      })
    );
  }, [requestType, priority, title, description]);



  const handleCreateRequest = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      // Submit the request directly using the unauthenticated hook
      await submitRequest(data);
    } catch (error) {
      console.error("Error creating request:", error);
      
      // Show error toast
      toast({
        title: t('requests.messages.requestError.title'),
        description: error instanceof Error ? error.message : t('requests.messages.requestError.description'),
        variant: "destructive",
      });
      
      // Send error message to parent window if embedded
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'REQUEST_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }, '*');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRequest = useCallback(async (data: RequestFormData) => {
    // Transform the form data to match the Request type
    const requestData = {
      title: data.title,
      description: data.description,
      requestType: data.requestType,
      priority: data.priority,
      email: data.email,
      name: data.name,
      phone: data.phone,
      organization: data.organization,
      expectedCompletionDate: data.expectedCompletionDate?.toISOString(),
      additionalDetails: data.additionalDetails,
      attachments: data.attachments,
    };
    
    // Create the request using the unauthenticated hook
    const requestId = await createUnauthenticatedRequest(requestData);
    
    // Show success toast
    toast({
      title: t('requests.messages.requestSubmitted.title'),
      description: t('requests.messages.requestSubmitted.description'),
    });
    
    // Send message to parent window if embedded
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'REQUEST_CREATED',
        requestId,
        data: requestData
      }, '*');
    }
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
  }, [createUnauthenticatedRequest, toast, t, redirectUrl]);

  const handleCancel = () => {
    // Send cancel message to parent window if embedded
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'REQUEST_CANCELLED'
      }, '*');
    }
    
    // Redirect to cancel URL or default
    const cancelUrl = searchParams.get('cancelUrl') || redirectUrl;
    window.location.href = cancelUrl;
  };

  // Show loading while initializing
  if (!formDefaultValues) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commons Hub request</h1>
          <p className="text-gray-600">Get in touch with your request here</p>
        </div>
        
        <RequestForm
          defaultValues={formDefaultValues}
          onSubmit={handleCreateRequest}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          isEmbed={true}
        />
      </div>
    </div>
  );
};

export default EmbeddableRequestPage; 