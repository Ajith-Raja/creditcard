export const comparisons = [
  {
    id: 1,
    cards: [
      {
        name: "Card A",
        benefits: ["Cashback", "Travel Rewards"],
        fees: 1000,
        eligibility: "Good Credit Score",
      },
      {
        name: "Card B",
        benefits: ["Low Interest Rate", "No Annual Fee"],
        fees: 0,
        eligibility: "Average Credit Score",
      },
    ],
    comparisonCriteria: [
      {
        criterion: "Annual Fees",
        value: "Card A: ₹1000, Card B: ₹0",
      },
      {
        criterion: "Rewards",
        value: "Card A: Cashback, Card B: Low Interest Rate",
      },
      {
        criterion: "Eligibility",
        value: "Card A: Good Credit Score, Card B: Average Credit Score",
      },
    ],
  },
  {
    id: 2,
    cards: [
      {
        name: "Card C",
        benefits: ["Travel Insurance", "Airport Lounge Access"],
        fees: 2500,
        eligibility: "Excellent Credit Score",
      },
      {
        name: "Card D",
        benefits: ["Cashback", "Fuel Surcharge Waiver"],
        fees: 1500,
        eligibility: "Good Credit Score",
      },
    ],
    comparisonCriteria: [
      {
        criterion: "Annual Fees",
        value: "Card C: ₹2500, Card D: ₹1500",
      },
      {
        criterion: "Rewards",
        value: "Card C: Travel Insurance, Card D: Cashback",
      },
      {
        criterion: "Eligibility",
        value: "Card C: Excellent Credit Score, Card D: Good Credit Score",
      },
    ],
  },
];