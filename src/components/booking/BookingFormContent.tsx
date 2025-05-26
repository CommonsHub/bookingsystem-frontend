
import { Control } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { BookingInfoSection } from "./BookingInfoSection";
import { CateringSection } from "./CateringSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { DateTimeSection } from "./DateTimeSection";
import { EventSupportSection } from "./EventSupportSection";
import { MembershipSection } from "./MembershipSection";
import { RoomSelectionSection } from "./RoomSelectionSection";
import { PricingQuoteSection } from "./PricingQuoteSection";
import { FormData } from "./BookingFormSchema";
import { Room } from "@/types";
import { useFormContext } from "react-hook-form";
import { languages } from "@/i18n/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingFormContentProps {
  control: Control<FormData>;
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
}

export const BookingFormContent = ({
  control,
  rooms,
  selectedRoomId,
  setSelectedRoomId
}: BookingFormContentProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormData>();
  
  // Watch for the bookingId to determine if this is an edit form
  const bookingId = watch("bookingId");
  const isEdit = !!bookingId;

  const getLanguageDisplay = (languageCode?: string) => {
    if (!languageCode) return t('form.language.notSet');
    const language = languages[languageCode as keyof typeof languages];
    return language ? `${language.flag} ${language.nativeName}` : languageCode.toUpperCase();
  };

  return (
    <CardContent className="space-y-12 pb-8">
      <div data-wizard-section="0" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.basicInfo.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.basicInfo.description')}</p>
        </div>
        <BookingInfoSection control={control} />
        
        {/* Show language field for existing bookings (read-only) */}
        {isEdit && (
          <div className="mt-4">
            <Label>{t('form.language.label')}</Label>
            <Input
              value={getLanguageDisplay(watch("language"))}
              readOnly
              className="bg-gray-100 mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('form.language.readOnlyNote')}
            </p>
          </div>
        )}
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="1" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.dateTime.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.dateTime.description')}</p>
        </div>
        <DateTimeSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="2" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.roomSelection.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.roomSelection.description')}</p>
        </div>
        <RoomSelectionSection
          control={control}
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="3" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.catering.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.catering.description')}</p>
        </div>
        <CateringSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="4" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.eventSupport.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.eventSupport.description')}</p>
        </div>
        <EventSupportSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="5" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.contactMembership.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.contactMembership.description')}</p>
        </div>
        <div className="space-y-6">
          <ContactInfoSection control={control} isReadOnly={false} />
          <MembershipSection control={control} />
        </div>
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="6" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.additionalInfo.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.additionalInfo.description')}</p>
        </div>
        <AdditionalInfoSection control={control} />
      </div>

      <Separator className="my-12" />

      <div data-wizard-section="7" className="scroll-mt-24 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('form.sections.pricing.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('form.sections.pricing.description')}</p>
        </div>
        <PricingQuoteSection rooms={rooms} />
      </div>
    </CardContent>
  );
};
