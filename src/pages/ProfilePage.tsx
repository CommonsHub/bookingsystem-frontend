
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useAppTranslation } from "@/hooks/use-translation";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const { settings: headerSettings, updateSettings: updateHeaderSettings } = useHeaderSettings();
  const { t } = useAppTranslation();

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

  // Show loading state only when both auth and profile are loading
  const isLoading = authLoading || (user && profileLoading);
  console.log("Loading state:", isLoading, "Auth loading:", authLoading, "Profile loading:", profileLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>{t('profile.loading')}</p>
      </div>
    );
  }

  // Don't render anything if user is not authenticated and we're redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('profile.title')}</CardTitle>
          <CardDescription>
            {t('profile.description')}
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
                    <FormLabel>{t('profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('profile.fullNamePlaceholder')} {...field} />
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
                    <FormLabel>{t('profile.address')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('profile.addressPlaceholder')}
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
                      <FormLabel>{t('profile.hasBusiness')}</FormLabel>
                      <FormDescription>
                        {t('profile.hasBusinessDescription')}
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
                      <FormLabel>{t('profile.vatNumber')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('profile.vatNumberPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full">
                {t('profile.saveChanges')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('profile.improvementsTitle')}</CardTitle>
          <CardDescription>
            {t('profile.improvementsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox
                checked={headerSettings.showStickyHeader}
                onCheckedChange={(checked) =>
                  updateHeaderSettings({ showStickyHeader: !!checked })
                }
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('profile.stickyHeader')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('profile.stickyHeaderDescription')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
