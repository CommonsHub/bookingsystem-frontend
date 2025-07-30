import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest } from "@/context/RequestProvider";
import { toast } from "@/components/ui/toast-utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertTriangle, Building2, FileText, User as UserIcon, Calendar, Mail, Phone, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/home/RequestStatusBadge";
import { RequestCommentSection } from "@/components/request/RequestCommentSection";
import { RequestActions } from "@/components/request/RequestActions";
import { useRequestComments } from "@/hooks/useRequestComments";

const RequestDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getRequestById,
    cancelRequest,
    completeRequest,
    addCommentToRequest,
    user,
    canUserCancelRequest,
    canUserCompleteRequest,
    canUserMarkAsCompleted,
    loading
  } = useRequest();
  const [submitting, setSubmitting] = useState(false);
  const { comments, refetch: refetchComments } = useRequestComments(id);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
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
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
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

  const canCancelRequest = canUserCancelRequest(request, user);
  const canCompleteRequest = canUserCompleteRequest(request, user);
  const canMarkAsCompleted = canUserMarkAsCompleted(request, user);
  const canEditRequest = request.status !== "cancelled" && request.status !== "completed";

  const handleCancelRequest = () => {
    setSubmitting(true);
    try {
      cancelRequest(id);
      toast.success(t('requests.messages.requestCancelled'));
      navigate("/");
    } catch (error) {
      toast.error(t('requests.messages.cancelError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteRequest = () => {
    setSubmitting(true);
    try {
      completeRequest(id);
      toast.success(t('requests.messages.requestCompleted'));
      navigate("/");
    } catch (error) {
      toast.error(t('requests.messages.completeError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsCompleted = () => {
    setSubmitting(true);
    try {
      completeRequest(id);
      toast.success(t('requests.messages.requestMarkedAsCompleted'));
      navigate("/");
    } catch (error) {
      toast.error(t('requests.messages.markAsCompletedError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRequest = () => {
    navigate(`/requests/${id}/edit`);
  };

  const handleSubmitComment = async (commentData: {
    content: string;
    name: string;
    email: string;
  }) => {
    if (!commentData.content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      await addCommentToRequest(id, commentData.content, commentData.email, commentData.name);
      toast.success("Comment added successfully!");
      // Refetch comments to show the new comment
      refetchComments();
    } catch (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getRequestTypeIcon = (requestType: string) => {
    switch (requestType) {
      case "support":
        return <AlertTriangle className="h-4 w-4" />;
      case "partnership":
        return <Building2 className="h-4 w-4" />;
      case "feedback":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <p className="text-muted-foreground">
              {t('requests.detail.createdOn')} {format(new Date(request.createdAt), "PPP")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('requests.detail.information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">{t('requests.detail.description')}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {/* Request Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{t('requests.detail.type')}</h3>
                  <div className="flex items-center gap-2">
                    {getRequestTypeIcon(request.requestType)}
                    <span>{t(`requests.types.${request.requestType}`)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('requests.detail.priority')}</h3>
                  <Badge className={getPriorityColor(request.priority)}>
                    {t(`requests.priority.${request.priority}`)}
                  </Badge>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-medium mb-2">{t('requests.detail.status')}</h3>
                <RequestStatusBadge status={request.status} />
              </div>

              {/* Additional Details */}
              {request.additionalDetails && (
                <div>
                  <h3 className="font-medium mb-2">{t('requests.detail.additionalDetails')}</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {request.additionalDetails}
                  </p>
                </div>
              )}

              {/* Expected Completion Date */}
              {request.expectedCompletionDate && (
                <div>
                  <h3 className="font-medium mb-2">{t('requests.detail.expectedCompletion')}</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(request.expectedCompletionDate), "PPP")}</span>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {request.attachments && request.attachments.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">{t('requests.detail.attachments')}</h3>
                  <div className="space-y-2">
                    {request.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <RequestCommentSection
            comments={comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={submitting}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <RequestActions
            request={request}
            canEditRequest={canEditRequest}
            canCompleteRequest={canCompleteRequest}
            canCancelRequest={canCancelRequest}
            canMarkAsCompleted={canMarkAsCompleted}
            onEditRequest={handleEditRequest}
            onCompleteRequest={handleCompleteRequest}
            onCancelRequest={handleCancelRequest}
            onMarkAsCompleted={handleMarkAsCompleted}
            submitting={submitting}
          />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('requests.detail.contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{request.name}</div>
                  {request.organization && (
                    <div className="text-sm text-muted-foreground">{request.organization}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{request.email}</span>
              </div>
              
              {request.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('requests.detail.timeline')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">{t('requests.detail.created')}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(request.createdAt), "PPP 'at' p")}
                  </div>
                </div>
              </div>
              
              {request.completedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">{t('requests.detail.completed')}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.completedAt), "PPP 'at' p")}
                    </div>
                  </div>
                </div>
              )}
              
              {request.cancelledAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">{t('requests.detail.cancelled')}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.cancelledAt), "PPP 'at' p")}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail; 