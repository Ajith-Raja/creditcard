import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Chip,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MovieIcon from '@mui/icons-material/Movie';
import EventSeatIcon from '@mui/icons-material/EventSeat';

interface SmartHeroSectionProps {
  onSearch: (query: string) => void;
  popularCards: Array<{ id: number; name: string }>;
  onPopularCardClick: (cardId: number) => void;
}

const CATEGORIES = [
  { label: 'Cashback', icon: TrendingUpIcon, color: '#4CAF50' },
  { label: 'Travel', icon: FlightTakeoffIcon, color: '#2196F3' },
  { label: 'Lounge', icon: EventSeatIcon, color: '#FF9800' },
  { label: 'Fuel', icon: LocalGasStationIcon, color: '#F44336' },
  { label: 'Dining', icon: LocalDiningIcon, color: '#E91E63' },
  { label: 'Movies', icon: MovieIcon, color: '#9C27B0' },
  { label: 'Lifetime Free', icon: CreditCardIcon, color: '#00BCD4' },
];

const SmartHeroSection: React.FC<SmartHeroSectionProps> = ({
  onSearch,
  popularCards,
  onPopularCardClick,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6,
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Heading */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: '28px', md: '42px' },
              letterSpacing: '-0.5px',
            }}
          >
            Compare Smartly
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              opacity: 0.95,
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Find the Best Credit Card for You
          </Typography>
        </Box>

        {/* Search Box */}
        <Box
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 4,
            transition: 'transform 0.3s ease',
            transform: isFocused ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Paper
            elevation={isFocused ? 20 : 8}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: 3,
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <SearchIcon sx={{ color: '#667eea', fontSize: 28 }} />
            <TextField
              fullWidth
              placeholder="Search card name OR describe your needs: 'Need cashback for online shopping'"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                '& input::placeholder': {
                  color: '#999',
                  opacity: 1,
                  fontSize: '14px',
                },
                '& input': {
                  color: '#333',
                  fontSize: '14px',
                },
              }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{
                bgcolor: '#667eea',
                '&:hover': { bgcolor: '#764ba2' },
                minWidth: 100,
                fontWeight: 600,
              }}
            >
              Search
            </Button>
          </Paper>
        </Box>

        {/* Popular Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 600,
              fontSize: '14px',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Popular
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {popularCards.slice(0, 3).map((card) => (
              <Chip
                key={card.id}
                label={card.name}
                onClick={() => onPopularCardClick(card.id)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  fontWeight: 500,
                  fontSize: '13px',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Categories */}
        <Box>
          <Typography
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 600,
              fontSize: '14px',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Categories
          </Typography>
          <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <Grid item xs={6} sm={4} md={3} key={category.label}>
                  <Paper
                    onClick={() => onSearch(`category:${category.label}`)}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: 32,
                        mb: 1,
                        color: category.color,
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: 'white',
                      }}
                    >
                      {category.label}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SmartHeroSection;
