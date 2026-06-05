import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface Suggestion {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'recent' | 'popular' | 'category' | 'ai';
  query: string;
}

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (query: string) => void;
  loading?: boolean;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onSearch,
  onSuggestionClick,
  loading = false,
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions: Suggestion[] = [
    {
      id: '1',
      label: 'Cashback cards',
      icon: <TrendingUpIcon fontSize="small" />,
      type: 'popular',
      query: 'cashback',
    },
    {
      id: '2',
      label: 'Best cashback cards under ₹1000',
      icon: <FlashOnIcon fontSize="small" />,
      type: 'popular',
      query: 'cashback under 1000',
    },
    {
      id: '3',
      label: 'Lounge cards',
      icon: <CreditCardIcon fontSize="small" />,
      type: 'category',
      query: 'lounge',
    },
    {
      id: '4',
      label: 'Travel rewards cards',
      icon: <FlightTakeoffIcon fontSize="small" />,
      type: 'category',
      query: 'travel',
    },
    {
      id: '5',
      label: 'Lifetime free cards',
      icon: <CreditCardIcon fontSize="small" />,
      type: 'popular',
      query: 'lifetime free',
    },
  ];

  const filteredSuggestions = useMemo(() => {
    if (!input.trim()) return suggestions;

    const lowerInput = input.toLowerCase();
    return suggestions.filter(
      (s) =>
        s.label.toLowerCase().includes(lowerInput) ||
        s.query.toLowerCase().includes(lowerInput)
    );
  }, [input]);

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
    onSuggestionClick(query);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper
        elevation={showSuggestions ? 8 : 2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <SearchIcon sx={{ color: '#667eea' }} />
        <TextField
          fullWidth
          placeholder="Search cards or describe needs..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            '& input::placeholder': {
              color: '#999',
              opacity: 1,
            },
          }}
        />
        {loading && <CircularProgress size={24} />}
      </Paper>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 1000,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {filteredSuggestions.length > 0 ? (
            <List sx={{ p: 0 }}>
              {filteredSuggestions.map((suggestion, index) => (
                <React.Fragment key={suggestion.id}>
                  <ListItem
                    button
                    onClick={() => handleSuggestionClick(suggestion.query)}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: '#667eea' }}>
                      {suggestion.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.label}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '14px',
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItem>
                  {index < filteredSuggestions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                No suggestions found
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SmartSearchBar;
