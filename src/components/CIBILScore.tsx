import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const CIBILScore: React.FC = () => {
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckScore = () => {
    if (!name || !pan) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const estimatedScore = Math.floor(Math.random() * 350) + 300; // Score between 300 and 650
      setScore(estimatedScore);
      setIsLoading(false);
    }, 1500);
  };

  const getScoreColor = (s: number) => {
    if (s >= 750) return '#10B981'; // green
    if (s >= 700) return '#3B82F6'; // blue
    if (s >= 650) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getScoreDescription = (s: number) => {
    if (s >= 750) return 'Excellent';
    if (s >= 700) return 'Very Good';
    if (s >= 650) return 'Good';
    if (s >= 600) return 'Fair';
    return 'Poor';
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: '#1F2937',
          }}
        >
          Check Your CIBIL Score
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Enter your details to get an estimated credit score and personalized
          recommendations
        </Typography>
      </Box>

      {!score ? (
        <Card
          sx={{
            maxWidth: '500px',
            mx: 'auto',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Alert severity="info">
                Your CIBIL score ranges from 300 to 900. Higher scores improve
                your chances of credit approval.
              </Alert>

              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="PAN Number"
                variant="outlined"
                fullWidth
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="AAAPA1234A"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckScore}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {isLoading ? 'Checking...' : 'Check Score'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            maxWidth: '500px',
            mx: 'auto',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <VerifiedIcon
                sx={{
                  fontSize: 48,
                  color: getScoreColor(score),
                }}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: '#1F2937',
              }}
            >
              Your CIBIL Score
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: getScoreColor(score),
                  mb: 0.5,
                }}
              >
                {score}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: getScoreColor(score),
                  fontWeight: 700,
                }}
              >
                {getScoreDescription(score)}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  Score Range
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  300 - 900
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(score - 300) / 6}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    background: getScoreColor(score),
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {getScoreDescription(score)} credit score. You're eligible for
              most standard credit cards.
            </Alert>

            <Stack spacing={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                href="/cards"
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                View Eligible Cards
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => {
                  setScore(null);
                  setName('');
                  setPan('');
                }}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Check Another Score
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CIBILScore;