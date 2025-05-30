
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface PayNowButtonProps {
  booking: Booking;
}

export const PayNowButton = ({ booking }: PayNowButtonProps) => {
  const { t } = useTranslation();

  const handlePayNow = () => {
    // Link to Pay Brussels checkout page for Commons Hub
    const payBrusselsUrl = "https://pay.brussels/commonshub";
    window.open(payBrusselsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handlePayNow}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Pay now
      <ExternalLink className="ml-2 h-3 w-3" />
    </Button>
  );
};
