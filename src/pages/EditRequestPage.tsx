import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest } from "@/context/RequestProvider";
import { RequestForm } from "@/components/request/RequestForm";
import { RequestFormData } from "@/components/request/RequestFormSchema";
import { useRequestFormOperations } from "@/hooks/useRequestFormOperations";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createDefaultRequestValues } from "@/utils/requestDefaults";

const EditRequestPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, loading } = useRequest();
  const { handleUpdateRequest } = useRequestFormOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!id) return <div>{t('messages.requestIdMissing')}</div>;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const request = getRequestById(id);
  if (!request) {
    return (
      <div className="text-center py-8">
        <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
          {t('requests.notFound')}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('requests.notFoundDescription')}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="mt-4"
          variant="outline"
        >
          {t('common.backToHome')}
        </Button>
      </div>
    );
  }

  // Check if user can edit this request
  const canEditRequest = request.status !== "cancelled" && request.status !== "completed";
  if (!canEditRequest) {
    return (
      <div className="text-center py-8">
        <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
          {t('requests.cannotEdit')}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('requests.cannotEditDescription')}
        </p>
        <Button 
          onClick={() => navigate(`/requests/${id}`)} 
          className="mt-4"
          variant="outline"
        >
          {t('common.back')}
        </Button>
      </div>
    );
  }

  // Convert request to form data
  const defaultValues: RequestFormData = {
    title: request.title,
    description: request.description,
    requestType: request.requestType,
    priority: request.priority,
    email: request.email,
    name: request.name,
    phone: request.phone || "",
    organization: request.organization || "",
    expectedCompletionDate: request.expectedCompletionDate ? new Date(request.expectedCompletionDate) : undefined,
    additionalDetails: request.additionalDetails || "",
    attachments: request.attachments || [],
    language: request.language || "en",
    status: request.status,
  };

  const handleSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      await handleUpdateRequest(id, data);
      navigate(`/requests/${id}`);
    } catch (error) {
      console.error("Error updating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/requests/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/requests/${id}`)}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <p className="text-muted-foreground">
              {t('requests.edit.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <RequestForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditRequestPage; 