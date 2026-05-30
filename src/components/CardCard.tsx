import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Collapse,
} from '@mui/material';
import { CreditCard } from '../types';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface CardCardProps {
  card: CreditCard;
  onSelect: (id: number) => void;
  isExpanded?: boolean;
  actionLabel?: string;
  onCompareToggle?: (card: CreditCard) => void;
  isCompared?: boolean;
}

const CardCard: React.FC<CardCardProps> = ({
  card,
  onSelect,
  isExpanded = false,
  actionLabel,
  onCompareToggle,
  isCompared = false,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-8px)',
        },
      }}
    >
      {card.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={card.imageUrl}
          alt={card.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Chip
          label={isCompared ? 'Added' : 'Compare'}
          size="small"
          color={isCompared ? 'primary' : 'default'}
          onClick={() => onCompareToggle?.(card)}
          clickable
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <CreditCardIcon
            sx={{ mr: 1, color: 'primary.main', fontSize: '1.5rem' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '1.125rem',
            }}
          >
            {card.name}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.6,
            minHeight: '40px',
          }}
        >
          {card.description || 'Premium credit card with exclusive benefits'}
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Issuer:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {card.bankName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Annual Fee:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: card.annualFee === 0 ? 'success.main' : 'error.main',
              }}
            >
              {card.annualFee === 0
                ? 'Free'
                : `₹${card.annualFee}`}
            </Typography>
          </Box>
        </Stack>

        {card.rewards && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocalOfferIcon
                sx={{ mr: 0.5, color: 'success.main', fontSize: '1rem' }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Rewards
              </Typography>
            </Box>
            <Box
              component="div"
              sx={{
                fontSize: '0.75rem',
                color: 'success.main',
                border: '1px solid',
                borderColor: 'success.main',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                display: 'inline-block',
                maxWidth: '100%',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                // limit height to keep cards compact
                maxHeight: 48,
                overflow: 'hidden'
              }}
              dangerouslySetInnerHTML={{ __html: card.rewards }}
            />
          </Box>
        )}
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, px: 2 }}>
          <Typography variant="subtitle1">Welcome Benefits</Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
            {card.welcomeBenefits ?? '-'}
          </Typography>

          <Typography variant="subtitle1">Fees & Charges</Typography>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2">Joining Fee: ₹{card.joiningFee}</Typography>
            <Typography variant="body2">Annual Fee: ₹{card.annualFee}</Typography>
          </Box>

          <Box sx={{ mt: 1, mb: 2 }}>
            <Button variant="contained" color="success" size="small" onClick={() => window.open(card.applyLink ?? '#', '_blank')}>Apply on Bank Website</Button>
          </Box>
        </Box>
      </Collapse>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={() => onSelect(card.id)}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1.5,
            py: 1.2,
            justifyContent: 'flex-start',
          }}
        >
          {actionLabel ?? (isExpanded ? 'View Less' : 'View More')}
        </Button>
      </Box>
    </Card>
  );
};

export default CardCard;
