import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CalendarDays, FileText, User, AlertTriangle, Building2, Phone, Mail } from "lucide-react";

import { RequestFormData, requestFormSchema } from "./RequestFormSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface RequestFormProps {
  defaultValues: RequestFormData;
  onSubmit: (data: RequestFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEmbed?: boolean;
  isEdit?: boolean;
}

const requestTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership Request" },
  { value: "feedback", label: "Feedback or Suggestion" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const priorityLevels = [
  { value: "low", label: "Low", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high", label: "High", color: "text-orange-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" },
];

export const RequestForm = ({ defaultValues, onSubmit, onCancel, isSubmitting = false, isEmbed = false, isEdit = false }: RequestFormProps) => {
  const { t } = useTranslation();
  
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: RequestFormData) => {
    await onSubmit(data);
  };

  return (
    <div className={`${isEmbed ? 'w-full' : 'max-w-4xl mx-auto'} space-y-6`}>
      {!isEmbed && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('requests.edit.title') : t('requests.newTitle')}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? t('requests.edit.description') : t('requests.newDescription')}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={`${isEmbed ? 'space-y-4' : 'space-y-6'}`}>
          {/* Basic Information */}
          <Card className={isEmbed ? 'border-0 shadow-none' : ''}>
            {!isEmbed && (
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('requests.sections.basicInfo.title')}
                </CardTitle>
                <CardDescription>{t('requests.sections.basicInfo.description')}</CardDescription>
              </CardHeader>
            )}
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('requests.basicInfo.title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('requests.basicInfo.titlePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('requests.basicInfo.description')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('requests.basicInfo.descriptionPlaceholder')} 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.basicInfo.requestType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('requests.basicInfo.requestTypePlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {requestTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.basicInfo.priority')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('requests.basicInfo.priorityPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityLevels.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <span className={priority.color}>{priority.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expectedCompletionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('requests.basicInfo.expectedCompletionDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('requests.basicInfo.expectedCompletionDatePlaceholder')}</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className={isEmbed ? 'border-0 shadow-none' : ''}>
            {!isEmbed && (
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('requests.sections.contactInfo.title')}
                </CardTitle>
                <CardDescription>{t('requests.sections.contactInfo.description')}</CardDescription>
              </CardHeader>
            )}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.contact.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('requests.contact.namePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.contact.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('requests.contact.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.contact.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('requests.contact.phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('requests.contact.organization')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('requests.contact.organizationPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className={isEmbed ? 'border-0 shadow-none' : ''}>
            {!isEmbed && (
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t('requests.sections.additionalInfo.title')}
                </CardTitle>
                <CardDescription>{t('requests.sections.additionalInfo.description')}</CardDescription>
              </CardHeader>
            )}
            <CardContent>
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('requests.additionalInfo.label')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('requests.additionalInfo.placeholder')} 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className={`flex justify-end ${isEmbed ? 'space-x-3' : 'space-x-4'}`}>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('form.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('form.actions.submitting') : t('form.actions.submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}; 