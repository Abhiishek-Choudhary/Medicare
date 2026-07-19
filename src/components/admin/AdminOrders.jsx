import { useEffect, useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip,
    Skeleton, Pagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Alert, FormControl, InputLabel, Select, alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import { adminListOrders, adminUpdateOrderStatus } from '../../services/api';
import { brand } from '../../theme';

const csvColumns = [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'customer', label: 'Customer', accessor: (r) => r.userId?.username || '' },
    { key: 'email', label: 'Email', accessor: (r) => r.userId?.email || '' },
    { key: 'createdAt', label: 'Placed', accessor: (r) => r.createdAt ? new Date(r.createdAt).toISOString() : '' },
    { key: 'itemCount', label: 'Items', accessor: (r) => r.items?.length || 0 },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'tax', label: 'Tax' },
    { key: 'deliveryFee', label: 'Delivery' },
    { key: 'totalAmount', label: 'Total' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'orderStatus', label: 'Order Status' },
    { key: 'requiresPrescription', label: 'Rx Required' },
    { key: 'prescriptionStatus', label: 'Rx Status' },
    { key: 'trackingId', label: 'Tracking ID' },
    { key: 'deliveryPartner', label: 'Delivery Partner' },
];

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const STATUS_OPTIONS = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
const FILTER_STATUSES = ['', 'awaiting_payment', 'awaiting_verification', 'placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

const STATUS_COLORS = {
    awaiting_payment: brand.accent,
    awaiting_verification: brand.accent,
    placed: brand.primary,
    confirmed: brand.primary,
    packed: brand.primary,
    shipped: brand.primary,
    out_for_delivery: brand.primary,
    delivered: brand.success,
    cancelled: brand.danger,
    returned: brand.danger,
};

function AdminOrders() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        adminListOrders({ status, page, limit: 20 })
            .then((res) => {
                setItems(res.data.items || []);
                setPages(res.data.pages || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [status, page]);

    useEffect(() => { load(); }, [load]);

    const openEdit = (order) => setEditing({
        _id: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.orderStatus,
        status: '',
        note: '',
        deliveryPartner: order.deliveryPartner || '',
        trackingId: order.trackingId || '',
        expectedDelivery: order.expectedDelivery ? order.expectedDelivery.slice(0, 10) : '',
    });

    const handleSave = async () => {
        if (!editing.status) { setError('Please select a new status'); return; }
        setSaving(true);
        setError('');
        try {
            await adminUpdateOrderStatus(editing._id, {
                status: editing.status,
                note: editing.note,
                deliveryPartner: editing.deliveryPartner || undefined,
                trackingId: editing.trackingId || undefined,
                expectedDelivery: editing.expectedDelivery || undefined,
            });
            setToast(`Updated ${editing.orderNumber} → ${editing.status}`);
            setTimeout(() => setToast(''), 2500);
            setEditing(null);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Medicine Orders">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Filter by status</InputLabel>
                        <Select
                            value={status}
                            label="Filter by status"
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            {FILTER_STATUSES.map((s) => (
                                <MenuItem key={s || 'all'} value={s} sx={{ textTransform: 'capitalize' }}>
                                    {s ? s.replace(/_/g, ' ') : 'All statuses'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="orders.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            {toast && (
                <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>
            )}

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={60} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Order #</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Placed</TableCell>
                                    <TableCell align="center">Items</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Payment</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No orders found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((o) => {
                                    const c = STATUS_COLORS[o.orderStatus] || brand.inkMuted;
                                    return (
                                        <TableRow key={o._id} hover>
                                            <TableCell>
                                                <Typography fontWeight={700}>{o.orderNumber}</Typography>
                                                {o.requiresPrescription && (
                                                    <Chip label={`Rx ${o.prescriptionStatus}`} size="small" sx={{
                                                        height: 18, fontSize: 10, mt: 0.4,
                                                        background: brand.accentSoft, color: brand.accent,
                                                    }} />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={600}>{o.userId?.username || 'Unknown'}</Typography>
                                                <Typography variant="caption" color={brand.inkFaint}>{o.userId?.email}</Typography>
                                            </TableCell>
                                            <TableCell>{fmt(o.createdAt)}</TableCell>
                                            <TableCell align="center">{o.items.length}</TableCell>
                                            <TableCell align="right"><Typography fontWeight={700}>{rupees(o.totalAmount)}</Typography></TableCell>
                                            <TableCell align="center">
                                                <Chip label={o.paymentStatus} size="small" sx={{ textTransform: 'capitalize' }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={o.orderStatus.replace(/_/g, ' ')}
                                                    size="small"
                                                    sx={{
                                                        textTransform: 'capitalize', fontWeight: 700,
                                                        background: alpha(c, 0.15), color: c,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" onClick={() => openEdit(o)} sx={{ color: brand.primary }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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

            {/* Edit dialog */}
            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>
                            Update Order {editing.orderNumber}
                            <Typography variant="caption" sx={{ display: 'block', color: brand.inkMuted }}>
                                Currently: {editing.currentStatus.replace(/_/g, ' ')}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                <InputLabel>New status</InputLabel>
                                <Select
                                    value={editing.status}
                                    label="New status"
                                    onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>
                                            {s.replace(/_/g, ' ')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth size="small" label="Note (customer will see this)" sx={{ mt: 2 }}
                                value={editing.note}
                                onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                                multiline rows={2}
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                                <TextField
                                    size="small" label="Delivery partner"
                                    value={editing.deliveryPartner}
                                    onChange={(e) => setEditing({ ...editing, deliveryPartner: e.target.value })}
                                />
                                <TextField
                                    size="small" label="Tracking ID"
                                    value={editing.trackingId}
                                    onChange={(e) => setEditing({ ...editing, trackingId: e.target.value })}
                                />
                            </Box>
                            <TextField
                                fullWidth size="small" type="date" label="Expected delivery"
                                InputLabelProps={{ shrink: true }} sx={{ mt: 2 }}
                                value={editing.expectedDelivery}
                                onChange={(e) => setEditing({ ...editing, expectedDelivery: e.target.value })}
                            />
                            <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 2 }}>
                                <LaunchIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                The customer will receive an email notification on save.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving…' : 'Save & Notify'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </AdminLayout>
    );
}

export default AdminOrders;
