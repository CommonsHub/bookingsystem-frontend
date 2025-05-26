
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

interface PriceSectionProps {
  control: Control<FormData>;
}

const currencies = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "CHF", label: "CHF" },
];

export const PriceSection = ({ control }: PriceSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.price.price')}</FormLabel>
              <Input
                type="number"
                step="0.00000001"
                min="0"
                placeholder={t('form.price.pricePlaceholder')}
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                value={field.value || ''}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.price.currency')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || 'EUR'}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.price.selectCurrency')} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
