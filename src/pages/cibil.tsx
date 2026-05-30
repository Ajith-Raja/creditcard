import React from 'react';
import { Container, Box } from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CIBILScore from '../components/CIBILScore';

const CIBILPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <CIBILScore />
      </Container>

      <Footer />
    </Box>
  );
};

export default CIBILPage;