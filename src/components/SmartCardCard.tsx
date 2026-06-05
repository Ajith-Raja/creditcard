import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Paper,
} from '@mui/material';
import CompareIcon from '@mui/icons-material/Compare';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CreditCard } from '../types';

interface SmartCardCardProps {
  card: CreditCard;
  isCompared: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onCompareToggle: (card: CreditCard) => void;
  similarCards?: CreditCard[];
  onSimilarCardSelect?: (card: CreditCard) => void;
}

const SmartCardCard: React.FC<SmartCardCardProps> = ({
  card,
  isCompared,
  isExpanded,
  onSelect,
  onCompareToggle,
  similarCards = [],
  onSimilarCardSelect,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCompareToggle = () => {
    onCompareToggle(card);
    
    if (!isCompared) {
      setToastMessage(`✓ ${card.name} Added`);
    } else {
      setToastMessage(`✗ ${card.name} Removed`);
    }
    setShowToast(true);
  };

  const getRewardBadges = () => {
    const badges = [];
    const rewards = (card.rewards || '').toLowerCase();

    if (rewards.includes('cashback')) badges.push('Cashback');
    if (rewards.includes('lounge')) badges.push('Lounge');
    if (rewards.includes('travel')) badges.push('Travel');
    if (rewards.includes('dining')) badges.push('Dining');
    if (rewards.includes('fuel')) badges.push('Fuel');

    return badges.slice(0, 3);
  };

  const annualFeeText = card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/year`;

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          border: isCompared ? '2px solid #667eea' : '1px solid #e5e7eb',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
            transform: 'translateY(-4px)',
          },
          backgroundColor: isCompared ? 'rgba(102, 126, 234, 0.03)' : 'white',
        }}
      >
        {/* Compare Badge */}
        {isCompared && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 20 }} />
          </Box>
        )}

        {/* Card Header */}
        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: '#1F2937',
              fontSize: '16px',
            }}
          >
            {card.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#6B7280',
              display: 'block',
              mb: 1.5,
            }}
          >
            {card.bankName}
          </Typography>

          {/* Reward Badges */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
            {getRewardBadges().map((badge) => (
              <Chip
                key={badge}
                label={badge}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#e0e7ff',
                  color: '#667eea',
                }}
              />
            ))}
          </Box>

          {/* Annual Fee */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              backgroundColor: '#f9fafb',
              borderRadius: 1,
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#6B7280',
                fontWeight: 600,
              }}
            >
              Annual Fee
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: card.annualFee === 0 ? '#10b981' : '#1F2937',
              }}
            >
              {annualFeeText}
            </Typography>
          </Box>

          {/* Rewards Preview */}
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '13px',
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            {(card.rewards || 'No rewards information available').substring(0, 100)}
            {(card.rewards || '').length > 100 ? '...' : ''}
          </Typography>

          {/* Min Income */}
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '12px',
            }}
          >
            Min Income: ₹{card.minIncome ? (card.minIncome / 1000).toFixed(0) : '—'}k
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions
          sx={{
            mt: 'auto',
            pt: 1,
            display: 'flex',
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <Button
            size="small"
            onClick={onSelect}
            sx={{
              flex: 1,
              color: '#667eea',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </Button>
          <Button
            size="small"
            onClick={handleCompareToggle}
            startIcon={<CompareIcon sx={{ fontSize: 16 }} />}
            variant={isCompared ? 'contained' : 'outlined'}
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: '12px',
              backgroundColor: isCompared ? '#667eea' : 'transparent',
              color: isCompared ? 'white' : '#667eea',
              borderColor: '#667eea',
            }}
          >
            {isCompared ? 'Added' : 'Compare'}
          </Button>
        </CardActions>

        <Dialog open={isExpanded} onClose={onSelect} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700, color: '#1F2937' }}>{card.name}</DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#1F2937',
                fontSize: '12px',
              }}
            >
              Rewards
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
                fontSize: '13px',
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {card.rewards || 'No rewards information available'}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#1F2937',
                fontSize: '12px',
              }}
            >
              Eligibility
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                Minimum Income: ₹{card.minIncome != null ? card.minIncome.toLocaleString() : 'Not specified'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                Credit Score: {card.minCreditScore ? card.minCreditScore + '+' : 'Not specified'}
              </Typography>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#1F2937',
                fontSize: '12px',
              }}
            >
              Fees & Charges
            </Typography>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                Joining Fee: ₹{card.joiningFee === 0 ? 'Free' : card.joiningFee || 'Not specified'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                Late Payment Fee: ₹{card.latePaymentFee || 'Not specified'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                Foreign Transaction Fee: {card.foreignTransactionFeePercent ? card.foreignTransactionFeePercent + '%' : 'Not specified'}
              </Typography>
            </Box>

            {isCompared && similarCards.length > 0 && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#fafbfc', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: '#1F2937',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Compare with Similar
                </Typography>
                <Grid container spacing={1}>
                  {similarCards.slice(0, 2).map((similar) => (
                    <Grid item xs={6} key={similar.id}>
                      <Paper
                        onClick={() => onSimilarCardSelect?.(similar)}
                        sx={{
                          p: 1,
                          cursor: 'pointer',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: 1,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f0f4ff',
                            borderColor: '#667eea',
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: '#667eea',
                            display: 'block',
                            fontSize: '11px',
                          }}
                        >
                          {similar.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onSelect} sx={{ color: '#667eea', fontWeight: 700 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      {/* Smart Notification Toast */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: isCompared ? '#667eea' : '#dc2626',
            borderRadius: 1.5,
            fontWeight: 600,
          },
        }}
      />
    </>
  );
};

export default SmartCardCard;
