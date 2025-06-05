
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

const baseUrl = import.meta.env.VITE_DEPLOY_URL || window.location.origin

interface PayNowButtonProps {
  booking: Booking;
}

export const PayNowButton = ({ booking }: PayNowButtonProps) => {
  const { t } = useTranslation();

  const handlePayNow = () => {
    if (booking.currency !== "EUR") {
      alert(t("booking.payNow.unsupportedCurrency"));
      return;
    }
    const amount = Math.floor(booking.price * 100);
    const description = encodeURIComponent(`${booking.title} (${booking.id})`);
    const successUrl = `${baseUrl}/bookings/${booking.id}/success`;
    const errorUrl = `${baseUrl}/bookings/${booking.id}/error`;
    // Link to Pay Brussels checkout page for Commons Hub
    const payBrusselsUrl = `https://checkout.pay.brussels/commonshub?amount=${amount}&description=${description}&successUrl=${successUrl}&errorUrl=${errorUrl}`;
    window.open(payBrusselsUrl, '_blank', 'noopener,noreferrer');
  };


  return (
    <Button
      onClick={handlePayNow}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      disabled={booking.currency !== "EUR"}
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Pay now
      <ExternalLink className="ml-2 h-3 w-3" />
    </Button>
  );
};
