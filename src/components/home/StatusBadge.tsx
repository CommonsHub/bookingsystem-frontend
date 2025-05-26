
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();
  
  switch (status) {
    case "draft":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-muted-foreground"
        >
          <Clock className="h-3 w-3" />
          <span>{t('status.draft')}</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{t('status.pending')}</span>
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          <span>{t('status.approved')}</span>
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="success" className="flex items-center gap-1 bg-green-600">
          <CreditCard className="h-3 w-3" />
          <span>{t('status.paid')}</span>
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          <span>{t('status.rejected')}</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          <span>{t('status.cancelled')}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
};
