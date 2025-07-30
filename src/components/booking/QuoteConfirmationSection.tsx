import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "./BookingFormSchema";

interface QuoteConfirmationSectionProps {
  control: Control<FormData>;
}

export const QuoteConfirmationSection = ({ control }: QuoteConfirmationSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('pricing.quoteConfirmation')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please review the quote above and confirm your agreement to proceed.
        </p>
      </div>
      
      <FormField
        control={control}
        name="quoteConfirmed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('pricing.confirmQuote')}
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};