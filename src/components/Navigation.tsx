import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SparklesIcon from '@mui/icons-material/AutoAwesome';

const Navigation: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Credit Cards', path: '/cards' },
    { label: 'Compare', path: '/compare' },
    { label: 'CIBIL Score', path: '/cibil' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box
            onClick={() => navigateTo('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)',
                borderRadius: '12px',
                p: 1,
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCardIcon
                sx={{
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: '-0.5px',
              }}
            >
              CardHub
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                sx={{
                  color: '#4caf50',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  position: 'relative',
                  px: 2,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: router.pathname === item.path ? '100%' : '0%',
                    height: '3px',
                    background: 'linear-gradient(90deg, #06B6D4 0%, #FFFFFF 100%)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                  '&:hover': {
                    color: '#FFFFFF',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;