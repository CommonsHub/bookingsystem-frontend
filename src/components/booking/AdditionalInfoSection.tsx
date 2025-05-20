
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

interface AdditionalInfoSectionProps {
  control: Control<FormData>;
}

export const AdditionalInfoSection = ({ control }: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="additionalComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any additional information you want to share</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please share any other information that might be relevant for your booking"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
