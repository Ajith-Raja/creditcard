import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../../services/api';

type Props = {
    open: boolean;
    onClose: () => void;
    onChanged?: () => void;
};

export default function RewardTypesManager({ open, onClose, onChanged }: Props) {
    const [items, setItems] = useState<Array<{ id: string; name: string }>>([]);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        if (open) load();
    }, [open]);

    const load = async () => {
        try {
            const res = await (api as any).rewardTypes.getAll();
            setItems(res || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await (api as any).rewardTypes.create({ name: newName.trim() });
        setNewName('');
        await load();
        onChanged?.();
    };

    const startEdit = (it: { id: string; name: string }) => {
        setEditingId(it.id);
        setEditingName(it.name);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        await (api as any).rewardTypes.update(editingId, { name: editingName.trim() });
        setEditingId(null);
        setEditingName('');
        await load();
        onChanged?.();
    };

    const handleDelete = async (id: string) => {
        await (api as any).rewardTypes.delete(id);
        await load();
        onChanged?.();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Manage Reward Type Options</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1}>
                        <TextField label="New Option" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth />
                        <Button variant="contained" onClick={handleAdd} disabled={!newName.trim()}>Add</Button>
                    </Stack>

                    <List>
                        {items.map(it => (
                            <ListItem key={it.id} secondaryAction={
                                editingId === it.id ? (
                                    <IconButton edge="end" onClick={saveEdit}><SaveIcon /></IconButton>
                                ) : (
                                    <>
                                        <IconButton edge="end" onClick={() => startEdit(it)}><EditIcon /></IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(it.id)}><DeleteIcon /></IconButton>
                                    </>
                                )
                            }>
                                {editingId === it.id ? (
                                    <TextField value={editingName} onChange={(e) => setEditingName(e.target.value)} fullWidth />
                                ) : (
                                    <ListItemText primary={it.name} />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
