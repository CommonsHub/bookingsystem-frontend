import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Request, User } from "@/types";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { FileText, Calendar, User as UserIcon, Building2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RequestCardViewProps {
  requests: Request[];
  canUserCancelRequest: (request: Request, user: User | null) => boolean;
  canUserCompleteRequest: (request: Request, user: User | null) => boolean;
  user: User | null;
  onCancelRequest: (id: string) => void;
  onCompleteRequest: (id: string) => void;
}

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

export const RequestCardView = ({
  requests,
  canUserCancelRequest,
  canUserCompleteRequest,
  user,
  onCancelRequest,
  onCompleteRequest,
}: RequestCardViewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
          {t('requests.none')}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('requests.noneDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <Card 
          key={request.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/requests/${request.id}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getRequestTypeIcon(request.requestType)}
                <CardTitle className="text-lg">{request.title}</CardTitle>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>
            <CardDescription className="line-clamp-2">
              {request.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>{request.name}</span>
                {request.organization && (
                  <>
                    <span>•</span>
                    <span>{request.organization}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(request.createdAt), "MMM d, yyyy")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(request.priority)}>
                  {t(`requests.priority.${request.priority}`)}
                </Badge>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {canUserCompleteRequest(request, user) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCompleteRequest(request.id)}
                    >
                      {t('requests.actions.complete')}
                    </Button>
                  )}
                  {canUserCancelRequest(request, user) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCancelRequest(request.id)}
                    >
                      {t('requests.actions.cancel')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 