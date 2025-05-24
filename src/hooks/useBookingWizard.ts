
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormData } from "@/components/booking/BookingFormSchema";

export const useBookingWizard = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormData>();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sections = [
    t('form.sections.basicInfo.title'),
    t('form.sections.dateTime.title'), 
    t('form.sections.roomSelection.title'),
    t('form.sections.catering.title'),
    t('form.sections.eventSupport.title'),
    t('form.sections.contactMembership.title'),
    t('form.sections.additionalInfo.title'),
    t('form.sections.pricing.title')
  ];

  // Watch form values to determine completion
  const title = watch("title");
  const description = watch("description");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const roomId = watch("roomId");
  const email = watch("email");
  const name = watch("name");
  const membershipStatus = watch("membershipStatus");

  useEffect(() => {
    const newCompletedSections = new Set<number>();

    // Section 0: Basic Info
    if (title && description) {
      newCompletedSections.add(0);
    }

    // Section 1: Date & Time
    if (startDate && endDate) {
      newCompletedSections.add(1);
    }

    // Section 2: Room Selection
    if (roomId) {
      newCompletedSections.add(2);
    }

    // Section 3: Catering (always considered complete since it's optional)
    newCompletedSections.add(3);

    // Section 4: Event Support (always considered complete since it's optional)
    newCompletedSections.add(4);

    // Section 5: Contact & Membership
    if (email && name && membershipStatus) {
      newCompletedSections.add(5);
    }

    // Section 6: Additional Info (always considered complete since it's optional)
    newCompletedSections.add(6);

    // Section 7: Pricing (complete if we have room and dates for pricing calculation)
    if (roomId && startDate && endDate) {
      newCompletedSections.add(7);
    }

    setCompletedSections(newCompletedSections);
  }, [title, description, startDate, endDate, roomId, email, name, membershipStatus]);

  // Auto-advance current section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 80; // Main header
      const progressHeight = 60; // Fixed progress card height
      const totalOffset = headerHeight + progressHeight;
      const viewportMiddle = window.scrollY + window.innerHeight / 2;

      const sections = document.querySelectorAll('[data-wizard-section]');
      
      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop - totalOffset;
        const sectionBottom = sectionTop + element.offsetHeight;

        if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
          setCurrentSection(index);
        }
      });
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return {
    currentSection,
    completedSections,
    sections
  };
};
