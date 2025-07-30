import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { RequestFormData } from "@/components/request/RequestFormSchema";
import { RequestForm } from "@/components/request/RequestForm";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestProvider";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { createDefaultRequestValues } from "@/utils/requestDefaults";
import { supabase } from "@/integrations/supabase/client";

const EmbeddableRequestPage = () => {
  const { user, loading } = useAuth();
  const { createRequest } = useRequest();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDefaultValues, setFormDefaultValues] = useState<RequestFormData | null>(null);
  const [showOtpSent, setShowOtpSent] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState<RequestFormData | null>(null);

  // Get URL parameters for customization
  const showHeader = searchParams.get('showHeader') !== 'false';
  const redirectUrl = searchParams.get('redirectUrl') || '/';
  const requestType = searchParams.get('requestType') || '';
  const priority = searchParams.get('priority') || '';
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';

  // Initialize default values
  useEffect(() => {
    const email = user?.email || "";
    const name = user?.name || "";
    
    setFormDefaultValues(
      createDefaultRequestValues(email, {
        name,
        requestType: requestType || undefined,
        priority: (priority as "low" | "medium" | "high" | "urgent") || undefined,
        title: title || undefined,
        description: description || undefined,
      })
    );
  }, [user, requestType, priority, title, description]);

  // Handle pending request submission after authentication
  useEffect(() => {
    if (user && pendingRequestData) {
      // User has been authenticated, submit the pending request
      submitRequest(pendingRequestData);
      setPendingRequestData(null);
    }
  }, [user, pendingRequestData]);

  const handleCreateRequest = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      // If user is not authenticated, create user via OTP
      if (!user) {
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            data: {
              full_name: data.name,
            },
            emailRedirectTo: window.location.origin + '/embed/request',
          },
        });
        
        if (error) {
          throw error;
        }
        
        // Store the request data to submit after authentication
        setPendingRequestData(data);
        setShowOtpSent(true);
        
        toast({
          title: "Verification email sent",
          description: "Please check your email and click the verification link to complete your request submission.",
        });
        
        return;
      }
      
      // User is authenticated, proceed with request creation
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
      ...data,
      expectedCompletionDate: data.expectedCompletionDate?.toISOString(),
    };
    
    // Create the request using the context
    const requestId = await createRequest(requestData);
    
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
  }, [createRequest, toast, t, redirectUrl]);

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
  if (loading || !formDefaultValues) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show OTP sent message
  if (showOtpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Check Your Email</h3>
            <p className="text-blue-700 mb-4">
              We've sent a verification link to your email address. Please check your inbox and click the link to complete your request submission.
            </p>
            <p className="text-sm text-blue-600">
              You can close this window and return after verifying your email.
            </p>
          </div>
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