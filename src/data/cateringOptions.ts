export interface CateringOptionData {
  id: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  emoji: string;
}

// Catering options data with translation keys
export const cateringOptionsData: CateringOptionData[] = [
  {
    id: "simple-lunch",
    nameKey: "catering.options.simpleLunch.name",
    descriptionKey: "catering.options.simpleLunch.description",
    price: 8.5,
    emoji: "🥪"
  },
  {
    id: "awesome-lunch",
    nameKey: "catering.options.awesomeLunch.name",
    descriptionKey: "catering.options.awesomeLunch.description",
    price: 25,
    emoji: "🥗"
  },
  {
    id: "after-event-drinks",
    nameKey: "catering.options.afterEventDrinks.name",
    descriptionKey: "catering.options.afterEventDrinks.description",
    price: 8,
    emoji: "🍷"
  },
  {
    id: "after-event-snacks",
    nameKey: "catering.options.afterEventSnacks.name",
    descriptionKey: "catering.options.afterEventSnacks.description",
    price: 4,
    emoji: "🍿"
  },
  {
    id: "coffee-break-snacks",
    nameKey: "catering.options.coffeeBreakSnacks.name",
    descriptionKey: "catering.options.coffeeBreakSnacks.description",
    price: 4,
    emoji: "🍊"
  }
];