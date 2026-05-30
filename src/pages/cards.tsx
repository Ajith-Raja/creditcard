import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Container,
  Box,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import CardCard from '../components/CardCard';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { CreditCard } from '../types';

const CardsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await api.cards.getAll();
        setCards(data);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
          color: 'text.primary',
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
            }}
          >
            Credit Card Listings
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Find and compare the best credit cards for your needs
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 4 }}>
        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Search Cards"
            variant="outlined"
            fullWidth
            placeholder="Search by card name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6B7280', mr: 1 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '1rem',
                background: 'white',
                '&:hover': {
                  borderColor: '#3B82F6',
                },
              },
            }}
          />
        </Box>

        {/* Results Section */}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        ) : filteredCards.length > 0 ? (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: '#6B7280',
                fontWeight: 600,
              }}
            >
              Showing {filteredCards.length}{' '}
              {filteredCards.length === 1 ? 'card' : 'cards'}
            </Typography>
            <Grid container spacing={3}>
              {filteredCards.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.id}>
                  <Box>
                    <CardCard
                      card={card}
                      onSelect={(id) => router.push(`/card/${id}`)}
                      actionLabel="View Details"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#6B7280',
                mb: 1,
              }}
            >
              No cards found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Try adjusting your search terms
            </Typography>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default CardsPage;
