import React from 'react';
import { Box, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Row = { id: string; keyType: string; rewardTypeId?: string; value: string };

type Props = {
    rows: Row[];
    setRows: (r: Row[]) => void;
    rewardTypes: { id: string; name: string }[];
    onOpenManage?: () => void;
};

const KEY_OPTIONS = ['Rewards', 'Benefits'];

export default function StructuredKeyValueTable({ rows, setRows, rewardTypes, onOpenManage }: Props) {
    const addRow = () => setRows([...rows, { id: Date.now().toString(), keyType: KEY_OPTIONS[0], rewardTypeId: rewardTypes && rewardTypes.length ? rewardTypes[0].id : undefined, value: '' }]);

    const updateRow = (idx: number, patch: Partial<Row>) => {
        const copy = [...rows];
        copy[idx] = { ...copy[idx], ...patch };
        setRows(copy);
    };

    const deleteRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        const copy = [...rows];
        const t = copy[idx-1];
        copy[idx-1] = copy[idx];
        copy[idx] = t;
        setRows(copy);
    };

    const moveDown = (idx: number) => {
        if (idx === rows.length - 1) return;
        const copy = [...rows];
        const t = copy[idx+1];
        copy[idx+1] = copy[idx];
        copy[idx] = t;
        setRows(copy);
    };

    return (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
            {rows.map((r, idx) => (
                <Box key={r.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <FormControl sx={{ width: 200 }} size="small">
                        <InputLabel>Key</InputLabel>
                        <Select value={r.keyType} label="Key" onChange={(e) => updateRow(idx, { keyType: e.target.value as string })}>
                            {KEY_OPTIONS.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 240 }} size="small">
                        <InputLabel>Type</InputLabel>
                        <Select value={r.rewardTypeId || ''} label="Type" onChange={(e) => updateRow(idx, { rewardTypeId: e.target.value as string })}>
                            {rewardTypes?.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <TextField value={r.value} onChange={(e) => updateRow(idx, { value: e.target.value })} size="small" fullWidth />

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton size="small" onClick={() => moveUp(idx)}><ArrowUpwardIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => moveDown(idx)}><ArrowDownwardIcon fontSize="small" /></IconButton>
                    </Box>

                    <IconButton size="small" color="error" onClick={() => deleteRow(idx)}><DeleteIcon /></IconButton>
                </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button startIcon={<AddIcon />} onClick={addRow}>Add Row</Button>
                <Button onClick={onOpenManage}>Manage Types</Button>
            </Box>
        </Box>
    );
}
