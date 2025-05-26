
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export const PricingPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{t('pricing.tentativePriceQuote')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="pt-4">
              <Skeleton className="h-6 w-1/3 mx-auto" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('pricing.selectRoomAndDates')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
