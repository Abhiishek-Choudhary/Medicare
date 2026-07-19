import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box, Paper, Typography, Tabs, Tab, Chip, Skeleton, Alert, Avatar, Divider, alpha,
    Table, TableHead, TableRow, TableCell, TableBody, Button, FormControl, InputLabel, Select, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import { adminGetCustomer, adminUpdateCustomer, adminDeleteCustomer } from '../../services/api';
import { brand } from '../../theme';

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

function Stat({ label, value, sub, color = brand.primary }) {
    return (
        <Paper sx={{ p: 2, minWidth: 160 }}>
            <Typography variant="caption" color={brand.inkMuted} fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={800} color={color} sx={{ mt: 0.3 }}>
                {value}
            </Typography>
            {sub && <Typography variant="caption" color={brand.inkFaint}>{sub}</Typography>}
        </Paper>
    );
}

function AdminCustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const load = () => {
        adminGetCustomer(id)
            .then((res) => setData(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    };

    useEffect(load, [id]);

    const toggleActive = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await adminUpdateCustomer(id, { isActive: !data.user.isActive });
            setData({ ...data, user: res.data });
            setToast(res.data.isActive ? 'Customer enabled' : 'Customer disabled');
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const changeRole = async (role) => {
        setSaving(true);
        setError('');
        try {
            const res = await adminUpdateCustomer(id, { role });
            setData({ ...data, user: res.data });
            setToast(`Role changed to ${role}`);
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await adminDeleteCustomer(id);
            navigate('/admin/customers');
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
            setSaving(false);
            setConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Customer">
                <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={400} />
            </AdminLayout>
        );
    }

    if (!data) {
        return (
            <AdminLayout title="Customer">
                <Alert severity="error">{error || 'Customer not found'}</Alert>
            </AdminLayout>
        );
    }

    const { user, summary, appointments, orders, prescriptions } = data;

    // Build combined timeline
    const timeline = [
        ...appointments.map((a) => ({
            type: 'appointment',
            at: a.createdAt || a.date,
            title: `Booked appointment with Dr. ${a.doctorName}`,
            detail: `${new Date(a.date).toLocaleString('en-IN')} · ${a.status}`,
        })),
        ...orders.map((o) => ({
            type: 'order',
            at: o.createdAt,
            title: `Placed order ${o.orderNumber}`,
            detail: `${o.items.length} item(s) · ${rupees(o.totalAmount)} · ${o.orderStatus}`,
        })),
        ...prescriptions.map((p) => ({
            type: 'prescription',
            at: p.createdAt,
            title: `Uploaded prescription`,
            detail: `Status: ${p.status}`,
        })),
    ]
        .filter((e) => e.at)
        .sort((a, b) => new Date(b.at) - new Date(a.at));

    return (
        <AdminLayout title={`Customer · ${user.username}`}>
            <Button component={Link} to="/admin/customers" size="small" sx={{ mb: 2 }}>
                ← Back to customers
            </Button>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Avatar sx={{
                        width: 72, height: 72, fontSize: 28, fontWeight: 800,
                        background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                        opacity: user.isActive === false ? 0.5 : 1,
                    }}>
                        {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h5" fontWeight={800}>{user.username}</Typography>
                            {user.isActive === false && (
                                <Chip label="Disabled" size="small" color="error" sx={{ fontWeight: 700 }} />
                            )}
                        </Box>
                        <Typography variant="body2" color={brand.inkMuted}>{user.email}</Typography>
                        {user.phone && <Typography variant="body2" color={brand.inkMuted}>{user.phone}</Typography>}
                        <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 0.5 }}>
                            Member since {fmt(user.createdAt)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={user.role}
                                label="Role"
                                disabled={saving}
                                onChange={(e) => changeRole(e.target.value)}
                            >
                                <MenuItem value="customer">Customer</MenuItem>
                                <MenuItem value="pharmacist">Pharmacist</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                color={user.isActive === false ? 'success' : 'warning'}
                                startIcon={user.isActive === false ? <CheckCircleIcon /> : <BlockIcon />}
                                onClick={toggleActive}
                                disabled={saving}
                            >
                                {user.isActive === false ? 'Enable' : 'Disable'}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setConfirmDelete(true)}
                                disabled={saving}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Stat label="Appointments" value={summary.totalAppointments} color={brand.accent} />
                    <Stat label="Medicine Orders" value={summary.totalOrders} color={brand.primary} />
                    <Stat label="Prescriptions" value={summary.totalPrescriptions} color={brand.accent} />
                    <Stat label="Pharmacy Spent" value={rupees(summary.pharmacySpent)} color={brand.success} />
                    <Stat label="Consult Spent" value={rupees(summary.consultSpent)} color={brand.success} />
                    <Stat label="Total Spent" value={rupees(summary.totalSpent)} color={brand.primary} />
                </Box>
            </Paper>

            <Paper>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ borderBottom: `1px solid ${brand.border}` }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<HistoryIcon />} iconPosition="start" label={`Activity (${timeline.length})`} />
                    <Tab icon={<EventNoteIcon />} iconPosition="start" label={`Appointments (${appointments.length})`} />
                    <Tab icon={<ReceiptLongIcon />} iconPosition="start" label={`Orders (${orders.length})`} />
                    <Tab icon={<DescriptionIcon />} iconPosition="start" label={`Prescriptions (${prescriptions.length})`} />
                </Tabs>

                <Box sx={{ p: 2.5 }}>
                    {tab === 0 && <ActivityTab events={timeline} />}
                    {tab === 1 && <AppointmentsTable rows={appointments} />}
                    {tab === 2 && <OrdersTable rows={orders} />}
                    {tab === 3 && <PrescriptionsTable rows={prescriptions} />}
                </Box>
            </Paper>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Delete customer permanently?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        This will permanently remove <b>{user.username}</b>'s account. Their orders,
                        appointments, and prescriptions will remain in the database as historical records.
                        This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
                        {saving ? 'Deleting…' : 'Delete permanently'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

const typeMeta = {
    order:        { color: brand.primary, label: 'Order' },
    appointment:  { color: brand.success, label: 'Appointment' },
    prescription: { color: brand.accent,  label: 'Prescription' },
};

function ActivityTab({ events }) {
    if (events.length === 0) return <Empty text="No activity yet." />;
    return events.map((e, i) => {
        const meta = typeMeta[e.type];
        return (
            <Box key={i} sx={{
                display: 'flex', gap: 2, py: 1.5,
                borderBottom: `1px solid ${brand.border}`,
                '&:last-of-type': { borderBottom: 'none' },
            }}>
                <Chip
                    label={meta.label}
                    size="small"
                    sx={{
                        background: alpha(meta.color, 0.15), color: meta.color,
                        fontWeight: 700, minWidth: 100,
                    }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700}>{e.title}</Typography>
                    <Typography variant="caption" color={brand.inkMuted}>{e.detail}</Typography>
                    <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block' }}>
                        {fmt(e.at)}
                    </Typography>
                </Box>
            </Box>
        );
    });
}

function AppointmentsTable({ rows }) {
    if (rows.length === 0) return <Empty text="No appointments." />;
    return (
        <Table>
            <TableHead sx={{ background: brand.surfaceAlt }}>
                <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell align="right">Fee</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((a) => (
                    <TableRow key={a._id}>
                        <TableCell><Typography fontWeight={600}>Dr. {a.doctorName}</Typography></TableCell>
                        <TableCell>{fmt(a.date)}</TableCell>
                        <TableCell align="right">{a.fee ? rupees(a.fee) : '—'}</TableCell>
                        <TableCell align="center">{a.rating ? `★ ${a.rating}` : '—'}</TableCell>
                        <TableCell align="center">
                            <Chip label={a.status} size="small" sx={{ textTransform: 'capitalize' }} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function OrdersTable({ rows }) {
    if (rows.length === 0) return <Empty text="No medicine orders." />;
    return (
        <Table>
            <TableHead sx={{ background: brand.surfaceAlt }}>
                <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Payment</TableCell>
                    <TableCell align="center">Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((o) => (
                    <TableRow key={o._id}>
                        <TableCell>
                            <Typography fontWeight={700}>{o.orderNumber}</Typography>
                        </TableCell>
                        <TableCell>{fmt(o.createdAt)}</TableCell>
                        <TableCell align="center">{o.items.length}</TableCell>
                        <TableCell align="right"><Typography fontWeight={700}>{rupees(o.totalAmount)}</Typography></TableCell>
                        <TableCell align="center">
                            <Chip label={o.paymentStatus} size="small" sx={{ textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell align="center">
                            <Chip label={o.orderStatus.replace(/_/g, ' ')} size="small" sx={{ textTransform: 'capitalize' }} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function PrescriptionsTable({ rows }) {
    if (rows.length === 0) return <Empty text="No prescriptions uploaded." />;
    return (
        <Table>
            <TableHead sx={{ background: brand.surfaceAlt }}>
                <TableRow>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Verified at</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((p) => (
                    <TableRow key={p._id}>
                        <TableCell>{fmt(p.createdAt)}</TableCell>
                        <TableCell>
                            {p.fileUrl ? (
                                <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ color: brand.primary }}>
                                    {p.originalName || 'View file'}
                                </a>
                            ) : '—'}
                        </TableCell>
                        <TableCell align="center">
                            <Chip label={p.status} size="small" sx={{ textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell align="center">{fmt(p.verifiedAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function Empty({ text }) {
    return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
            <PersonIcon sx={{ fontSize: 48, color: brand.inkFaint, opacity: 0.5 }} />
            <Typography color={brand.inkMuted}>{text}</Typography>
        </Box>
    );
}

export default AdminCustomerDetail;
