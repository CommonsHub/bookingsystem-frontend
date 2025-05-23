
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

// Catering options data
export const cateringOptions = [
  { id: "simple-lunch", name: "Simple lunch: sandwiches", price: 8.5, description: "€8,50/per person", emoji: "🥪" },
  { id: "awesome-lunch", name: "Awesome lunch: salads/sandwiches from organic caterer", price: 25, description: "€25 (<25) or €22", emoji: "🥗" },
  { id: "after-event-drinks", name: "After event drinks (wine and juice)", price: 8, description: "€8/person", emoji: "🍷" },
  { id: "after-event-snacks", name: "After event snacks", price: 4, description: "€4/person", emoji: "🍿" },
  { id: "coffee-break-snacks", name: "Snacks during coffee break (fruit|nuts|sweets)", price: 4, description: "€4/pp half day | €6/pp full day", emoji: "🍊" },
];

interface CateringSectionProps {
  control: Control<FormData>;
}

export const CateringSection = ({ control }: CateringSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Do you need catering?</h3>
        <p className="text-sm text-muted-foreground">
          Coffee, tea and water are included in the price. For lunch catering we work with local suppliers (Tasty Break for simple sandwiches, Apus et Les Cocottes Volantes for organic awesome food).
        </p>

        <FormField
          control={control}
          name="cateringOptions"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                {cateringOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={control}
                    name="cateringOptions"
                    render={({ field }) => (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), option.id]
                                : (field.value || []).filter(
                                  (value) => value !== option.id
                                );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center">
                            <span className="mr-2">{option.emoji}</span>
                            <span>{option.name}</span>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="cateringComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any extra comments for the catering or other requests?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any special dietary requirements or other requests here"
                rows={2}
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
