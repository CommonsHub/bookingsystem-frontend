import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Request, User } from "@/types";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { FileText, Calendar, User as UserIcon, Building2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RequestTableViewProps {
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

export const RequestTableView = ({
  requests,
  canUserCancelRequest,
  canUserCompleteRequest,
  user,
  onCancelRequest,
  onCompleteRequest,
}: RequestTableViewProps) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('requests.table.title')}</TableHead>
            <TableHead>{t('requests.table.type')}</TableHead>
            <TableHead>{t('requests.table.priority')}</TableHead>
            <TableHead>{t('requests.table.status')}</TableHead>
            <TableHead>{t('requests.table.createdBy')}</TableHead>
            <TableHead>{t('requests.table.createdAt')}</TableHead>
            <TableHead className="text-right">{t('requests.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/requests/${request.id}`)}
            >
              <TableCell>
                <div>
                  <div className="font-medium">{request.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {request.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRequestTypeIcon(request.requestType)}
                  <span className="text-sm">
                    {t(`requests.types.${request.requestType}`)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(request.priority)}>
                  {t(`requests.priority.${request.priority}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <RequestStatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{request.name}</div>
                    {request.organization && (
                      <div className="text-xs text-muted-foreground">
                        {request.organization}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 