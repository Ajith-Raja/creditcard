import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { CreditCard } from '../types';

interface ComparisonPair {
  card1: CreditCard;
  card2: CreditCard;
  comparisonCount?: number;
}

interface FrequentlyComparedWidgetProps {
  frequentPairs: ComparisonPair[];
  onCompare: (cards: CreditCard[]) => void;
}

const FrequentlyComparedWidget: React.FC<FrequentlyComparedWidgetProps> = ({
  frequentPairs,
  onCompare,
}) => {
  if (!frequentPairs || frequentPairs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#1F2937',
            }}
          >
            Frequently Compared
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
            }}
          >
            Popular card comparisons by other users
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {frequentPairs.slice(0, 4).map((pair, index) => (
            <Grid item xs={12} sm={6} md={3} key={`${pair.card1.id}-${pair.card2.id}`}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Card 1 */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#1F2937',
                      mb: 0.5,
                    }}
                  >
                    {pair.card1.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6B7280',
                      display: 'block',
                    }}
                  >
                    {pair.card1.bankName}
                  </Typography>
                </Box>

                {/* VS */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    my: 1,
                    py: 1,
                    borderTop: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <CompareArrowsIcon
                    sx={{
                      color: '#667eea',
                      fontSize: 20,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#667eea',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    VS
                  </Typography>
                </Box>

                {/* Card 2 */}
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#1F2937',
                      mb: 0.5,
                    }}
                  >
                    {pair.card2.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6B7280',
                      display: 'block',
                    }}
                  >
                    {pair.card2.bankName}
                  </Typography>
                </Box>

                {/* Compare Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => onCompare([pair.card1, pair.card2])}
                  sx={{
                    mt: 2,
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: '#f0f4ff',
                      borderColor: '#667eea',
                    },
                  }}
                >
                  Compare
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FrequentlyComparedWidget;
