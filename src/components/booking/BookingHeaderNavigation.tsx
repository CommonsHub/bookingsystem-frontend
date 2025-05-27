
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTime } from "@/lib/utils";
import { Booking } from "@/types";
import { CheckCircle2, ChevronLeft, MailCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BookingHeaderNavigationProps {
    booking: Booking;
    actionButtons?: React.ReactNode;
}

export const BookingHeaderNavigation = ({ booking, actionButtons }: BookingHeaderNavigationProps) => {
    const { t } = useTranslation();

    const statusColor = (status: string) => {
        switch (status) {
            case "draft":
                return "bg-muted text-muted-foreground";
            case "pending":
                return "bg-yellow-500 text-white";
            case "approved":
                return "bg-green-500 text-white";
            case "rejected":
                return "bg-red-500 text-white";
            case "cancelled":
                return "bg-gray-500 text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    return <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link to="/">
                    <ChevronLeft className="h-4 w-4" />
                    {t('nav.backToBookings')}
                </Link>
            </Button>

            <div className="flex items-center gap-2">
                <Badge
                    className={`${statusColor(booking.status)} text-md px-3 py-1`}
                >
                    {t(`status.${booking.status}`)}
                </Badge>

                {booking.status === "pending" && (
                    <Badge variant="outline" className="text-muted-foreground">
                        {t('alerts.awaitingApproval')}
                    </Badge>
                )}
            </div>
        </div>

        {actionButtons && (
            <div className="flex items-center gap-2">
                {actionButtons}
            </div>
        )}
    </div>
}