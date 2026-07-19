import { useEffect, useState, useCallback } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Skeleton, Pagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, MenuItem, Alert, FormControl, InputLabel, Select, Switch, FormControlLabel, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import {
    listMedicines, listCategories,
    adminCreateMedicine, adminUpdateMedicine, adminDeleteMedicine, adminUpdateStock,
} from '../../services/api';
import { brand } from '../../theme';

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const csvColumns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'brand', label: 'Brand' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'composition', label: 'Composition' },
    { key: 'dosageForm', label: 'Form' },
    { key: 'strength', label: 'Strength' },
    { key: 'packSize', label: 'Pack Size' },
    { key: 'price', label: 'Price (INR)' },
    { key: 'mrp', label: 'MRP (INR)' },
    { key: 'stock', label: 'Stock' },
    { key: 'category', label: 'Category', accessor: (r) => r.category?.name || '' },
    { key: 'prescriptionRequired', label: 'Rx Required' },
];

const DOSAGE_FORMS = ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'other'];

const emptyMedicine = {
    name: '', sku: '', brand: '', manufacturer: '', description: '',
    composition: '', dosageForm: 'tablet', strength: '', packSize: '',
    price: 0, mrp: 0, stock: 0, category: '', prescriptionRequired: false,
};

function AdminMedicines() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [stockEditing, setStockEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        listCategories().then((res) => setCategories(res.data || [])).catch(() => {});
    }, []);

    const load = useCallback(() => {
        setLoading(true);
        listMedicines({ q, page, limit: 20 })
            .then((res) => {
                setItems(res.data.items || []);
                setPages(res.data.pages || 0);
                setTotal(res.data.total || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [q, page]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const openCreate = () => setEditing({ ...emptyMedicine, _new: true });
    const openEdit = (m) => setEditing({
        _id: m._id,
        name: m.name || '', sku: m.sku || '', brand: m.brand || '',
        manufacturer: m.manufacturer || '', description: m.description || '',
        composition: m.composition || '', dosageForm: m.dosageForm || 'tablet',
        strength: m.strength || '', packSize: m.packSize || '',
        price: m.price || 0, mrp: m.mrp || 0, stock: m.stock || 0,
        category: m.category?._id || m.category || '',
        prescriptionRequired: !!m.prescriptionRequired,
    });

    const saveMedicine = async () => {
        if (!editing.name || !editing.sku || editing.price == null || editing.mrp == null) {
            setError('Name, SKU, Price and MRP are required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = { ...editing };
            delete payload._id; delete payload._new;
            if (!payload.category) delete payload.category;
            if (editing._new) {
                await adminCreateMedicine(payload);
                setToast('Medicine created');
            } else {
                await adminUpdateMedicine(editing._id, payload);
                setToast('Medicine updated');
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
            await adminDeleteMedicine(confirmDelete._id);
            setToast(`${confirmDelete.name} deactivated`);
            setTimeout(() => setToast(''), 2500);
            setConfirmDelete(null);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
        } finally {
            setSaving(false);
        }
    };

    const saveStock = async () => {
        setSaving(true);
        try {
            await adminUpdateStock(stockEditing._id, Number(stockEditing.stock));
            setToast(`Stock updated for ${stockEditing.name}`);
            setTimeout(() => setToast(''), 2500);
            setStockEditing(null);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Stock update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Medicine Catalog">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by name, brand, composition…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        size="small"
                        sx={{ minWidth: 280 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                            ),
                        }}
                    />
                    <Chip label={`${total} medicines`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <ExportButton filename="medicines.csv" rows={items} columns={csvColumns} />
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                            Add medicine
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && !editing && !stockEditing && !confirmDelete && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={55} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Medicine</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">MRP</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Rx</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No medicines found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((m) => (
                                    <TableRow key={m._id} hover>
                                        <TableCell>
                                            <Typography fontWeight={700}>{m.name}</Typography>
                                            <Typography variant="caption" color={brand.inkFaint}>
                                                {m.sku} · {m.brand} · {m.packSize}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={m.category?.name || '—'} size="small" sx={{ background: brand.surfaceAlt }} />
                                        </TableCell>
                                        <TableCell align="right"><Typography fontWeight={700}>{rupees(m.price)}</Typography></TableCell>
                                        <TableCell align="right">{rupees(m.mrp)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={m.stock}
                                                size="small"
                                                onClick={() => setStockEditing({ _id: m._id, name: m.name, stock: m.stock })}
                                                sx={{
                                                    fontWeight: 700, cursor: 'pointer',
                                                    background: m.stock === 0 ? alpha(brand.danger, 0.15)
                                                        : m.stock < 20 ? alpha(brand.accent, 0.15) : alpha(brand.success, 0.15),
                                                    color: m.stock === 0 ? brand.danger : m.stock < 20 ? brand.accent : brand.success,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {m.prescriptionRequired && (
                                                <Chip label="Rx" size="small" sx={{
                                                    height: 20, background: brand.accentSoft, color: brand.accent, fontWeight: 700,
                                                }} />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => openEdit(m)} sx={{ color: brand.primary }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => setConfirmDelete(m)} sx={{ color: brand.danger }}>
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

            {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={pages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                </Box>
            )}

            {/* Create/Edit dialog */}
            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="md" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>{editing._new ? 'Add Medicine' : 'Edit Medicine'}</DialogTitle>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                <TextField label="Name *" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                />
                                <TextField label="SKU *" size="small"
                                    value={editing.sku}
                                    onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
                                />
                                <FormControl size="small">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={editing.category}
                                        label="Category"
                                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {categories.map((c) => (
                                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField label="Brand" size="small"
                                    value={editing.brand}
                                    onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                                />
                                <TextField label="Manufacturer" size="small"
                                    value={editing.manufacturer}
                                    onChange={(e) => setEditing({ ...editing, manufacturer: e.target.value })}
                                />
                                <TextField label="Composition" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.composition}
                                    onChange={(e) => setEditing({ ...editing, composition: e.target.value })}
                                />
                                <FormControl size="small">
                                    <InputLabel>Dosage form</InputLabel>
                                    <Select
                                        value={editing.dosageForm}
                                        label="Dosage form"
                                        onChange={(e) => setEditing({ ...editing, dosageForm: e.target.value })}
                                    >
                                        {DOSAGE_FORMS.map((f) => (
                                            <MenuItem key={f} value={f} sx={{ textTransform: 'capitalize' }}>{f}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField label="Strength" size="small" placeholder="500mg"
                                    value={editing.strength}
                                    onChange={(e) => setEditing({ ...editing, strength: e.target.value })}
                                />
                                <TextField label="Pack size" size="small" placeholder="10 tablets"
                                    value={editing.packSize}
                                    onChange={(e) => setEditing({ ...editing, packSize: e.target.value })}
                                />
                                <TextField label="Price (INR) *" size="small" type="number"
                                    value={editing.price}
                                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                                />
                                <TextField label="MRP (INR) *" size="small" type="number"
                                    value={editing.mrp}
                                    onChange={(e) => setEditing({ ...editing, mrp: Number(e.target.value) })}
                                />
                                <TextField label="Stock" size="small" type="number"
                                    value={editing.stock}
                                    onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                                />
                                <TextField label="Description" size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }}
                                    value={editing.description}
                                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editing.prescriptionRequired}
                                            onChange={(e) => setEditing({ ...editing, prescriptionRequired: e.target.checked })}
                                        />
                                    }
                                    label="Prescription required"
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={saveMedicine} disabled={saving}>
                                {saving ? 'Saving…' : editing._new ? 'Create' : 'Save'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Stock quick-edit */}
            <Dialog open={!!stockEditing} onClose={() => setStockEditing(null)} maxWidth="xs" fullWidth>
                {stockEditing && (
                    <>
                        <DialogTitle>
                            Update stock
                            <Typography variant="caption" sx={{ display: 'block', color: brand.inkMuted }}>
                                {stockEditing.name}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus fullWidth size="small" type="number" label="Stock quantity"
                                InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small" /></InputAdornment> }}
                                value={stockEditing.stock}
                                onChange={(e) => setStockEditing({ ...stockEditing, stock: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setStockEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={saveStock} disabled={saving}>Save</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Delete confirmation */}
            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle>Deactivate medicine?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        <b>{confirmDelete?.name}</b> will be removed from the catalog. Existing orders that reference
                        this medicine will remain unaffected. You can re-enable it later by editing.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
                        {saving ? 'Deactivating…' : 'Deactivate'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

export default AdminMedicines;
