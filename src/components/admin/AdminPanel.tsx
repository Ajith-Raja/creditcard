import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Collapse,
    IconButton,
    Divider,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    CircularProgress,
} from '@mui/material';
import dynamic from 'next/dynamic';
// `react-quill-new` doesn't expose strong TS props here; allow any to avoid prop typing errors
const ReactQuill: any = dynamic(() => import('react-quill-new'), { ssr: false });
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { api } from '../../services/api';
import { Bank, CreditCard, CardType, CardTag } from '../../types';
import { IMAGE_BASE_URL } from '../../config';
import StructuredKeyValueTable from './StructuredKeyValueTable';
import RewardTypesManager from './RewardTypesManager';

type CardForm = {
    id?: number;
    name: string;
    cardTypeId: number | '';
    bankId: number | '';
    joiningFee: string;
    annualFee: string;
    rewards: string;
    
    eligibilityHtml?: string;
    documentsRequiredHtml?: string;
    faqHtml?: string;
    tagIds: number[];
    imageUrl: string;
    applyLink?: string;
    structuredRewardsJson?: string;
};

const defaultForm: CardForm = { 
    name: '', 
    cardTypeId: '', 
    bankId: '', 
    joiningFee: '0', 
    annualFee: '0', 
    rewards: '', 
    eligibilityHtml: '',
    documentsRequiredHtml: '',
    faqHtml: '',
    tagIds: [],
    imageUrl: '',
    applyLink: ''
};

const AdminPanel: React.FC = () => {
    const [form, setForm] = useState<CardForm>(defaultForm);
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [types, setTypes] = useState<CardType[]>([]);
    const [tagsMaster, setTagsMaster] = useState<CardTag[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'warning' | 'error'>('warning');

    const [showBankDialog, setShowBankDialog] = useState(false);
    const [bankForm, setBankForm] = useState<Partial<Bank>>({ name: '', slug: '', website: '', email: '', contactNumber: '', logoUrl: '' });
    const [showTypeDialog, setShowTypeDialog] = useState(false);
    const [newType, setNewType] = useState('');
    const [showTagDialog, setShowTagDialog] = useState(false);
    const [newTag, setNewTag] = useState('');
    
    const [rewardTypes, setRewardTypes] = useState<Array<{ id: string; name: string }>>([]);
    const [structuredRows, setStructuredRows] = useState<Array<{ id: string; keyType: string; rewardTypeId?: string; value: string }>>([]);
    const [showRewardTypesManager, setShowRewardTypesManager] = useState(false);
    const [faqItems, setFaqItems] = useState<Array<{ id: string; question: string; answer: string }>>([]);
    const [expandedBankId, setExpandedBankId] = useState<number | null>(null);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        setLoading(true);
        try {
            let cardsData: any[] = [];
            let banksData: any[] = [];
            let typesData: any[] = [];
            let tagsData: any[] = [];
            let rewardTypesData: Array<{ id: string; name: string }> = [];

            try {
                cardsData = await api.cards.getAll();
                setCards(cardsData);
            } catch (err: any) {
                showSnack(err?.message || 'Failed to load cards', 'error');
                setCards([]);
            }

            try {
                banksData = await api.banks.getAll();
                setBanks(banksData);
            } catch (err: any) {
                showSnack(err?.message || 'Failed to load banks', 'error');
                setBanks([]);
            }

            try {
                typesData = await api.types.getAll();
                setTypes(typesData);
            } catch (err: any) {
                showSnack(err?.message || 'Failed to load types', 'error');
                setTypes([]);
            }

            try {
                tagsData = await api.tags.getAll();
                setTagsMaster(tagsData);
            } catch (err: any) {
                showSnack(err?.message || 'Failed to load tags', 'error');
                setTagsMaster([]);
            }

            try {
                const list = await (api as any).rewardTypes.getAll();
                rewardTypesData = list || [];
                setRewardTypes(rewardTypesData);
            } catch (err: any) {
                showSnack(err?.message || 'Failed to load reward types', 'error');
                setRewardTypes([]);
            }
        } catch (err: any) {
            showSnack(err.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnack = (msg: string, severity: 'success' | 'warning' | 'error' = 'warning') => {
        setSnackMsg(msg);
        setSnackSeverity(severity);
        setOpenSnack(true);
    };

    const handleBankLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        (api as any).upload.uploadBankLogo(file)
            .then((res: any) => {
                if (res?.url) setBankForm((s) => ({ ...s, logoUrl: res.url }));
                else showSnack('Bank logo upload failed', 'error');
            })
            .catch((err: any) => showSnack(err.message || 'Bank logo upload failed', 'error'));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // upload to backend which saves file into Next.js public/credit-cards
            api.upload.uploadCardLogo(file)
                .then((res: any) => {
                    if (res?.url) handleChange('imageUrl', res.url);
                    else showSnack('Upload failed', 'error');
                })
                .catch((err: any) => showSnack(err.message || 'Upload failed', 'error'));
        }
    };

    function handleChange<K extends keyof CardForm>(key: K, value: CardForm[K]) {
        setForm((s) => ({ ...s, [key]: value }));
    }

    // small helper to escape HTML from plain text inputs
    function escapeHtml(unsafe: string) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async function handleAddCard() {
        if (!form.name.trim() || form.bankId === '' || form.cardTypeId === '') {
            return showSnack('Please fill in required fields (Name, Bank, Type)');
        }

            try {
            // Use single rich-text editor content for rewards; fees & charges are stored as structured JSON
            const payload = {
                name: form.name,
                bankId: Number(form.bankId),
                cardTypeId: Number(form.cardTypeId),
                joiningFee: Number(form.joiningFee) || 0,
                annualFee: Number(form.annualFee) || 0,
                rewards: form.rewards || '',
                structuredRewardsJson: JSON.stringify(structuredRows || []),
                eligibilityHtml: form.eligibilityHtml || '',
                documentsRequiredHtml: form.documentsRequiredHtml || '',
                faqHtml: form.faqHtml || '',
                faqJson: JSON.stringify(faqItems || []),
                tagIds: form.tagIds,
                latePaymentFee: 0,
                foreignTransactionFeePercent: 0,
                minIncome: 0,
                minCreditScore: 0,
                imageUrl: form.imageUrl || '/placeholder-card.png',
                applyLink: form.applyLink || '',
                isActive: true
            };

            if (form.id) {
                await api.cards.update(form.id, payload);
                showSnack('Card updated successfully', 'success');
            } else {
                await api.cards.create(payload);
                showSnack('Card added successfully', 'success');
            }

            // reset form and editors (including FAQ list)
            setForm(defaultForm);
            setStructuredRows([]);
            setFaqItems([]);
            setCards(await api.cards.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    function handleEditCard(c: CreditCard) {
        setForm({
            id: c.id,
            name: c.name,
            cardTypeId: c.cardTypeId,
            bankId: c.bankId,
            joiningFee: c.joiningFee.toString(),
            annualFee: c.annualFee.toString(),
            rewards: c.rewards || '',
            eligibilityHtml: c.eligibilityHtml || '',
            documentsRequiredHtml: c.documentsRequiredHtml || '',
            faqHtml: c.faqHtml || '',
            structuredRewardsJson: c.structuredRewardsJson || '',
            tagIds: c.tags?.map(t => t.id) || [],
            imageUrl: c.imageUrl || '',
            applyLink: c.applyLink || ''
        });
        try {
            const parsed = c.structuredRewardsJson ? JSON.parse(c.structuredRewardsJson) : [];
            setStructuredRows(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
            setStructuredRows([]);
        }
        try {
            const faq = c.faqJson ? JSON.parse(c.faqJson) : [];
            setFaqItems(Array.isArray(faq) ? faq.map((x: any, i: number) => ({ id: (x.id || i.toString()), question: x.question || '', answer: x.answer || '' })) : []);
        } catch (err) {
            setFaqItems([]);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSaveBank() {
        try {
            if (bankForm.id) {
                await api.banks.update(bankForm.id, bankForm);
                showSnack('Bank updated successfully', 'success');
            } else {
                await api.banks.create(bankForm);
                showSnack('Bank added successfully', 'success');
            }
            setShowBankDialog(false);
            setBankForm({ name: '', slug: '', website: '', logoUrl: '' });
            setBanks(await api.banks.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleDeleteBank(id: number) {
        try {
            await api.banks.delete(id);
            showSnack('Bank deleted successfully', 'success');
            setBanks(await api.banks.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleAddType() {
        if (!newType.trim()) return;
        try {
            await api.types.create({ name: newType.trim() });
            setNewType('');
            setTypes(await api.types.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleDeleteType(id: number) {
        try {
            await api.types.delete(id);
            setTypes(await api.types.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleAddTag() {
        if (!newTag.trim()) return;
        try {
            await api.tags.create({ name: newTag.trim() });
            setNewTag('');
            setTagsMaster(await api.tags.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleDeleteTag(id: number) {
        try {
            await api.tags.delete(id);
            setTagsMaster(await api.tags.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    async function handleDeleteCard(id: number) {
        try {
            await api.cards.delete(id);
            showSnack('Card deleted successfully', 'success');
            setCards(await api.cards.getAll());
        } catch (err: any) {
            showSnack(err.message, 'error');
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Admin Panel (Connected to API)
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {form.id ? 'Edit Card' : 'Add New Card'}
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label="Card Name"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel id="card-type-label">Card Type</InputLabel>
                                <Select
                                    labelId="card-type-label"
                                    value={form.cardTypeId}
                                    label="Card Type"
                                    onChange={(e) => handleChange('cardTypeId', e.target.value as number)}
                                >
                                    {types.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button size="small" onClick={() => setShowTypeDialog(true)}>Manage Types</Button>
                                </Box>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="bank-select-label">Bank</InputLabel>
                                <Select
                                    labelId="bank-select-label"
                                    value={form.bankId}
                                    label="Bank"
                                    onChange={(e) => handleChange('bankId', e.target.value as number)}
                                >
                                    {banks.map((b) => (
                                        <MenuItem key={b.id} value={b.id}>
                                            {b.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button size="small" onClick={() => setShowBankDialog(true)}>Add Bank</Button>
                                </Box>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="tags-label">Tags</InputLabel>
                                <Select
                                    labelId="tags-label"
                                    multiple
                                    value={form.tagIds}
                                    onChange={(e) => handleChange('tagIds', e.target.value as number[])}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {(selected as number[]).map((tagId) => {
                                                const tag = tagsMaster.find(t => t.id === tagId);
                                                return <Chip key={tagId} label={tag?.name || tagId} size="small" />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {tagsMaster.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button size="small" onClick={() => setShowTagDialog(true)}>Manage Tags</Button>
                                </Box>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Joining Fee"
                                        type="number"
                                        value={form.joiningFee}
                                        onChange={(e) => handleChange('joiningFee', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Annual Fee"
                                        type="number"
                                        value={form.annualFee}
                                        onChange={(e) => handleChange('annualFee', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Apply Link (URL)"
                                value={form.applyLink || ''}
                                onChange={(e) => handleChange('applyLink', e.target.value)}
                                fullWidth
                            />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Eligibility Criteria
                                </Typography>
                                <ReactQuill value={form.eligibilityHtml || ''} onChange={(v: string) => handleChange('eligibilityHtml', v)} />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Documents Required
                                </Typography>
                                <ReactQuill value={form.documentsRequiredHtml || ''} onChange={(v: string) => handleChange('documentsRequiredHtml', v)} />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    FAQ
                                </Typography>
                                <Box>
                                    {faqItems.map((f, idx) => (
                                        <Box key={f.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            <TextField label={`Question ${idx + 1}`} value={f.question} onChange={(e) => setFaqItems(s => { const c = [...s]; c[idx] = { ...c[idx], question: e.target.value }; return c; })} fullWidth />
                                            <TextField label="Answer" value={f.answer} onChange={(e) => setFaqItems(s => { const c = [...s]; c[idx] = { ...c[idx], answer: e.target.value }; return c; })} fullWidth multiline />
                                            <Button color="error" onClick={() => setFaqItems(s => s.filter((_, i) => i !== idx))}>Del</Button>
                                        </Box>
                                    ))}
                                    <Box sx={{ mt: 1 }}>
                                        <Button onClick={() => setFaqItems(s => [...s, { id: Date.now().toString(), question: '', answer: '' }])}>Add FAQ</Button>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button variant="outlined" component="label">
                                    Upload Card Logo
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </Button>
                                {form.imageUrl && (
                                    <Avatar src={form.imageUrl} variant="rounded" sx={{ width: 60, height: 40 }} />
                                )}
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Rewards (Rich Text)
                                </Typography>
                                <ReactQuill value={form.rewards || ''} onChange={(v: string) => handleChange('rewards', v)} />

                                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
                                    Fees & Charges (Structured key-value)
                                </Typography>
                                <StructuredKeyValueTable rows={structuredRows} setRows={setStructuredRows} rewardTypes={rewardTypes} onOpenManage={() => setShowRewardTypesManager(true)} />
                                <RewardTypesManager
                                    open={showRewardTypesManager}
                                    onClose={async () => {
                                        setShowRewardTypesManager(false);
                                        const list = await (api as any).rewardTypes.getAll();
                                        setRewardTypes(list || []);
                                    }}
                                    onChanged={async () => {
                                        const list = await (api as any).rewardTypes.getAll();
                                        setRewardTypes(list || []);
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button variant="contained" color="primary" onClick={handleAddCard}>
                                    {form.id ? 'Update Card' : 'Add Card'}
                                </Button>
                                <Button variant="outlined" onClick={() => { setForm(defaultForm); setStructuredRows([]); setFaqItems([]); }}>
                                    {form.id ? 'Cancel Edit' : 'Reset'}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Existing Cards (by Bank)
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {banks
                                .filter(b => cards.some(c => Number(c.bankId) === Number(b.id)))
                                .map((b) => (
                                <React.Fragment key={b.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={`${IMAGE_BASE_URL}${b.logoUrl}`} alt={b.name} />
                                        </ListItemAvatar>
                                        <ListItemText primary={b.name} secondary={`${b.website} • ${cards.filter(c => Number(c.bankId) === Number(b.id)).length} cards`} />
                                        <IconButton edge="end" onClick={() => setExpandedBankId(expandedBankId === b.id ? null : b.id)}>
                                            {expandedBankId === b.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </ListItem>

                                    <Collapse in={expandedBankId === b.id} timeout="auto" unmountOnExit>
                                        <List disablePadding>
                                            {cards.filter(c => Number(c.bankId) === Number(b.id)).map((card) => (
                                                <ListItem key={card.id} sx={{ pl: 4 }} secondaryAction={
                                                    <Box>
                                                        <Button size="small" color="primary" onClick={() => handleEditCard(card)}>Edit</Button>
                                                        <Button size="small" color="error" onClick={() => handleDeleteCard(card.id)}>Del</Button>
                                                    </Box>
                                                }>
                                                    <ListItemText primary={card.name} secondary={`${card.cardTypeName} • Joining: ₹${card.joiningFee}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>

                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                    
                    <Paper sx={{ p: 2 }} elevation={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Banks</Typography>
                            <Button size="small" onClick={() => { setBankForm({ name: '', slug: '', website: '', logoUrl: '' }); setShowBankDialog(true); }}>Add Bank</Button>
                        </Box>
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {banks.map((b) => (
                                <React.Fragment key={b.id}>
                                    <ListItem button onClick={() => setExpandedBankId(expandedBankId === b.id ? null : b.id)} secondaryAction={
                                        <Box>
                                            <Button size="small" onClick={() => { setBankForm(b); setShowBankDialog(true); }}>Edit</Button>
                                            <Button size="small" color="error" onClick={() => handleDeleteBank(b.id)}>Del</Button>
                                        </Box>
                                    }>
                                        <ListItemAvatar>
                                            <Avatar src={`${IMAGE_BASE_URL}${b.logoUrl}`} alt={b.name} />
                                        </ListItemAvatar>
                                        <ListItemText primary={b.name} secondary={b.website} />
                                    </ListItem>
                                    {expandedBankId === b.id && (
                                        <List sx={{ pl: 4 }}>
                                            {cards.filter(c => Number(c.bankId) === Number(b.id)).map(card => (
                                                <ListItem key={card.id}>
                                                    <ListItemText primary={card.name} secondary={`${card.cardTypeName} • Joining: ₹${card.joiningFee}`} />
                                                    <Box>
                                                        <Button size="small" color="primary" onClick={() => handleEditCard(card)}>Edit</Button>
                                                        <Button size="small" color="error" onClick={() => handleDeleteCard(card.id)}>Del</Button>
                                                    </Box>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bank Dialog */}
            <Dialog open={showBankDialog} onClose={() => setShowBankDialog(false)}>
                <DialogTitle>{bankForm?.id ? 'Edit Bank' : 'Add Bank'}</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Bank Name" value={bankForm.name} onChange={(e) => setBankForm((s: any) => ({ ...s, name: e.target.value }))} fullWidth />
                        <TextField label="Slug" value={bankForm.slug} onChange={(e) => setBankForm((s: any) => ({ ...s, slug: e.target.value }))} fullWidth />
                        <TextField label="Website" value={bankForm.website} onChange={(e) => setBankForm((s: any) => ({ ...s, website: e.target.value }))} fullWidth />
                        <TextField label="Email" value={bankForm.email} onChange={(e) => setBankForm((s: any) => ({ ...s, email: e.target.value }))} fullWidth />
                        <TextField label="Contact Number" value={bankForm.contactNumber} onChange={(e) => setBankForm((s: any) => ({ ...s, contactNumber: e.target.value }))} fullWidth />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button variant="outlined" component="label">
                                Upload Logo
                                <input type="file" hidden accept="image/*" onChange={handleBankLogoUpload} />
                            </Button>
                            <TextField label="Logo URL" value={bankForm.logoUrl} onChange={(e) => setBankForm((s: any) => ({ ...s, logoUrl: e.target.value }))} fullWidth />
                            {bankForm.logoUrl && <Avatar src={bankForm.logoUrl} alt="logo" />}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBankDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveBank} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Type Dialog */}
            <Dialog open={showTypeDialog} onClose={() => setShowTypeDialog(false)}>
                <DialogTitle>Manage Card Types</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="New Type" value={newType} onChange={(e) => setNewType(e.target.value)} fullWidth />
                        <Button onClick={handleAddType} variant="contained" disabled={!newType.trim()}>Add Type</Button>
                        <Divider />
                        <List>
                            {types.map((t) => (
                                <ListItem key={t.id} secondaryAction={
                                    <Button size="small" color="error" onClick={() => handleDeleteType(t.id)}>Delete</Button>
                                }>
                                    <ListItemText primary={t.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Tag Dialog */}
            <Dialog open={showTagDialog} onClose={() => setShowTagDialog(false)}>
                <DialogTitle>Manage Tags</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="New Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} fullWidth />
                        <Button onClick={handleAddTag} variant="contained" disabled={!newTag.trim()}>Add Tag</Button>
                        <Divider />
                        <List>
                            {tagsMaster.map((t) => (
                                <ListItem key={t.id} secondaryAction={
                                    <Button size="small" color="error" onClick={() => handleDeleteTag(t.id)}>Delete</Button>
                                }>
                                    <ListItemText primary={t.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Snackbar open={openSnack} autoHideDuration={4000} onClose={() => setOpenSnack(false)}>
                <Alert severity={snackSeverity} onClose={() => setOpenSnack(false)}>{snackMsg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminPanel;