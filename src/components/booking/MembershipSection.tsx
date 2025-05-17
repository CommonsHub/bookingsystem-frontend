
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

// Membership options
export const membershipOptions = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
  { id: "interested", name: "Interested in becoming member (we will contact you)" },
];

interface MembershipSectionProps {
  control: Control<FormData>;
}

export const MembershipSection = ({ control }: MembershipSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Are you a member of the Commons Hub?</h3>
        <p className="text-sm text-muted-foreground">
          Members get 30% discount on all rental prices. Membership starts from €10/month or €100/year.
        </p>

        <FormField
          control={control}
          name="membershipStatus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-1"
                >
                  {membershipOptions.map((option) => (
                    <FormItem
                      key={option.id}
                      className="flex items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.id} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.name}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
