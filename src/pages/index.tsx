import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { Bank } from '../types';
import { IMAGE_BASE_URL } from '../config';

const Home: React.FC = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const banksData = await api.banks.getAll();
                setBanks(banksData);
            } catch (err) {
                console.error('Failed to fetch banks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

  const features = [
    {
      icon: <CreditCardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Find Your Perfect Card',
      description: 'Browse through hundreds of credit cards tailored to your needs',
    },
    {
      icon: <CompareArrowsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Compare Cards',
      description: 'Side-by-side comparison of rewards, fees, and benefits',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Check CIBIL Score',
      description: 'Monitor your credit score and get personalized recommendations',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Secure & Trusted',
      description: 'Your financial information is protected with industry standards',
    },
  ];

  const categories = [
    { name: 'Cashback Cards', color: '#1D4ED8', link: '/cards' },
    { name: 'Travel Cards', color: '#10B981', link: '/cards' },
    { name: 'Reward Cards', color: '#F59E0B', link: '/cards' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)',
          color: 'text.primary',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}
          >
            Find the Best Credit Card for You
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <input
              type="text"
              placeholder="Search by bank or card"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2, px: 4, borderRadius: 8 }}
              onClick={() => router.push('/cards')}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#1F2937',
            }}
          >
            Why Choose Us?
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ pt: 4, pb: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ background: '#F8FAFC', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: '#1F2937',
              }}
            >
              Popular Categories
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 20px 40px ${category.color}40`,
                    },
                  }}
                  onClick={() => router.push(category.link)}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Banks Section */}
      <Box sx={{ py: 6, background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: 'primary.main' }}
          >
            Explore Cards by Bank
          </Typography>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3}>
                {banks.map((bank) => (
                <Grid item xs={6} sm={4} md={3} key={bank.id}>
                    <Box
                    sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-4px)',
                        },
                    }}
                    onClick={() => router.push(`/banks/${bank.slug}`)}
                    >
                    <img src={`${IMAGE_BASE_URL}${bank.logoUrl}`} alt={bank.name} style={{ height: 40, marginBottom: 8, objectFit: 'contain' }} />
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                        {bank.name}
                    </Typography>
                    </Box>
                </Grid>
                ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#1F2937',
            }}
          >
            Ready to Find Your Perfect Card?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/cards')}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              mt: 2
            }}
          >
            Explore All Cards
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;