
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "draft":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-muted-foreground"
        >
          <Clock className="h-3 w-3" />
          <span>Draft</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          <span>Approved</span>
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          <span>Rejected</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          <span>Cancelled</span>
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
