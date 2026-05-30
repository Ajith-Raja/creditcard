import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Card as MuiCard,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    List,
    ListItem,
    ListItemText,
    Breadcrumbs,
} from '@mui/material';
import { CreditCard } from '../types';
import Navigation from './Navigation';
import Footer from './Footer';
import { api } from '../services/api';

interface CardDetailProps {
    card: CreditCard;
}

const CardDetail: React.FC<CardDetailProps> = ({ card }) => {
    if (!card) return <Typography variant="h6">Card not found</Typography>;

    const formatFee = (fee?: number | string) => {
        const n = Number(fee) || 0;
        return `₹ ${n}${n > 0 ? ' + GST' : ''}`;
    };

    

    const [rewardTypes, setRewardTypes] = useState<Array<{ id: string; name: string }>>([]);

    const parseStructuredRows = () => {
        const raw = (card as any).structuredFeesAndChargesJson ?? (card as any).structuredRewardsJson ?? '';
        if (!raw) return [] as any[];
        try {
            const rows = JSON.parse(raw);
            return Array.isArray(rows) ? rows : [];
        } catch (err) {
            return [] as any[];
        }
    };

    useEffect(() => {
        let mounted = true;
        (api as any).rewardTypes.getAll()
            .then((res: any) => { if (mounted) setRewardTypes(res || []); })
            .catch(() => { /* ignore */ });
        return () => { mounted = false; };
    }, []);

    const getStructuredFee = (label: string) => {
        const rows = parseStructuredRows();
        const labelLower = label.toLowerCase();
        for (const r of rows) {
            // match by rewardType name
            if (r.rewardTypeId) {
                const rt = rewardTypes.find(t => String(t.id) === String(r.rewardTypeId));
                if (rt && rt.name && rt.name.toLowerCase().includes(labelLower)) return r.value;
            }
            // match by keyType
            if (r.keyType && String(r.keyType).toLowerCase().includes(labelLower)) return r.value;
            // match by explicit label field
            if (r.label && String(r.label).toLowerCase().includes(labelLower)) return r.value;
        }
        return undefined;
    };

    const feesDetails = [
        { type: 'Joining Fee', amount: formatFee(card.joiningFee) },
        { type: 'Annual Fee', amount: formatFee(card.annualFee) },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />  
             <Box sx={{ px: { xs: 2, md: 10, lg: 20 }, py: 4, color: '#000', '&, & *': { color: '#000' } }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link href="/">Home</Link>
                <Link href="/cards">Credit Cards</Link>
                <Typography color="textPrimary">{card.name}</Typography>
            </Breadcrumbs>

            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {card.name}
                        </Typography>
                        <Typography color="text.primary" variant="h6" sx={{ mt: 1 }}>
                            {card.bankName}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            {card.description || `Apply for the best credit card of ${card.bankName}`}
                        </Typography>
                        <Typography color="primary" sx={{ mt: 1, fontWeight: 700 }}>
                            Joining Fee : {formatFee(card.joiningFee)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <MuiCard elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                            <img
                                src={card.imageUrl || '/placeholder-card.png'}
                                alt={card.name}
                                style={{ width: '100%', maxHeight: 140, objectFit: 'contain', borderRadius: 8 }}
                            />
                        </MuiCard>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Rewards & Benefits
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            component="div"
                            sx={{ overflowWrap: 'break-word', wordBreak: 'normal', lineHeight: 1.6, '&, & *': { overflowWrap: 'break-word', wordBreak: 'normal' }, '& p, & ul, & ol': { marginBlock: '0.25rem', padding: 0 } }}
                            dangerouslySetInnerHTML={{ __html: card.rewards || '-' }}
                        />
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {card.name}: Fees & Charges
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type of fee or charge</TableCell>
                                        <TableCell>Amount (Rs.)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(() => {
                                        const rows = parseStructuredRows();
                                        if (Array.isArray(rows) && rows.length > 0) {
                                            return rows.map((r: any, idx: number) => {
                                                const typeName = r.rewardTypeId ? (rewardTypes.find(t => String(t.id) === String(r.rewardTypeId))?.name ?? r.rewardTypeId) : (r.keyType ?? `Item ${idx + 1}`);
                                                const amt = r.value;
                                                const amountDisplay = isFinite(Number(amt)) ? formatFee(Number(amt)) : (amt ?? '-');
                                                return (
                                                    <TableRow key={idx}>
                                                        <TableCell>{typeName}</TableCell>
                                                        <TableCell>{amountDisplay}</TableCell>
                                                    </TableRow>
                                                );
                                            });
                                        }

                                        return feesDetails.map((fee, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{fee.type}</TableCell>
                                                <TableCell>{fee.amount}</TableCell>
                                            </TableRow>
                                        ));
                                    })()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Eligibility Criteria
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            component="div"
                            sx={{ overflowWrap: 'break-word', wordBreak: 'normal', lineHeight: 1.6, '&, & *': { overflowWrap: 'break-word', wordBreak: 'normal' }, '& p, & ul, & ol': { marginBlock: '0.25rem', padding: 0 } }}
                            dangerouslySetInnerHTML={{ __html: card.eligibilityHtml || '-' }}
                        />
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Documents Required
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            component="div"
                            sx={{ overflowWrap: 'break-word', wordBreak: 'normal', lineHeight: 1.6, '&, & *': { overflowWrap: 'break-word', wordBreak: 'normal' }, '& p, & ul, & ol': { marginBlock: '0.25rem', padding: 0 } }}
                            dangerouslySetInnerHTML={{ __html: card.documentsRequiredHtml || '-' }}
                        />
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Frequently Asked Questions
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {(() => {
                            try {
                                const items = card.faqJson ? JSON.parse(card.faqJson) : [];
                                if (Array.isArray(items) && items.length > 0) {
                                    return (
                                        <List>
                                            {items.map((it: any, idx: number) => (
                                                <ListItem key={idx} alignItems="flex-start">
                                                    <ListItemText primary={it.question} secondary={it.answer} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    );
                                }
                            } catch (err) {
                                // fall back to FaqHtml
                            }
                            return <Typography>{card.faqHtml || 'No FAQs available.'}</Typography>;
                        })()}
                    </Paper>

                    {/* <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Welcome Benefits
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography>
                            {card.welcomeBenefits ?? 'Standard welcome offers apply. Check bank website for details.'}
                        </Typography>
                    </Paper> */}

                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={1}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Apply Now
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                size="large"
                                onClick={() => window.open(card.applyLink ?? '#', '_blank')}
                            >
                                Apply on Bank Website
                            </Button>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Quick approval • Digital process
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Card other Details
                            </Typography>
                        <List dense>
                                <ListItem>
                                    <ListItemText primary="Annual Fee" secondary={formatFee(card.annualFee)} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Joining Fee" secondary={formatFee(card.joiningFee)} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Footer />
        </Box>
       
    );
};

export default CardDetail;