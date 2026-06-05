import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Paper,
  Grid,
  Chip,
  Button,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { CreditCard } from '../types';

interface AIRecommendationsWidgetProps {
  cards: CreditCard[];
  onCardSelect: (card: CreditCard) => void;
}

const REWARD_CATEGORIES = [
  { id: 'cashback', label: 'Cashback', weight: 0 },
  { id: 'lounge', label: 'Lounge Access', weight: 0 },
  { id: 'fuel', label: 'Fuel Savings', weight: 0 },
  { id: 'travel', label: 'Travel Rewards', weight: 0 },
  { id: 'dining', label: 'Dining', weight: 0 },
  { id: 'movies', label: 'Movies', weight: 0 },
];

const MONTHLY_SPENDS = [
  { label: '₹10k', value: 10000 },
  { label: '₹30k', value: 30000 },
  { label: '₹50k', value: 50000 },
  { label: '₹1L+', value: 100000 },
];

interface UserPreferences {
  rewards: Record<string, boolean>;
  monthlySpend: number;
}

const AIRecommendationsWidget: React.FC<AIRecommendationsWidgetProps> = ({
  cards,
  onCardSelect,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    rewards: {
      cashback: false,
      lounge: false,
      fuel: false,
      travel: false,
      dining: false,
      movies: false,
    },
    monthlySpend: 30000,
  });

  const handleRewardToggle = (reward: string) => {
    setPreferences((prev) => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        [reward]: !prev.rewards[reward],
      },
    }));
  };

  const handleSpendChange = (spend: number) => {
    setPreferences((prev) => ({
      ...prev,
      monthlySpend: spend,
    }));
  };

  const scoreCard = (card: CreditCard): number => {
    let score = 50; // Base score
    let rewardMatches = 0;
    let totalRewardWeight = 0;

    // Calculate reward matches
    const rewardsLower = (card.rewards || '').toLowerCase();

    Object.entries(preferences.rewards).forEach(([reward, selected]) => {
      if (!selected) return;

      totalRewardWeight += 1;

      if (reward === 'cashback' && rewardsLower.includes('cashback')) {
        rewardMatches += 1;
      } else if (reward === 'lounge' && rewardsLower.includes('lounge')) {
        rewardMatches += 1;
      } else if (reward === 'fuel' && (rewardsLower.includes('fuel') || rewardsLower.includes('petrol'))) {
        rewardMatches += 1;
      } else if (reward === 'travel' && (rewardsLower.includes('travel') || rewardsLower.includes('flights'))) {
        rewardMatches += 1;
      } else if (reward === 'dining' && (rewardsLower.includes('dining') || rewardsLower.includes('restaurant'))) {
        rewardMatches += 1;
      } else if (reward === 'movies' && (rewardsLower.includes('movie') || rewardsLower.includes('cinema'))) {
        rewardMatches += 1;
      }
    });

    if (totalRewardWeight > 0) {
      score += (rewardMatches / totalRewardWeight) * 40;
    }

    // Annual fee penalty
    const annualFee = card.annualFee || 0;
    if (annualFee === 0) {
      score += 10;
    } else if (annualFee <= 500) {
      score += 5;
    } else {
      score -= (annualFee / 100) * 2; // Penalty for higher fees
    }

    // Income eligibility
    const estimatedIncome = preferences.monthlySpend * 12;
    const minIncome = card.minIncome || 0;
    if (minIncome <= estimatedIncome) {
      score += 10;
    } else {
      score -= 5;
    }

    return Math.min(100, Math.max(0, score));
  };

  const recommendedCards = cards
    .map((card) => ({
      card,
      score: scoreCard(card),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const hasPreferences =
    Object.values(preferences.rewards).some((v) => v) || preferences.monthlySpend !== 30000;

  return (
    <Box sx={{ mb: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: '#f8f9ff',
            border: '2px solid #e0e7ff',
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box
            onClick={() => setExpanded(!expanded)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              mb: expanded ? 2 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            <SmartToyIcon sx={{ color: '#667eea', fontSize: 28 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1F2937',
                }}
              >
                AI Smart Recommendations
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                }}
              >
                Tell us your spending style
              </Typography>
            </Box>
            {expanded ? (
              <ExpandLessIcon sx={{ color: '#667eea' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: '#667eea' }} />
            )}
          </Box>

          {/* Preferences Section */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 3, mb: 3 }}>
              {/* Reward Preferences */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: '#1F2937',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                What matters to you?
              </Typography>
              <FormGroup row sx={{ mb: 3 }}>
                {REWARD_CATEGORIES.map((reward) => (
                  <FormControlLabel
                    key={reward.id}
                    control={
                      <Checkbox
                        checked={preferences.rewards[reward.id] || false}
                        onChange={() => handleRewardToggle(reward.id)}
                        sx={{
                          color: '#667eea',
                          '&.Mui-checked': {
                            color: '#667eea',
                          },
                        }}
                      />
                    }
                    label={reward.label}
                    sx={{
                      mr: 2,
                      '& .MuiTypography-root': {
                        fontSize: '13px',
                        color: '#374151',
                      },
                    }}
                  />
                ))}
              </FormGroup>

              {/* Monthly Spend */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: '#1F2937',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Monthly Spend
              </Typography>
              <RadioGroup
                row
                value={preferences.monthlySpend}
                onChange={(e) => handleSpendChange(Number(e.target.value))}
                sx={{ mb: 2 }}
              >
                {MONTHLY_SPENDS.map((spend) => (
                  <FormControlLabel
                    key={spend.value}
                    value={spend.value}
                    control={
                      <Radio
                        sx={{
                          color: '#667eea',
                          '&.Mui-checked': {
                            color: '#667eea',
                          },
                        }}
                      />
                    }
                    label={spend.label}
                    sx={{
                      mr: 2,
                      '& .MuiTypography-root': {
                        fontSize: '13px',
                        color: '#374151',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </Collapse>

          {/* Recommendations */}
          {hasPreferences && recommendedCards.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1F2937',
                }}
              >
                AI Recommended Cards
              </Typography>
              <Grid container spacing={2}>
                {recommendedCards.map(({ card, score }, index) => (
                  <Grid item xs={12} md={4} key={card.id}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 10px 25px rgba(102, 126, 234, 0.15)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => onCardSelect(card)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#1F2937',
                            }}
                          >
                            {index + 1}. {card.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#6B7280',
                            }}
                          >
                            {card.bankName}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${Math.round(score)}% Match`}
                          size="small"
                          sx={{
                            backgroundColor:
                              score > 90
                                ? '#10b981'
                                : score > 75
                                ? '#f59e0b'
                                : '#6366f1',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6B7280',
                          display: 'block',
                          mb: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {card.rewards || 'No rewards information available'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          fullWidth
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCardSelect(card);
                          }}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              backgroundColor: '#f0f4ff',
                            },
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AIRecommendationsWidget;
