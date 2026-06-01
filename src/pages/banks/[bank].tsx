import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button,
    CircularProgress 
} from '@mui/material';
import Navigation from '../../components/Navigation';
import { api } from '../../services/api';
import { CreditCard, Bank } from '../../types';

const BankCardsPage = () => {
  const router = useRouter();
  const { bank: bankSlug } = router.query;
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [targetBank, setTargetBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bankSlug) {
      const fetchData = async () => {
          try {
              setLoading(true);
              // 1. Get all banks to find the one matching the slug
              const allBanks: Bank[] = await api.banks.getAll();
              const foundBank = allBanks.find(b => b.slug === bankSlug || b.name.toLowerCase().replace(/\s+/g, '-') === bankSlug);
              
              if (foundBank) {
                  setTargetBank(foundBank);
                  // 2. Fetch cards for this bank
                  const bankCards = await api.cards.getAll({ bankId: foundBank.id });
                  setCards(bankCards);
              }
          } catch (err) {
              console.error('Failed to fetch bank cards:', err);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
    }
  }, [bankSlug]);

  if (!bankSlug && !loading) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : targetBank ? (
                <>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        Credit Cards from {targetBank.name}
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Table>
                        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                            <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Card Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Joining Fee</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Annual Fee</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                            <TableRow key={card.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{card.name}</TableCell>
                                <TableCell>₹ {card.joiningFee}</TableCell>
                                <TableCell>₹ {card.annualFee}</TableCell>
                                <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => router.push(`/card/${card.id}`)}
                                    sx={{ borderRadius: 1.5 }}
                                >
                                    View Details
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Typography variant="h6" textAlign="center">Bank not found.</Typography>
            )}
    </Container>
    </Box>
  );
};

export default BankCardsPage;