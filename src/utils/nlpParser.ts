/**
 * Natural Language Parser for Credit Card Queries
 * Converts user input like "salary 50k need lounge travel twice a year"
 * into structured filter criteria
 */

export interface SearchFilters {
  keywords: string[];
  salary?: number;
  annualFee?: {
    min?: number;
    max?: number;
  };
  rewards: {
    cashback?: boolean;
    lounge?: boolean;
    travel?: boolean;
    dining?: boolean;
    fuel?: boolean;
    movies?: boolean;
  };
  annualFeeLow?: boolean;
  lifetimeFree?: boolean;
  matchScore?: number;
}

const REWARD_KEYWORDS: Record<string, string[]> = {
  cashback: ['cashback', 'cash back', 'cb'],
  lounge: ['lounge', 'airport lounge', 'lounge access'],
  travel: ['travel', 'flights', 'hotels', 'booking', 'miles', 'points'],
  dining: ['dining', 'restaurants', 'food', 'eat'],
  fuel: ['fuel', 'petrol', 'gas', 'pump'],
  movies: ['movies', 'cinema', 'film', 'theatres'],
};

const FEE_KEYWORDS: Record<string, string[]> = {
  low_fee: ['low fee', 'low annual', 'minimal fee', 'no fee', 'zero fee'],
  lifetime_free: ['lifetime free', 'lifetime', 'no annual fee'],
  under_1000: ['under 1000', 'under 1k', '<1000', '<1k'],
  under_500: ['under 500', 'under 5k', '<500'],
};

const SALARY_PATTERN = /(?:salary|income|earning|earn)\s+(?:₹|rs|$)?(\d+)[kKmM]?/gi;
const MONTHLY_SPEND_PATTERN = /(?:spend|spending|spend\s+monthly)\s+(?:₹|rs|$)?(\d+)[kKmM]?/gi;
const ANNUAL_FEE_PATTERN = /(?:annual\s+fee|annual\s+charge)?\s*(?:under|<|below|max)?\s*(?:₹|rs|$)?(\d+)/gi;

function extractNumber(match: string): number {
  const num = parseInt(match.replace(/[₹$,]/g, ''));
  if (match.includes('k') || match.includes('K')) return num * 1000;
  if (match.includes('m') || match.includes('M')) return num * 1000000;
  return num;
}

function extractRewards(query: string): SearchFilters['rewards'] {
  const rewards: SearchFilters['rewards'] = {
    cashback: false,
    lounge: false,
    travel: false,
    dining: false,
    fuel: false,
    movies: false,
  };

  const lowerQuery = query.toLowerCase();

  Object.entries(REWARD_KEYWORDS).forEach(([key, keywords]) => {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      rewards[key as keyof typeof rewards] = true;
    }
  });

  return rewards;
}

function extractAnnualFee(query: string): { min?: number; max?: number } | undefined {
  const lowerQuery = query.toLowerCase();

  // Check for lifetime free
  if (FEE_KEYWORDS.lifetime_free.some(kw => lowerQuery.includes(kw))) {
    return { max: 0 };
  }

  // Check for under specific amounts
  if (FEE_KEYWORDS.under_500.some(kw => lowerQuery.includes(kw))) {
    return { max: 500 };
  }

  if (FEE_KEYWORDS.under_1000.some(kw => lowerQuery.includes(kw))) {
    return { max: 1000 };
  }

  // Try to extract specific amounts
  const matches = Array.from(query.matchAll(ANNUAL_FEE_PATTERN));
  if (matches.length > 0) {
    const amount = extractNumber(matches[0][0]);
    return { max: amount };
  }

  return undefined;
}

export function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    keywords: [],
    rewards: extractRewards(query),
  };

  // Extract salary/income
  const salaryMatch = query.match(SALARY_PATTERN);
  if (salaryMatch) {
    filters.salary = extractNumber(salaryMatch[0]);
  }

  // Extract monthly spend
  const spendMatch = query.match(MONTHLY_SPEND_PATTERN);
  if (spendMatch) {
    filters.keywords.push(`spend_${extractNumber(spendMatch[0])}`);
  }

  // Extract annual fee
  filters.annualFee = extractAnnualFee(query);

  // Check for low fee preference
  if (query.toLowerCase().includes('low fee') || query.toLowerCase().includes('no fee')) {
    filters.annualFeeLow = true;
  }

  // Check for lifetime free
  if (query.toLowerCase().includes('lifetime')) {
    filters.lifetimeFree = true;
  }

  // Extract keywords (anything that looks like important terms)
  const words = query.split(/\s+/).filter(w => w.length > 3);
  const uniqueKeywords: string[] = [];
  const seenKeywords: { [key: string]: boolean } = {};
  
  words.forEach(word => {
    if (!seenKeywords[word]) {
      seenKeywords[word] = true;
      uniqueKeywords.push(word);
    }
  });
  
  filters.keywords = uniqueKeywords;

  return filters;
}

/**
 * Score a card based on filters
 * Returns a match score from 0-100
 */
export function scoreCard(
  card: any,
  filters: SearchFilters
): number {
  let score = 50; // Base score

  // Reward matching
  let rewardMatches = 0;
  let rewardWeights = 0;
  const cardRewards = (card.rewards || '').toLowerCase();

  if (filters.rewards.cashback) {
    rewardWeights += 20;
    if (cardRewards.includes('cashback')) rewardMatches += 20;
  }

  if (filters.rewards.lounge) {
    rewardWeights += 20;
    if (cardRewards.includes('lounge')) rewardMatches += 20;
  }

  if (filters.rewards.travel) {
    rewardWeights += 15;
    if (cardRewards.includes('travel') || cardRewards.includes('flights')) {
      rewardMatches += 15;
    }
  }

  if (filters.rewards.dining) {
    rewardWeights += 15;
    if (cardRewards.includes('dining') || cardRewards.includes('restaurant')) {
      rewardMatches += 15;
    }
  }

  if (filters.rewards.fuel) {
    rewardWeights += 10;
    if (cardRewards.includes('fuel') || cardRewards.includes('petrol')) {
      rewardMatches += 10;
    }
  }

  if (rewardWeights > 0) {
    score += (rewardMatches / rewardWeights) * 30;
  }

  // Annual fee matching
  const annualFee = card.annualFee || 0;
  if (filters.annualFee) {
    if (filters.annualFee.max && annualFee <= filters.annualFee.max) {
      score += 15;
    } else if (annualFee === 0) {
      score += 10;
    }
  }

  // Salary matching
  const minIncome = card.minIncome || 0;
  if (filters.salary) {
    if (minIncome <= filters.salary) {
      score += 10;
    } else if (minIncome <= filters.salary * 1.5) {
      score += 5;
    }
  }

  // Boost for lifetime free
  if (filters.lifetimeFree && annualFee === 0) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}
