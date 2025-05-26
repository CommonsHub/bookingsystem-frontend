
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuoteData } from "@/utils/pricingCalculations";
import { useTranslation } from "react-i18next";

interface PricingDisplayProps {
  quote: QuoteData;
  vatMessage: string;
}

export const PricingDisplay = ({ quote, vatMessage }: PricingDisplayProps) => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{t('pricing.tentativePriceQuote')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{quote.room}</span>
            <div className="flex items-center gap-2">
              {quote.isMember && quote.discountAmount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  €{quote.originalRoomPrice}
                </span>
              )}
              <span className={`font-semibold ${quote.isMember && quote.discountAmount > 0 ? 'text-green-600' : ''}`}>
                €{quote.roomPrice}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{quote.pricingType}</p>
          {/* Only show member discount if user selected "yes" for membership */}
          {quote.isMember && quote.discountAmount > 0 && (
            <p className="text-sm text-green-600 font-medium">
              {t('pricing.memberDiscount')}: -€{quote.discountAmount}
            </p>
          )}
          {quote.isWeekend && quote.weekendSurcharge > 0 && (
            <p className="text-sm text-muted-foreground">
              {t('pricing.weekendSurcharge')}: €{quote.weekendSurcharge}
            </p>
          )}
        </div>

        {quote.cateringPrice > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{t('pricing.catering')} ({quote.attendees} {t('booking.people')})</span>
                <span className="font-semibold">€{quote.cateringPrice}</span>
              </div>
              {quote.cateringItems.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground">{item}</p>
              ))}
            </div>
          </>
        )}

        {quote.nonPublicSurcharge > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('pricing.nonPublicSurcharge')}</span>
                <span className="font-semibold">€{quote.nonPublicSurcharge}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('pricing.nonPublicSurchargeDescription')}
              </p>
            </div>
          </>
        )}

        <Separator />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>{t('pricing.totalEstimate')}</span>
          <span>€{quote.totalPrice}</span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {t('pricing.tentativeDisclaimer')}
          {vatMessage && ` ${vatMessage}`}
        </p>
      </CardContent>
    </Card>
  );
};
