
import { cateringOptionsData } from "@/data/cateringOptions";

export interface CateringCalculationResult {
  cateringPrice: number;
  cateringItems: Array<{
    id: string;
    cost: number;
  }>;
}

export const calculateCateringCosts = (
  selectedCatering: string[],
  estimatedAttendees: number
): CateringCalculationResult => {
  let cateringPrice = 0;
  const cateringItems: Array<{ id: string; cost: number }> = [];
  
  selectedCatering.forEach(cateringId => {
    const option = cateringOptionsData.find(opt => opt.id === cateringId);
    if (option && estimatedAttendees > 0) {
      const itemCost = option.price * estimatedAttendees;
      cateringPrice += itemCost;
      cateringItems.push({ id: option.id, cost: itemCost });
    }
  });

  return { cateringPrice, cateringItems };
};
