
import { cateringOptions } from "@/components/booking/CateringSection";

export const calculateCateringCosts = (
  selectedCatering: string[],
  estimatedAttendees: number
) => {
  let cateringPrice = 0;
  const cateringItems: string[] = [];
  
  selectedCatering.forEach(cateringId => {
    const option = cateringOptions.find(opt => opt.id === cateringId);
    if (option && estimatedAttendees > 0) {
      const itemCost = option.price * estimatedAttendees;
      cateringPrice += itemCost;
      cateringItems.push(`${option.name}: €${itemCost}`);
    }
  });

  return { cateringPrice, cateringItems };
};
