export const plans = [
  {
    id: "pocket",
    name: "Pocket",
    tagline: "One screen, in your hand.",
    monthly: 149,
    yearly: 1490,
    features: [
      "1 screen at a time",
      "Phone and tablet",
      "HD trailers",
      "Hollywood, Bollywood, and Tollywood",
    ],
  },
  {
    id: "parlour",
    name: "Parlour",
    tagline: "The plan most rooms keep.",
    monthly: 399,
    yearly: 3990,
    featured: true,
    features: [
      "2 screens at a time",
      "Phone, tablet, and TV",
      "Full HD",
      "No promo breaks",
      "My List on every signed-in device",
    ],
  },
  {
    id: "balcony",
    name: "Balcony",
    tagline: "The sharpest seat in the house.",
    monthly: 649,
    yearly: 6490,
    features: [
      "4 screens at a time",
      "Phone, tablet, laptop, and TV",
      "4K where the title allows",
      "Spatial audio",
      "No promo breaks",
    ],
  },
];

export function getPlan(id) {
  return plans.find((plan) => plan.id === id) || null;
}

export function planPrice(plan, cycle) {
  if (!plan) return 0;
  return cycle === "year" ? plan.yearly : plan.monthly;
}
