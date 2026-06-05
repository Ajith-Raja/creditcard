import React from 'react';
import {
  Box,
  Paper,
  Chip,
  Button,
  Typography,
  Slide,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CreditCard } from '../types';

interface StickyCompareBarProps {
  selectedCards: CreditCard[];
  onRemoveCard: (cardId: number) => void;
  onAddCard: () => void;
  onCompare: () => void;
  maxCards?: number;
}

const StickyCompareBar: React.FC<StickyCompareBarProps> = ({
  selectedCards,
  onRemoveCard,
  onAddCard,
  onCompare,
  maxCards = 4,
}) => {
  if (selectedCards.length === 0) {
    return null;
  }

  const isFull = selectedCards.length >= maxCards;

  return (
    <Slide direction="up" in={selectedCards.length > 0} mountOnEnter unmountOnExit>
      <Box>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Comparison Count */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 150,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Comparing ({selectedCards.length}/{maxCards})
              </Typography>
            </Box>

            {/* Selected Cards */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                flexGrow: 1,
                minHeight: 40,
                alignItems: 'center',
              }}
            >
              {selectedCards.map((card) => (
                <Chip
                  key={card.id}
                  label={card.name}
                  onDelete={() => onRemoveCard(card.id)}
                  variant="outlined"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Add Card Button */}
            {!isFull && (
              <Button
                onClick={onAddCard}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Add Card
              </Button>
            )}

            {/* Compare Now Button */}
            <Button
              onClick={onCompare}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                whiteSpace: 'nowrap',
                minWidth: 150,
              }}
            >
              Compare Now
            </Button>
          </Box>
        </Paper>

        {/* Bottom spacing to prevent content overlap */}
        {selectedCards.length > 0 && (
          <Box sx={{ height: 80 }} />
        )}
      </Box>
    </Slide>
  );
};

export default StickyCompareBar;
