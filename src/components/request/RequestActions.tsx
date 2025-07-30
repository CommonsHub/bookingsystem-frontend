import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Edit, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Request } from "@/types";

interface RequestActionsProps {
  request: Request;
  canEditRequest: boolean;
  canCompleteRequest: boolean;
  canCancelRequest: boolean;
  canMarkAsCompleted: boolean;
  onEditRequest: () => void;
  onCompleteRequest: () => void;
  onCancelRequest: () => void;
  onMarkAsCompleted: () => void;
  submitting: boolean;
}

export const RequestActions = ({
  request,
  canEditRequest,
  canCompleteRequest,
  canCancelRequest,
  canMarkAsCompleted,
  onEditRequest,
  onCompleteRequest,
  onCancelRequest,
  onMarkAsCompleted,
  submitting,
}: RequestActionsProps) => {
  const { t } = useTranslation();

  // Don't show the card if no actions are available
  if (!canCompleteRequest && !canCancelRequest && !canEditRequest && !canMarkAsCompleted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('requests.detail.actions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Mark as Completed Button (Admin Only) */}
        {canMarkAsCompleted ? (
          <Button
            onClick={onMarkAsCompleted}
            disabled={submitting}
            className="w-full gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t('requests.actions.markAsCompleted')}
          </Button>
        ) : (
          <Button
            disabled
            className="w-full gap-2"
            title={
              request.status === "completed"
                ? "This request is already completed"
                : "You need admin permissions to mark requests as completed"
            }
          >
            <CheckCircle2 className="h-4 w-4" />
            {t('requests.actions.markAsCompleted')}
          </Button>
        )}

        {canCompleteRequest && (
          <Button
            onClick={onCompleteRequest}
            disabled={submitting}
            className="w-full gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t('requests.actions.complete')}
          </Button>
        )}
        
        {canCancelRequest && (
          <Button
            variant="destructive"
            onClick={onCancelRequest}
            disabled={submitting}
            className="w-full gap-2"
          >
            <X className="h-4 w-4" />
            {t('requests.actions.cancel')}
          </Button>
        )}

        {(canEditRequest && (canCompleteRequest || canCancelRequest || canMarkAsCompleted)) && (
          <div className="border-t pt-3" />
        )}

        {canEditRequest && (
          <Button
            onClick={onEditRequest}
            variant="outline"
            disabled={submitting}
            className="w-full gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 