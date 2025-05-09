
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ProfileFormValues = {
  full_name: string;
  address: string;
  has_business: boolean;
  vat_number?: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: "",
      address: "",
      has_business: false,
      vat_number: "",
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        address: profile.address || "",
        has_business: profile.has_business || false,
        vat_number: profile.vat_number || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    // Only include VAT number if user has a business
    const updates = {
      ...data,
      vat_number: data.has_business ? data.vat_number : null,
    };
    
    await updateProfile(updates);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information and business details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="has_business"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I have a business</FormLabel>
                      <FormDescription>
                        Check this if you need to provide VAT information
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("has_business") && (
                <FormField
                  control={form.control}
                  name="vat_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your VAT number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
