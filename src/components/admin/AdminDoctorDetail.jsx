import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box, Paper, Typography, Tabs, Tab, Chip, Skeleton, Alert, Avatar, Divider,
    Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Switch, FormControlLabel,
    Dialog, DialogTitle, DialogContent, DialogActions, alpha,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import DoctorAvatar from '../DoctorAvatar';
import { adminGetDoctor, adminUpdateDoctor, adminDeleteDoctor } from '../../services/api';
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

function AdminDoctorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const load = () => {
        adminGetDoctor(id)
            .then((res) => setData(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    };

    useEffect(load, [id]);

    const openEdit = () => setEditing({
        title: data.doctor.title || '',
        category: data.doctor.category || '',
        fee: data.doctor.fee || 0,
        time: data.doctor.time || 1,
        available: data.doctor.available !== false,
        url: data.doctor.url || '',
    });

    const toggleAvailable = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await adminUpdateDoctor(id, { available: !data.doctor.available });
            setData({ ...data, doctor: res.data });
            setToast(res.data.available ? 'Doctor marked available' : 'Doctor marked unavailable');
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const saveEdit = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await adminUpdateDoctor(id, editing);
            setData({ ...data, doctor: res.data });
            setEditing(null);
            setToast('Doctor updated');
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
            await adminDeleteDoctor(id);
            navigate('/admin/doctors');
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
            setSaving(false);
            setConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Doctor">
                <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={400} />
            </AdminLayout>
        );
    }

    if (!data) {
        return (
            <AdminLayout title="Doctor">
                <Alert severity="error">{error || 'Doctor not found'}</Alert>
            </AdminLayout>
        );
    }

    const { doctor, summary, appointments, ratings } = data;

    return (
        <AdminLayout title={`Doctor · ${doctor.title}`}>
            <Button component={Link} to="/admin/doctors" size="small" sx={{ mb: 2 }}>
                ← Back to doctors
            </Button>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <DoctorAvatar
                            src={doctor.url}
                            name={doctor.title}
                            variant="circle"
                            size={80}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h5" fontWeight={800}>{doctor.title}</Typography>
                        <Chip label={doctor.category} size="small" sx={{ mt: 0.5, background: brand.surfaceAlt }} />
                        <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 0.5 }}>
                            Fee: {rupees(doctor.fee)} · Slot: {doctor.time} hr(s)
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                        <Chip
                            label={doctor.available === false ? 'Unavailable' : 'Available'}
                            color={doctor.available === false ? 'error' : 'success'}
                            sx={{ fontWeight: 700 }}
                            onClick={toggleAvailable}
                            disabled={saving}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={openEdit} disabled={saving}>
                                Edit
                            </Button>
                            <Button
                                size="small" variant="outlined" color="error"
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
                    <Stat label="Total Appointments" value={summary.totalAppointments} color={brand.primary} />
                    <Stat label="Scheduled" value={summary.scheduled} color={brand.primary} />
                    <Stat label="Cancelled" value={summary.cancelled} color={brand.danger} />
                    <Stat label="Revenue" value={rupees(summary.revenue)} color={brand.success} />
                    <Stat
                        label="Avg Rating"
                        value={summary.avgRating ? `★ ${summary.avgRating}` : '—'}
                        sub={`${summary.totalRatings} reviews`}
                        color={brand.accent}
                    />
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
                    <Tab icon={<EventNoteIcon />} iconPosition="start" label={`Appointments (${appointments.length})`} />
                    <Tab icon={<RateReviewIcon />} iconPosition="start" label={`Reviews (${ratings.length})`} />
                </Tabs>
                <Box sx={{ p: 2.5 }}>
                    {tab === 0 && <AppointmentsTable rows={appointments} />}
                    {tab === 1 && <ReviewsList rows={ratings} />}
                </Box>
            </Paper>

            {/* Edit dialog */}
            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>Edit Doctor</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                <TextField
                                    label="Name / title" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.title}
                                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                                />
                                <TextField
                                    label="Category" size="small"
                                    value={editing.category}
                                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                />
                                <TextField
                                    label="Slot duration (hrs)" size="small" type="number"
                                    value={editing.time}
                                    onChange={(e) => setEditing({ ...editing, time: Number(e.target.value) })}
                                />
                                <TextField
                                    label="Fee (INR)" size="small" type="number"
                                    value={editing.fee}
                                    onChange={(e) => setEditing({ ...editing, fee: Number(e.target.value) })}
                                />
                                <TextField
                                    label="Photo URL" size="small"
                                    value={editing.url}
                                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editing.available}
                                            onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                                        />
                                    }
                                    label="Available for appointments"
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={saveEdit} disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Delete confirmation */}
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Delete doctor permanently?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        This will permanently remove <b>{doctor.title}</b> from the platform.
                        Existing appointments will remain as historical records.
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

function AppointmentsTable({ rows }) {
    if (rows.length === 0) return <Empty text="No appointments." />;
    return (
        <Table>
            <TableHead sx={{ background: brand.surfaceAlt }}>
                <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell align="right">Fee</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((a) => (
                    <TableRow key={a._id}>
                        <TableCell>
                            <Typography fontWeight={600}>{a.customerName}</Typography>
                            <Typography variant="caption" color={brand.inkFaint}>{a.customerEmail}</Typography>
                        </TableCell>
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

function ReviewsList({ rows }) {
    if (rows.length === 0) return <Empty text="No reviews yet." />;
    return rows.map((r, i) => (
        <Box key={i} sx={{
            py: 2,
            borderBottom: `1px solid ${brand.border}`,
            '&:last-of-type': { borderBottom: 'none' },
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon
                        key={s}
                        fontSize="small"
                        sx={{ color: s < r.rating ? brand.accent : brand.border }}
                    />
                ))}
                <Typography variant="body2" fontWeight={700} sx={{ ml: 1 }}>{r.customer}</Typography>
                <Typography variant="caption" color={brand.inkFaint} sx={{ ml: 'auto' }}>{fmt(r.at)}</Typography>
            </Box>
            {r.review && <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 0.5 }}>{r.review}</Typography>}
        </Box>
    ));
}

function Empty({ text }) {
    return <Box sx={{ textAlign: 'center', py: 5 }}><Typography color={brand.inkMuted}>{text}</Typography></Box>;
}

export default AdminDoctorDetail;
