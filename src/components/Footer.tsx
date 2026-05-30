import React from 'react';
import {
  Container,
  Typography,
  Link,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
        color: '#212121',
        paddingTop: '60px',
        paddingBottom: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreditCardIcon sx={{ mr: 1, fontSize: '1.5rem', color: '#34D399' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Fintech Pro
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#E0E7FF', lineHeight: 1.8 }}>
              Your trusted platform for finding and comparing the perfect credit cards.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#E0E7FF' }}>
              Products
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/cards" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
                Credit Cards
              </Link>
              <Link href="/compare" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
                Comparison
              </Link>
              <Link href="/cibil" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
                CIBIL Score
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#E0E7FF' }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
                About Us
              </Link>
              <Link href="/contact" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
                Contact
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#E0E7FF' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <FacebookIcon
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    color: '#34D399',
                  },
                }}
              />
              <TwitterIcon
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    color: '#34D399',
                  },
                }}
              />
              <LinkedInIcon
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    color: '#34D399',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#BFDBFE' }}>
            © {new Date().getFullYear()} Fintech Pro. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/terms" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
              Terms of Service
            </Link>
            <Typography sx={{ color: '#BFDBFE' }}>|</Typography>
            <Link href="/privacy" sx={{ color: '#BFDBFE', '&:hover': { color: '#FFFFFF' } }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;