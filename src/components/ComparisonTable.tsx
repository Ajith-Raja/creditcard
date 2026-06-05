import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { CreditCard } from '../types';

interface ComparisonTableProps {
  cards: CreditCard[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ cards }) => {
  const comparisonFields = [
    { label: 'Annual Fee', key: 'annualFee' },
    { label: 'Joining Fee', key: 'joiningFee' },
    { label: 'Welcome Bonus', key: 'welcomeBenefits' },
    { label: 'Rewards', key: 'rewards' },
    { label: 'Min Income', key: 'minIncome' },
    { label: 'Min Credit Score', key: 'minCreditScore' },
    { label: 'Features', key: 'features' },
  ];

  const cardColumnWidth = cards.length > 0 ? Math.floor(100 / cards.length) : 100;

  const formatFee = (v: any) => {
    const n = Number(v) || 0;
    return n === 0 ? 'Free' : `₹${n}`;
  };

  const getValue = (card: CreditCard, key: string) => {
    switch (key) {
      case 'annualFee':
        return formatFee(card.annualFee);
      case 'joiningFee':
        return formatFee(card.joiningFee);
      case 'welcomeBenefits':
        return card.welcomeBenefits || '-';
      case 'rewards':
        return card.rewards ? <div dangerouslySetInnerHTML={{ __html: card.rewards }} /> : '-';
      case 'minIncome':
        return card.minIncome ? `₹${card.minIncome}` : '-';
      case 'minCreditScore':
        return card.minCreditScore ?? '-';
      case 'features':
        return Array.isArray((card as any).features) ? (card as any).features.join(', ') : '-';
      default:
        return '-';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160 }} />
            {cards.map((card) => (
              <TableCell
                key={card.id}
                align="center"
                sx={{
                  width: `${cardColumnWidth}%`,
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <img src={card.imageUrl || '/placeholder-card.png'} alt={card.name} style={{ width: 80, height: 48, objectFit: 'contain' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{card.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{card.bankName}</Typography>
                  <Button variant="contained" size="small" color="primary" href={card.applyLink || '#'} target="_blank" sx={{ mt: 1 }}>Apply</Button>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {comparisonFields.map((field) => (
            <TableRow key={field.key}>
              <TableCell sx={{ fontWeight: 700 }}>{field.label}</TableCell>
              {cards.map((card) => (
                <TableCell
                  key={card.id}
                  sx={{
                    color: '#374151',
                    fontSize: '0.95rem',
                    width: `${cardColumnWidth}%`,
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getValue(card, field.key)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;