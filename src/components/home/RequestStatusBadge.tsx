import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/types";
import { useTranslation } from "react-i18next";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: RequestStatus) => {
    switch (status) {
      case "draft":
        return {
          variant: "secondary" as const,
          label: t('requests.status.draft'),
        };
      case "pending":
        return {
          variant: "default" as const,
          label: t('requests.status.pending'),
        };
      case "in_progress":
        return {
          variant: "default" as const,
          label: t('requests.status.inProgress'),
        };
      case "completed":
        return {
          variant: "default" as const,
          label: t('requests.status.completed'),
        };
      case "cancelled":
        return {
          variant: "destructive" as const,
          label: t('requests.status.cancelled'),
        };
      default:
        return {
          variant: "secondary" as const,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}; 