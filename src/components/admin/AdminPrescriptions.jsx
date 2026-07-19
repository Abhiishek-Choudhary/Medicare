import { useEffect, useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Chip, Skeleton, Alert, IconButton, Divider, alpha,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import { adminListPendingPrescriptions, adminVerifyPrescription } from '../../services/api';
import { brand } from '../../theme';

const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const BASE_URL = 'https://medicare2-0.onrender.com';
const fullUrl = (path) => path?.startsWith('http') ? path : `${BASE_URL}${path}`;

const csvColumns = [
    { key: 'createdAt', label: 'Uploaded', accessor: (r) => r.createdAt ? new Date(r.createdAt).toISOString() : '' },
    { key: 'customer', label: 'Customer', accessor: (r) => r.userId?.username || '' },
    { key: 'email', label: 'Email', accessor: (r) => r.userId?.email || '' },
    { key: 'originalName', label: 'File' },
    { key: 'status', label: 'Status' },
];

function AdminPrescriptions() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [rejecting, setRejecting] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        adminListPendingPrescriptions()
            .then((res) => setItems(res.data || []))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(load, [load]);

    const verify = async (id, action, reason) => {
        setSaving(true);
        try {
            await adminVerifyPrescription(id, { action, reason });
            setToast(action === 'verify' ? 'Prescription verified' : 'Prescription rejected');
            setTimeout(() => setToast(''), 2500);
            load();
            setRejecting(null);
        } catch (e) {
            setError(e?.response?.data?.message || 'Action failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Prescription Queue">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                        label={`${items.length} pending`}
                        sx={{
                            fontWeight: 700,
                            background: alpha(brand.accent, 0.15), color: brand.accent,
                        }}
                    />
                    <Typography variant="body2" color={brand.inkMuted}>
                        Review each uploaded prescription and approve or reject.
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="pending-prescriptions.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={160} sx={{ mb: 2 }} />
                ))
            ) : items.length === 0 ? (
                <Paper sx={{
                    textAlign: 'center', py: 8,
                    border: `1px dashed ${brand.border}`,
                }}>
                    <DescriptionIcon sx={{ fontSize: 72, color: brand.inkFaint, mb: 2 }} />
                    <Typography variant="h6" fontWeight={700}>No prescriptions pending</Typography>
                    <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 1 }}>
                        You're all caught up.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{
                    display: 'grid', gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                }}>
                    {items.map((p) => (
                        <Paper key={p._id} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography fontWeight={800}>{p.userId?.username || 'Unknown'}</Typography>
                                    <Typography variant="caption" color={brand.inkMuted}>{p.userId?.email}</Typography>
                                </Box>
                                <Chip
                                    label="Pending"
                                    size="small"
                                    sx={{ background: alpha(brand.accent, 0.15), color: brand.accent, fontWeight: 700 }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{
                                    width: 60, height: 60, borderRadius: 2,
                                    background: brand.primarySoft,
                                    display: 'grid', placeItems: 'center',
                                    color: brand.primary,
                                }}>
                                    <DescriptionIcon />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={700} noWrap>
                                        {p.originalName || 'Prescription file'}
                                    </Typography>
                                    <Typography variant="caption" color={brand.inkFaint}>
                                        Uploaded {fmt(p.createdAt)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    component="a"
                                    href={fullUrl(p.fileUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ color: brand.primary }}
                                >
                                    <OpenInNewIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => verify(p._id, 'verify')}
                                    disabled={saving}
                                >
                                    Verify
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setRejecting(p)}
                                    disabled={saving}
                                >
                                    Reject
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            {/* Reject reason dialog */}
            <Dialog open={!!rejecting} onClose={() => setRejecting(null)} maxWidth="xs" fullWidth>
                {rejecting && (
                    <>
                        <DialogTitle>Reject prescription</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Uploaded by <b>{rejecting.userId?.username}</b>. Please provide a reason
                                that will be shown to the customer.
                            </Typography>
                            <TextField
                                autoFocus fullWidth multiline rows={3}
                                label="Reason for rejection"
                                value={rejecting._reason || ''}
                                onChange={(e) => setRejecting({ ...rejecting, _reason: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setRejecting(null)}>Cancel</Button>
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => verify(rejecting._id, 'reject', rejecting._reason)}
                                disabled={saving || !rejecting._reason}
                            >
                                {saving ? 'Rejecting…' : 'Reject'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </AdminLayout>
    );
}

export default AdminPrescriptions;
