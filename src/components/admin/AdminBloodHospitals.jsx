import { useCallback, useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Skeleton, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, Alert, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import {
    adminListHospitals, adminCreateHospital, adminUpdateHospital, adminDeleteHospital,
} from '../../services/api';
import { brand } from '../../theme';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyHospital = {
    name: '', type: 'hospital', address: '', city: '', state: '', pincode: '',
    phone: '', emergencyPhone: '', email: '', website: '',
    bloodGroupsAvailable: [], is24x7: false, notes: '', isActive: true,
};

const csvColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
    { key: 'phone', label: 'Phone' },
    { key: 'emergencyPhone', label: 'Emergency' },
    { key: 'email', label: 'Email' },
    { key: 'website', label: 'Website' },
    { key: 'bloodGroupsAvailable', label: 'Groups', accessor: (r) => (r.bloodGroupsAvailable || []).join('; ') },
    { key: 'is24x7', label: '24x7' },
];

function AdminBloodHospitals() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        adminListHospitals({ city: q })
            .then((res) => setItems(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [q]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const openCreate = () => setEditing({ ...emptyHospital, _new: true });
    const openEdit = (h) => setEditing({ ...emptyHospital, ...h });

    const toggleBloodGroup = (g) => {
        setEditing((e) => ({
            ...e,
            bloodGroupsAvailable: e.bloodGroupsAvailable.includes(g)
                ? e.bloodGroupsAvailable.filter((x) => x !== g)
                : [...e.bloodGroupsAvailable, g],
        }));
    };

    const save = async () => {
        if (!editing.name || !editing.address || !editing.city || !editing.state || !editing.phone) {
            setError('Name, address, city, state and phone are required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = { ...editing };
            delete payload._new;
            delete payload._id;
            if (editing._new) {
                await adminCreateHospital(payload);
                setToast('Hospital added');
            } else {
                await adminUpdateHospital(editing._id, payload);
                setToast('Hospital updated');
            }
            setEditing(null);
            load();
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await adminDeleteHospital(confirmDelete._id);
            setToast(`${confirmDelete.name} deleted`);
            setTimeout(() => setToast(''), 2500);
            setConfirmDelete(null);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Blood Bank · Hospitals">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by city…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        size="small"
                        sx={{ minWidth: 260 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                        }}
                    />
                    <Chip label={`${items.length} entries`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <ExportButton filename="hospitals.csv" rows={items} columns={csvColumns} />
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                            Add hospital
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={60} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Groups</TableCell>
                                    <TableCell align="center">24×7</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No hospitals yet</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((h) => (
                                    <TableRow key={h._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocalHospitalIcon fontSize="small" sx={{ color: brand.primary }} />
                                                <Box>
                                                    <Typography fontWeight={700}>{h.name}</Typography>
                                                    <Typography variant="caption" color={brand.inkFaint} sx={{ textTransform: 'capitalize' }}>
                                                        {h.type.replace('_', ' ')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{h.city}, {h.state}</Typography>
                                            <Typography variant="caption" color={brand.inkFaint}>{h.address}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{h.phone}</Typography>
                                            {h.emergencyPhone && (
                                                <Typography variant="caption" color={brand.danger}>
                                                    Emergency: {h.emergencyPhone}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, maxWidth: 180 }}>
                                                {(h.bloodGroupsAvailable || []).map((g) => (
                                                    <Chip key={g} label={g} size="small" sx={{
                                                        height: 18, fontSize: 10, fontWeight: 700,
                                                        background: alpha(brand.danger, 0.1), color: brand.danger,
                                                    }} />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {h.is24x7 ? (
                                                <Chip label="24×7" size="small" sx={{
                                                    fontWeight: 700,
                                                    background: alpha(brand.success, 0.15), color: brand.success,
                                                }} />
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => openEdit(h)} sx={{ color: brand.primary }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => setConfirmDelete(h)} sx={{ color: brand.danger }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>

            {/* Create/edit dialog */}
            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="md" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>{editing._new ? 'Add Hospital / Blood Bank' : 'Edit Hospital'}</DialogTitle>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                <TextField label="Name *" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                />
                                <FormControl size="small">
                                    <InputLabel>Type</InputLabel>
                                    <Select value={editing.type} label="Type"
                                        onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                                    >
                                        <MenuItem value="hospital">Hospital</MenuItem>
                                        <MenuItem value="blood_bank">Blood bank</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField label="Phone *" size="small"
                                    value={editing.phone}
                                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                                />
                                <TextField label="Address *" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.address}
                                    onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                                />
                                <TextField label="City *" size="small"
                                    value={editing.city}
                                    onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                                />
                                <TextField label="State *" size="small"
                                    value={editing.state}
                                    onChange={(e) => setEditing({ ...editing, state: e.target.value })}
                                />
                                <TextField label="Pincode" size="small"
                                    value={editing.pincode}
                                    onChange={(e) => setEditing({ ...editing, pincode: e.target.value })}
                                />
                                <TextField label="Emergency phone" size="small"
                                    value={editing.emergencyPhone}
                                    onChange={(e) => setEditing({ ...editing, emergencyPhone: e.target.value })}
                                />
                                <TextField label="Email" size="small"
                                    value={editing.email}
                                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                                />
                                <TextField label="Website" size="small"
                                    value={editing.website}
                                    onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                                />
                                <TextField label="Notes" size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }}
                                    value={editing.notes}
                                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                                />
                                <Box sx={{ gridColumn: '1 / -1' }}>
                                    <Typography variant="caption" fontWeight={700}>Blood groups typically available</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.6 }}>
                                        {BLOOD_GROUPS.map((g) => {
                                            const active = editing.bloodGroupsAvailable.includes(g);
                                            return (
                                                <Chip
                                                    key={g}
                                                    label={g}
                                                    onClick={() => toggleBloodGroup(g)}
                                                    sx={{
                                                        fontWeight: 700, cursor: 'pointer',
                                                        background: active ? brand.danger : alpha(brand.danger, 0.1),
                                                        color: active ? '#fff' : brand.danger,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editing.is24x7}
                                            onChange={(e) => setEditing({ ...editing, is24x7: e.target.checked })}
                                        />
                                    }
                                    label="Open 24×7"
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={save} disabled={saving}>
                                {saving ? 'Saving…' : editing._new ? 'Create' : 'Save'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle>Delete hospital?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        <b>{confirmDelete?.name}</b> will be permanently removed.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
                        {saving ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

export default AdminBloodHospitals;
