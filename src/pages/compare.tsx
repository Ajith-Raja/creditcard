import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SmartCardCard from '../components/SmartCardCard';
import ComparisonTable from '../components/ComparisonTable';
import SmartHeroSection from '../components/SmartHeroSection';
import SmartSearchBar from '../components/SmartSearchBar';
import AIRecommendationsWidget from '../components/AIRecommendationsWidget';
import StickyCompareBar from '../components/StickyCompareBar';
import FrequentlyComparedWidget from '../components/FrequentlyComparedWidget';
import { api } from '../services/api';
import { CreditCard, CardTag, CardType } from '../types';
import { parseSearchQuery, scoreCard, SearchFilters } from '../utils/nlpParser';

const ComparePage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [tags, setTags] = useState<CardTag[]>([]);
  const [types, setTypes] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showComparisonSection, setShowComparisonSection] = useState(false);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearching(true);
    
    // Parse the query using NLP
    const filters = parseSearchQuery(query);
    setSearchFilters(filters);
    
    setSearching(false);
  };

  const toggleExpand = (cardId: number) => {
    setExpandedId((prev) => (prev === cardId ? null : cardId));
  };

  const toggleCompare = (card: CreditCard) => {
    setSelectedCards((prev) => {
      const exists = prev.some(c => c.id === card.id);
      
      if (exists) {
        const updated = prev.filter(c => c.id !== card.id);
        if (updated.length === 0) {
          setShowComparisonSection(false);
        }
        return updated;
      }
      
      if (prev.length >= 4) {
        setToastMessage({
          message: 'Maximum 4 cards can be compared',
          type: 'info'
        });
        return prev;
      }
      
      const updated = [...prev, card];
      if (updated.length >= 2) {
        setShowComparisonSection(true);
      }
      return updated;
    });
  };

  const handleAddCard = () => {
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSimilarCards = (card: CreditCard): CreditCard[] => {
    return cards
      .filter(c => c.id !== card.id)
      .filter(c => {
        const cardRewards = card.rewards.toLowerCase();
        const cRewards = c.rewards.toLowerCase();
        
        let matchCount = 0;
        if (cardRewards.includes('cashback') && cRewards.includes('cashback')) matchCount++;
        if (cardRewards.includes('lounge') && cRewards.includes('lounge')) matchCount++;
        if (cardRewards.includes('travel') && cRewards.includes('travel')) matchCount++;
        
        return matchCount > 0;
      })
      .slice(0, 2);
  };

  // Filter cards based on search
  const filteredCards = useMemo(() => {
    if (!searchFilters) {
      return cards;
    }

    return cards
      .map(card => ({
        card,
        score: scoreCard(card, searchFilters),
      }))
      .filter(({ score }) => score >= 50)
      .sort((a, b) => b.score - a.score)
      .map(({ card }) => card);
  }, [cards, searchFilters]);

  // Get frequently compared pairs
  const frequentlyComparedPairs = useMemo(() => {
    // This is a simple implementation. In production, this would come from analytics
    if (cards.length < 2) return [];
    
    const pairs = [
      { card1: cards[0], card2: cards[1] },
      { card1: cards[0], card2: cards[2] },
      { card1: cards[1], card2: cards[3] },
      { card1: cards[2], card2: cards[3] },
    ].filter(p => p.card1 && p.card2);
    
    return pairs;
  }, [cards]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      {/* Smart Hero Section */}
      <SmartHeroSection
        onSearch={handleSearch}
        popularCards={cards.slice(0, 3)}
        onPopularCardClick={(cardId) => {
          const card = cards.find(c => c.id === cardId);
          if (card) {
            toggleCompare(card);
            setToastMessage({
              message: `${card.name} added for comparison`,
              type: 'success'
            });
          }
        }}
      />

      {/* Smart Search Bar with Better UX */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <SmartSearchBar
          onSearch={handleSearch}
          onSuggestionClick={handleSearch}
          loading={searching}
        />
      </Container>

      {/* AI Recommendations Widget */}
      {cards.length > 0 && (
        <AIRecommendationsWidget
          cards={cards}
          onCardSelect={(card) => {
            if (!selectedCards.some(c => c.id === card.id)) {
              toggleCompare(card);
              setToastMessage({
                message: `${card.name} added for comparison`,
                type: 'success'
              });
            }
          }}
        />
      )}

      {/* Frequently Compared Widget */}
      {frequentlyComparedPairs.length > 0 && !showComparisonSection && (
        <FrequentlyComparedWidget
          frequentPairs={frequentlyComparedPairs}
          onCompare={(cards) => {
            cards.forEach(card => {
              if (!selectedCards.some(c => c.id === card.id)) {
                toggleCompare(card);
              }
            });
          }}
        />
      )}

      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 4 }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        ) : (
            <>
              {/* Search Results or All Cards */}
              <Box sx={{ mb: 6 }}>
                {searchQuery && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1F2937',
                        mb: 1,
                      }}
                    >
                      Search Results
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                      }}
                    >
                      Found {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} matching your criteria
                    </Typography>
                  </Box>
                )}

                {filteredCards.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredCards.map((card) => (
                      <Grid item xs={12} sm={6} md={3} key={card.id}>
                        <SmartCardCard
                          card={card}
                          onSelect={() => toggleExpand(card.id)}
                          isExpanded={expandedId === card.id}
                          onCompareToggle={toggleCompare}
                          isCompared={selectedCards.some(c => c.id === card.id)}
                          similarCards={getSimilarCards(card)}
                          onSimilarCardSelect={(similar) => {
                            toggleCompare(similar);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : searchQuery ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
                      No cards found matching your search
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchFilters(null);
                      }}
                      sx={{
                        color: '#667eea',
                        borderColor: '#667eea',
                      }}
                    >
                      Clear Search
                    </Button>
                  </Box>
                ) : null}
              </Box>

              {/* Comparison Section */}
              {showComparisonSection && selectedCards.length >= 2 && (
                <Box sx={{ mt: 8, mb: 4, scroll: 'smooth' }} id="comparison-section">
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: '#1F2937',
                      }}
                    >
                      Comparison Details
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        mb: 3,
                      }}
                    >
                      Side-by-side comparison of your selected cards
                    </Typography>
                  </Box>
                  <ComparisonTable cards={selectedCards} />
                </Box>
              )}
            </>
        )}
      </Container>

      {/* Sticky Compare Bar */}
      <StickyCompareBar
        selectedCards={selectedCards}
        onRemoveCard={(cardId) => {
          const card = selectedCards.find(c => c.id === cardId);
          if (card) {
            toggleCompare(card);
            setToastMessage({
              message: `${card.name} removed from comparison`,
              type: 'info'
            });
          }
        }}
        onAddCard={handleAddCard}
        onCompare={() => {
          const section = document.getElementById('comparison-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* Toast Notifications */}
      {toastMessage && (
        <Snackbar
          open={!!toastMessage}
          autoHideDuration={3000}
          onClose={() => setToastMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setToastMessage(null)}
            severity={toastMessage.type === 'success' ? 'success' : 'info'}
            sx={{
              width: '100%',
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          >
            {toastMessage.message}
          </Alert>
        </Snackbar>
      )}

      <Footer />
    </Box>
  );
};

export default ComparePage;
