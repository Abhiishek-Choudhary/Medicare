import { useContext, useEffect, useState } from 'react';
import {
    Box, Paper, Typography, Tabs, Tab, Avatar, Divider, Chip, Skeleton, Alert, Button,
    TextField, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, alpha,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getMyActivity, updateMe, cancelHospitalBooking } from '../services/api';
import { DataContext } from '../context/DataProvider';
import { brand } from '../theme';

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—';

function MyProfile() {
    const navigate = useNavigate();
    const { account, setAccount, role, token } = useContext(DataContext);
    const [tab, setTab] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (!account) {
            navigate('/login', { state: { from: '/profile' } });
            return;
        }
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const load = () => {
        setLoading(true);
        getMyActivity()
            .then((res) => setData(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load profile'))
            .finally(() => setLoading(false));
    };

    const saveProfile = async () => {
        try {
            const { data: u } = await updateMe({ username: editing.username, phone: editing.phone });
            setData({ ...data, user: u });
            setAccount({ ...account, username: u.username, name: u.username }, role, token);
            setToast('Profile updated');
            setTimeout(() => setToast(''), 2500);
            setEditing(null);
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 1240, mx: 'auto', px: 3, py: 4 }}>
                    <Skeleton variant="rounded" height={220} sx={{ mb: 2 }} />
                    <Skeleton variant="rounded" height={400} />
                </Box>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 6 }}>
                    <Alert severity="error">{error || 'Failed to load'}</Alert>
                </Box>
            </Box>
        );
    }

    const { user, summary, appointments, orders, hospitalBookings, prescriptions, donor } = data;

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Header */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Avatar sx={{
                            width: 88, height: 88, fontSize: 34, fontWeight: 800,
                            background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                        }}>
                            {user.username[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            <Typography variant="h4" fontWeight={800}>{user.username}</Typography>
                            <Typography variant="body2" color={brand.inkMuted}>{user.email}</Typography>
                            {user.phone && <Typography variant="body2" color={brand.inkMuted}>{user.phone}</Typography>}
                            <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 0.5 }}>
                                Member since {fmtDate(user.createdAt)}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined" startIcon={<EditIcon />}
                            onClick={() => setEditing({ username: user.username, phone: user.phone || '' })}
                        >
                            Edit profile
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2.5 }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Stat label="Appointments" value={summary.totalAppointments} icon={<EventNoteIcon />} color={brand.accent} />
                        <Stat label="Medicine Orders" value={summary.totalOrders} icon={<ReceiptLongIcon />} color={brand.primary} />
                        <Stat label="Hospital Bookings" value={summary.totalHospitalBookings} icon={<LocalHospitalIcon />} color={brand.primary} />
                        <Stat label="Prescriptions" value={summary.totalPrescriptions} icon={<DescriptionIcon />} color={brand.accent} />
                        <Stat
                            label="Blood Donor"
                            value={summary.isDonor ? donor?.bloodGroup : 'No'}
                            icon={<BloodtypeIcon />}
                            color={summary.isDonor ? brand.danger : brand.inkFaint}
                        />
                        <Stat label="Total Spent" value={rupees(summary.totalSpent)} color={brand.success} />
                    </Box>
                </Paper>

                {/* Tabs */}
                <Paper>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: `1px solid ${brand.border}` }}
                    >
                        <Tab icon={<EventNoteIcon />} iconPosition="start" label={`Doctor Appointments (${appointments.length})`} />
                        <Tab icon={<ReceiptLongIcon />} iconPosition="start" label={`Medicine Orders (${orders.length})`} />
                        <Tab icon={<LocalHospitalIcon />} iconPosition="start" label={`Hospital Bookings (${hospitalBookings.length})`} />
                        <Tab icon={<DescriptionIcon />} iconPosition="start" label={`Prescriptions (${prescriptions.length})`} />
                        <Tab icon={<BloodtypeIcon />} iconPosition="start" label="Blood Donor" />
                    </Tabs>
                    <Box sx={{ p: 2.5 }}>
                        {tab === 0 && <AppointmentsTab rows={appointments} />}
                        {tab === 1 && <OrdersTab rows={orders} />}
                        {tab === 2 && <HospitalBookingsTab rows={hospitalBookings} onChange={load} />}
                        {tab === 3 && <PrescriptionsTab rows={prescriptions} />}
                        {tab === 4 && <DonorTab donor={donor} />}
                    </Box>
                </Paper>
            </Box>

            {/* Edit dialog */}
            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="xs" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogContent>
                            <TextField autoFocus fullWidth size="small" label="Name" sx={{ mb: 2, mt: 1 }}
                                value={editing.username}
                                onChange={(e) => setEditing({ ...editing, username: e.target.value })}
                            />
                            <TextField fullWidth size="small" label="Phone"
                                value={editing.phone}
                                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={saveProfile}>Save</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Footer />
        </Box>
    );
}

function Stat({ label, value, sub, icon, color = brand.primary }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: 1.5, minWidth: 180,
            background: alpha(color, 0.05), borderRadius: 2,
            border: `1px solid ${alpha(color, 0.15)}`,
        }}>
            {icon && (
                <Box sx={{
                    width: 40, height: 40, borderRadius: 2,
                    background: alpha(color, 0.12), color,
                    display: 'grid', placeItems: 'center',
                }}>
                    {icon}
                </Box>
            )}
            <Box>
                <Typography variant="caption" color={brand.inkMuted} fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    {label}
                </Typography>
                <Typography fontWeight={800} color={color}>{value}</Typography>
                {sub && <Typography variant="caption" color={brand.inkFaint}>{sub}</Typography>}
            </Box>
        </Box>
    );
}

function AppointmentsTab({ rows }) {
    if (rows.length === 0) return <Empty text="No appointments yet." link="/doctors" cta="Book with a doctor" />;
    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table>
                <TableHead sx={{ background: brand.surfaceAlt }}>
                    <TableRow>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Date</TableCell>
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
        </Box>
    );
}

function OrdersTab({ rows }) {
    if (rows.length === 0) return <Empty text="No medicine orders yet." link="/pharmacy" cta="Shop medicines" />;
    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table>
                <TableHead sx={{ background: brand.surfaceAlt }}>
                    <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((o) => (
                        <TableRow key={o._id}>
                            <TableCell><Typography fontWeight={700}>{o.orderNumber}</Typography></TableCell>
                            <TableCell>{fmt(o.createdAt)}</TableCell>
                            <TableCell align="right"><Typography fontWeight={700}>{rupees(o.totalAmount)}</Typography></TableCell>
                            <TableCell align="center">
                                <Chip label={o.orderStatus.replace(/_/g, ' ')} size="small" sx={{ textTransform: 'capitalize' }} />
                            </TableCell>
                            <TableCell align="right">
                                <Button component={Link} to={`/pharmacy/orders/${o._id}`} size="small">Track</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

const BOOKING_COLORS = {
    pending: brand.accent,
    confirmed: brand.primary,
    completed: brand.success,
    cancelled: brand.danger,
    no_show: brand.danger,
};

function HospitalBookingsTab({ rows, onChange }) {
    const [cancelling, setCancelling] = useState(null);

    const doCancel = async () => {
        try {
            await cancelHospitalBooking(cancelling._id, 'Cancelled by customer');
            setCancelling(null);
            onChange();
        } catch { /* ignore */ }
    };

    if (rows.length === 0) return <Empty text="No hospital bookings yet." link="/hospitals" cta="Find hospitals" />;
    return (
        <>
            <Box sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead sx={{ background: brand.surfaceAlt }}>
                        <TableRow>
                            <TableCell>Hospital</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>When</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((b) => {
                            const c = BOOKING_COLORS[b.status] || brand.inkMuted;
                            const canCancel = ['pending', 'confirmed'].includes(b.status);
                            return (
                                <TableRow key={b._id}>
                                    <TableCell>
                                        <Typography fontWeight={700}>{b.hospitalId?.name || 'Hospital'}</Typography>
                                        <Typography variant="caption" color={brand.inkFaint}>{b.hospitalId?.city}</Typography>
                                    </TableCell>
                                    <TableCell>{b.serviceName}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{fmtDate(b.date)}</Typography>
                                        <Typography variant="caption" color={brand.inkFaint}>{b.timeSlot}</Typography>
                                    </TableCell>
                                    <TableCell align="right">{rupees(b.amount)}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={b.status.replace('_', ' ')} size="small" sx={{
                                            textTransform: 'capitalize', fontWeight: 700,
                                            background: alpha(c, 0.15), color: c,
                                        }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {canCancel && (
                                            <Button size="small" color="error" onClick={() => setCancelling(b)}>
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            <Dialog open={!!cancelling} onClose={() => setCancelling(null)}>
                <DialogTitle>Cancel booking?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Cancel your booking at <b>{cancelling?.hospitalId?.name}</b> on {fmtDate(cancelling?.date)} at {cancelling?.timeSlot}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelling(null)}>Keep booking</Button>
                    <Button color="error" variant="contained" onClick={doCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function PrescriptionsTab({ rows }) {
    const BASE_URL = 'https://medicare2-0.onrender.com';
    if (rows.length === 0) return <Empty text="No prescriptions uploaded." />;
    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table>
                <TableHead sx={{ background: brand.surfaceAlt }}>
                    <TableRow>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((p) => (
                        <TableRow key={p._id}>
                            <TableCell>{fmt(p.createdAt)}</TableCell>
                            <TableCell>
                                {p.fileUrl && (
                                    <a href={p.fileUrl.startsWith('http') ? p.fileUrl : `${BASE_URL}${p.fileUrl}`}
                                        target="_blank" rel="noreferrer"
                                        style={{ color: brand.primary }}>
                                        {p.originalName || 'View file'}
                                    </a>
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <Chip label={p.status} size="small" sx={{ textTransform: 'capitalize' }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

function DonorTab({ donor }) {
    if (!donor) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <BloodtypeIcon sx={{ fontSize: 60, color: brand.inkFaint, mb: 2 }} />
                <Typography fontWeight={700}>Not registered as a blood donor yet</Typography>
                <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 1, mb: 2 }}>
                    Register to help save lives.
                </Typography>
                <Button component={Link} to="/blood/register" variant="contained" color="error">
                    Register as donor
                </Button>
            </Box>
        );
    }
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Box sx={{
                    width: 60, height: 60, borderRadius: 2,
                    background: alpha(brand.danger, 0.12), color: brand.danger,
                    display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22,
                }}>
                    {donor.bloodGroup}
                </Box>
                <Box>
                    <Typography fontWeight={800}>{donor.fullName}</Typography>
                    <Typography variant="caption" color={brand.inkMuted}>
                        {donor.age} yr · {donor.city}, {donor.state}
                    </Typography>
                </Box>
                <Chip
                    label={donor.isActive === false ? 'Paused' : 'Active'}
                    color={donor.isActive === false ? 'default' : 'success'}
                    sx={{ ml: 'auto' }}
                />
            </Box>

            <Typography variant="body2" color={brand.inkFaint} fontWeight={600} sx={{ mt: 2 }}>Available in</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                {(donor.availableMonths || []).map((m) => (
                    <Chip key={m} label={m} size="small"
                        sx={{ background: alpha(brand.success, 0.15), color: brand.success, fontWeight: 600 }} />
                ))}
            </Box>

            <Button component={Link} to="/blood/register" variant="outlined" sx={{ mt: 3 }}>
                Update donor profile
            </Button>
        </Box>
    );
}

function Empty({ text, link, cta }) {
    return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
            <PersonIcon sx={{ fontSize: 48, color: brand.inkFaint, opacity: 0.5 }} />
            <Typography color={brand.inkMuted} sx={{ mb: 2 }}>{text}</Typography>
            {link && cta && <Button component={Link} to={link} variant="contained">{cta}</Button>}
        </Box>
    );
}

export default MyProfile;
