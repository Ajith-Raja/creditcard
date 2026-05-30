export interface Bank {
    id: number;
    name: string;
    slug: string;
    website: string;
    email?: string;
    contactNumber?: string;
    logoUrl: string;
    createdAt: string;
}

export interface CardType {
    id: number;
    name: string;
}

export interface CardTag {
    id: number;
    name: string;
}

export interface CreditCard {
    id: number;
    name: string;
    bankId: number;
    bankName: string;
    cardTypeId: number;
    cardTypeName: string;
    joiningFee: number;
    annualFee: number;
    latePaymentFee: number;
    foreignTransactionFeePercent: number;
    minIncome: number;
    minCreditScore: number;
    rewards: string;
    structuredRewardsJson?: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    tags: CardTag[];
    eligibilityHtml?: string;
    documentsRequiredHtml?: string;
    faqHtml?: string;
    faqJson?: string;
    structuredFeesAndChargesJson?: string;
    // UI fields
    description?: string;
    welcomeBenefits?: string;
    applyLink?: string;
}