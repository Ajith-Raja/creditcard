import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Container,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CardCard from '../components/CardCard';
import ComparisonTable from '../components/ComparisonTable';
import { api } from '../services/api';
import { CreditCard, CardTag, CardType } from '../types';

const ComparePage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [tags, setTags] = useState<CardTag[]>([]);
  const [types, setTypes] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const [cardsData, tagsData, typesData] = await Promise.all([
                  api.cards.getAll(),
                  api.tags.getAll(),
                  api.types.getAll()
              ]);
              setCards(cardsData);
              setTags(tagsData);
              setTypes(typesData);
          } catch (err) {
              console.error('Failed to fetch compare data:', err);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

  const toggleExpand = (cardId: number) => {
    setExpandedId((prev) => (prev === cardId ? null : cardId));
  };

  const toggleCompare = (card: CreditCard) => {
    setSelectedCards((prev) => {
      const exists = prev.some(c => c.id === card.id);
      if (exists) return prev.filter(c => c.id !== card.id);
      if (prev.length >= 4) return prev; // limit to 4 comparisons
      return [...prev, card];
    });
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value as string);
  };

  const filteredCards = filter
    ? cards.filter((card) => {
        const hasTag = card.tags.some(t => t.name === filter);
        const hasType = card.cardTypeName === filter;
        const rewardsMatch = card.rewards.toLowerCase().includes(filter.toLowerCase());
        return hasTag || hasType || rewardsMatch;
      })
    : cards;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)',
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
              mb: 2,
            }}
          >
            Compare Credit Cards
          </Typography>
          <FormControl sx={{ minWidth: 200, mt: 2 }}>
            <InputLabel id="filter-label">Filter by Category</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              label="Filter by Category"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {types.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
              {tags.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Container>
      </Box>

      {/* Card Comparison Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 4 }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        ) : (
            <>
              <Grid container spacing={3}>
                {filteredCards.map((card) => (
                  <Grid item xs={12} sm={6} md={3} key={card.id}>
                    <CardCard
                      card={card}
                      onSelect={() => toggleExpand(card.id)}
                      isExpanded={expandedId === card.id}
                      onCompareToggle={toggleCompare}
                      isCompared={selectedCards.some(c => c.id === card.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Selected cards bar */}
              {selectedCards.length > 0 && (
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Selected for comparison ({selectedCards.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {selectedCards.map(c => (
                      <Chip key={c.id} label={c.name} onDelete={() => toggleCompare(c)} />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Comparison Table */}
              {selectedCards.length > 1 && (
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#1F2937',
                    }}
                  >
                    Comparison Details
                  </Typography>
                  <ComparisonTable cards={selectedCards} />
                </Box>
              )}
            </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ComparePage;
