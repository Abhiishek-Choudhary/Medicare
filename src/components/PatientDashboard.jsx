import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Chip, Avatar, Skeleton, Alert, Button, Paper, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Snackbar,
    Tabs, Tab, alpha,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonIcon from '@mui/icons-material/Person';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import StarIcon from '@mui/icons-material/Star';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { DataContext } from '../context/DataProvider';
import { getUserAppointments, cancelAppointment, rescheduleAppointment, submitRating } from '../services/api';
import { brand } from '../theme';

const STATUS_META = {
    scheduled:   { label: 'Scheduled',   color: brand.primary, icon: EventAvailableIcon },
    cancelled:   { label: 'Cancelled',   color: brand.danger,  icon: CancelIcon },
    rescheduled: { label: 'Rescheduled', color: brand.accent,  icon: EditCalendarIcon },
    completed:   { label: 'Completed',   color: brand.success, icon: CheckCircleIcon },
};

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const QUICK_ACTIONS = [
    { label: 'Find a Doctor',      to: '/doctors',   icon: MedicalServicesIcon, color: brand.primary },
    { label: 'Browse Hospitals',   to: '/hospitals', icon: LocalHospitalIcon,   color: brand.accent  },
    { label: 'Order Medicines',    to: '/pharmacy',  icon: LocalPharmacyIcon,   color: brand.success },
    { label: 'Blood Bank',         to: '/blood',     icon: BloodtypeIcon,       color: brand.danger  },
];

function PatientDashboard() {
    const { account } = useContext(DataContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState({ text: '', type: 'info' });
    const [tab, setTab] = useState(0);

    // Reschedule
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);

    // Rating
    const [ratingOpen, setRatingOpen] = useState(false);
    const [ratingTarget, setRatingTarget] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [ratingLoading, setRatingLoading] = useState(false);
    const [snackbar, setSnackbar] = useState('');

    const userId = account?.id || account?._id;
    const today = new Date().toISOString().split('T')[0];

    const fetchAppointments = async () => {
        if (!userId) return;
        const res = await getUserAppointments(userId);
        if (res?.data) setAppointments(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [userId]);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        await cancelAppointment(id);
        setActionMsg({ text: 'Appointment cancelled successfully.', type: 'info' });
        fetchAppointments();
    };

    const openReschedule = (appt) => {
        setSelected(appt);
        setNewDate(''); setNewTime('');
        setRescheduleOpen(true);
    };

    const handleReschedule = async () => {
        if (!newDate || !newTime) return;
        setRescheduleLoading(true);
        const dateTime = new Date(`${newDate} ${newTime}`).toISOString();
        await rescheduleAppointment(selected._id, dateTime);
        setRescheduleLoading(false);
        setRescheduleOpen(false);
        setActionMsg({ text: 'Appointment rescheduled successfully. You will be notified via email.', type: 'success' });
        fetchAppointments();
    };

    const openRating = (appt) => {
        setRatingTarget(appt);
        setRatingValue(0); setReviewText('');
        setRatingOpen(true);
    };

    const handleSubmitRating = async () => {
        if (!ratingValue) return;
        setRatingLoading(true);
        await submitRating(ratingTarget._id, ratingValue, reviewText);
        setRatingLoading(false);
        setRatingOpen(false);
        setSnackbar(`Thank you for rating Dr. ${ratingTarget.doctorName}!`);
        fetchAppointments();
    };

    const now = new Date();
    const { upcoming, past } = useMemo(() => {
        const up = []; const pa = [];
        for (const a of appointments) {
            if (a.status === 'scheduled' && new Date(a.date) >= now) up.push(a);
            else pa.push(a);
        }
        up.sort((a, b) => new Date(a.date) - new Date(b.date));
        pa.sort((a, b) => new Date(b.date) - new Date(a.date));
        return { upcoming: up, past: pa };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointments]);

    const totalSpent = appointments
        .filter(a => a.status !== 'cancelled')
        .reduce((n, a) => n + (a.fee || 0), 0);

    const displayName = account?.name || account?.username || 'Patient';
    const initials = displayName[0].toUpperCase();

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}>
                {/* Hero header */}
                <Paper sx={{
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                    color: '#fff', mb: 3, p: { xs: 3, md: 4 },
                }}>
                    <Box sx={{
                        position: 'absolute', top: -80, right: -80,
                        width: 260, height: 260, borderRadius: '50%',
                        background: alpha('#fff', 0.08),
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: -60, left: '30%',
                        width: 180, height: 180, borderRadius: '50%',
                        background: alpha('#fff', 0.05),
                    }} />

                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Avatar sx={{
                            width: 88, height: 88, fontSize: 34, fontWeight: 800,
                            background: alpha('#fff', 0.2), color: '#fff',
                            border: `3px solid ${alpha('#fff', 0.35)}`,
                        }}>
                            {initials}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: '0.14em' }}>
                                Welcome back
                            </Typography>
                            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.2, lineHeight: 1.1 }}>
                                {displayName}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                                {account?.email}
                            </Typography>
                            <Box sx={{
                                mt: 1.4, display: 'inline-flex', alignItems: 'center', gap: 0.6,
                                px: 1.2, py: 0.4, borderRadius: 999,
                                background: alpha('#fff', 0.18),
                                border: `1px solid ${alpha('#fff', 0.28)}`,
                            }}>
                                <PersonIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" fontWeight={800} sx={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Patient
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            component={Link} to="/doctors"
                            variant="contained" size="large"
                            startIcon={<CalendarMonthIcon />}
                            sx={{
                                background: '#fff', color: brand.primary,
                                fontWeight: 700, px: 3,
                                '&:hover': { background: '#fff', opacity: 0.94 },
                            }}
                        >
                            Book Appointment
                        </Button>
                    </Box>
                </Paper>

                {actionMsg.text && (
                    <Alert
                        severity={actionMsg.type}
                        onClose={() => setActionMsg({ text: '', type: 'info' })}
                        sx={{ mb: 3 }}
                    >
                        {actionMsg.text}
                    </Alert>
                )}

                {/* Stats */}
                <Box sx={{
                    display: 'grid', gap: 2, mb: 3,
                    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                }}>
                    <StatCard
                        label="Total Appointments" value={appointments.length}
                        icon={<CalendarMonthIcon />} color={brand.primary}
                    />
                    <StatCard
                        label="Upcoming" value={upcoming.length}
                        icon={<EventAvailableIcon />} color={brand.success}
                    />
                    <StatCard
                        label="Completed / Past" value={past.length}
                        icon={<HistoryIcon />} color={brand.accent}
                    />
                    <StatCard
                        label="Total Spent" value={`₹${totalSpent.toLocaleString('en-IN')}`}
                        icon={<CurrencyRupeeIcon />} color={brand.danger}
                    />
                </Box>

                {/* Quick actions */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="caption" color={brand.inkFaint} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.4, px: 0.5 }}>
                        Quick actions
                    </Typography>
                    <Box sx={{
                        display: 'grid', gap: 1.5,
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                    }}>
                        {QUICK_ACTIONS.map((a) => {
                            const Icon = a.icon;
                            return (
                                <Box
                                    key={a.label}
                                    component={Link}
                                    to={a.to}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        px: 2, py: 1.5, borderRadius: 2,
                                        textDecoration: 'none', color: brand.ink,
                                        background: alpha(a.color, 0.06),
                                        border: `1px solid ${alpha(a.color, 0.15)}`,
                                        transition: 'transform 0.15s, box-shadow 0.2s, background 0.2s',
                                        '&:hover': {
                                            background: alpha(a.color, 0.12),
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 20px ${alpha(a.color, 0.2)}`,
                                        },
                                    }}
                                >
                                    <Box sx={{
                                        width: 40, height: 40, borderRadius: 2,
                                        background: `linear-gradient(135deg, ${a.color}, ${alpha(a.color, 0.75)})`,
                                        color: '#fff', display: 'grid', placeItems: 'center',
                                        boxShadow: `0 4px 10px ${alpha(a.color, 0.35)}`,
                                    }}>
                                        <Icon />
                                    </Box>
                                    <Typography fontWeight={700} sx={{ fontSize: 14 }}>{a.label}</Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* Appointments */}
                <Paper sx={{ overflow: 'hidden' }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        sx={{ borderBottom: `1px solid ${brand.border}` }}
                    >
                        <Tab
                            icon={<EventAvailableIcon />} iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Upcoming
                                    <Chip
                                        label={upcoming.length}
                                        size="small"
                                        sx={{
                                            height: 20, fontSize: 11, fontWeight: 700,
                                            background: alpha(brand.primary, 0.15), color: brand.primary,
                                        }}
                                    />
                                </Box>
                            }
                        />
                        <Tab
                            icon={<HistoryIcon />} iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    History
                                    <Chip
                                        label={past.length}
                                        size="small"
                                        sx={{
                                            height: 20, fontSize: 11, fontWeight: 700,
                                            background: brand.surfaceAlt, color: brand.inkMuted,
                                        }}
                                    />
                                </Box>
                            }
                        />
                    </Tabs>

                    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                        {loading ? (
                            <Box sx={{
                                display: 'grid', gap: 2,
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            }}>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} variant="rounded" height={180} />
                                ))}
                            </Box>
                        ) : appointments.length === 0 ? (
                            <EmptyState />
                        ) : tab === 0 ? (
                            upcoming.length === 0 ? (
                                <EmptyBlock
                                    icon={<EventAvailableIcon />}
                                    title="No upcoming appointments"
                                    subtitle="Ready to book your next visit?"
                                    cta="Find a Doctor"
                                    ctaLink="/doctors"
                                />
                            ) : (
                                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                                    {upcoming.map(a => (
                                        <AppointmentCard
                                            key={a._id}
                                            appt={a}
                                            onCancel={handleCancel}
                                            onReschedule={openReschedule}
                                        />
                                    ))}
                                </Box>
                            )
                        ) : past.length === 0 ? (
                            <EmptyBlock icon={<HistoryIcon />} title="No history yet" subtitle="Your past appointments will show here." />
                        ) : (
                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                                {past.map(a => (
                                    <AppointmentCard key={a._id} appt={a} isPast onRate={openRating} />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* Reschedule dialog */}
            <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    {selected && (
                        <Box sx={{ background: brand.surfaceAlt, borderRadius: 2, p: 2, mb: 3 }}>
                            <Typography variant="caption" color={brand.inkMuted} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Current appointment
                            </Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ mt: 0.4 }}>Dr. {selected.doctorName}</Typography>
                            <Typography variant="body2" color={brand.inkMuted}>
                                {new Date(selected.date).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" fontWeight={700} mb={1}>Select new date</Typography>
                    <TextField
                        type="date" fullWidth
                        value={newDate}
                        onChange={(e) => { setNewDate(e.target.value); setNewTime(''); }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}
                        sx={{ mb: 3 }}
                    />
                    {newDate && (
                        <>
                            <Typography variant="body2" fontWeight={700} mb={1.5}>Select new time slot</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {TIME_SLOTS.map(slot => (
                                    <Chip
                                        key={slot}
                                        label={slot}
                                        onClick={() => setNewTime(slot)}
                                        sx={{
                                            cursor: 'pointer', fontWeight: 700,
                                            background: newTime === slot ? brand.primary : alpha(brand.primary, 0.08),
                                            color: newTime === slot ? '#fff' : brand.primary,
                                            '&:hover': {
                                                background: newTime === slot ? brand.primary : alpha(brand.primary, 0.16),
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    {newDate && newTime && (
                        <Box sx={{ background: brand.primarySoft, borderRadius: 2, p: 2, mt: 3, border: `1px solid ${alpha(brand.primary, 0.2)}` }}>
                            <Typography variant="body2" fontWeight={700} color={brand.primary}>New appointment</Typography>
                            <Typography variant="body2">
                                Dr. {selected?.doctorName} · {newDate} at {newTime}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setRescheduleOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<EditCalendarIcon />}
                        onClick={handleReschedule}
                        disabled={!newDate || !newTime || rescheduleLoading}
                    >
                        {rescheduleLoading ? 'Rescheduling…' : 'Confirm reschedule'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Rating dialog */}
            <Dialog open={ratingOpen} onClose={() => setRatingOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Rate your appointment</DialogTitle>
                <DialogContent>
                    {ratingTarget && (
                        <Box sx={{ textAlign: 'center', py: 1 }}>
                            <Typography variant="body2" color={brand.inkMuted} mb={2}>
                                How was your consultation with <b>Dr. {ratingTarget.doctorName}</b>?
                            </Typography>
                            <Rating value={ratingValue} onChange={(_, v) => setRatingValue(v)} size="large" sx={{ mb: 3 }} />
                            <TextField
                                label="Leave a review (optional)"
                                multiline rows={3} fullWidth
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setRatingOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={handleSubmitRating}
                        disabled={!ratingValue || ratingLoading}
                    >
                        {ratingLoading ? 'Submitting…' : 'Submit rating'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">{snackbar}</Alert>
            </Snackbar>
        </Box>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                <Box sx={{
                    width: 44, height: 44, borderRadius: 2,
                    display: 'grid', placeItems: 'center',
                    background: alpha(color, 0.12), color,
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" color={brand.inkMuted} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.1, mt: 0.2 }}>
                        {value}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}

function AppointmentCard({ appt, onCancel, onReschedule, isPast, onRate }) {
    const isCompleted = isPast && appt.status !== 'cancelled' && new Date(appt.date) < new Date();
    const effectiveStatus = isCompleted ? 'completed' : appt.status || 'scheduled';
    const meta = STATUS_META[effectiveStatus] || STATUS_META.scheduled;
    const StatusIcon = meta.icon;
    const canRate = isCompleted && !appt.rating;

    return (
        <Paper sx={{
            p: 2.5, display: 'flex', flexDirection: 'column',
            transition: 'transform 0.15s, box-shadow 0.2s, border-color 0.2s',
            border: `1px solid ${brand.border}`,
            '&:hover': {
                borderColor: alpha(meta.color, 0.4),
                boxShadow: `0 10px 24px ${alpha(meta.color, 0.15)}`,
                transform: 'translateY(-2px)',
            },
        }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
                <Avatar sx={{
                    width: 44, height: 44,
                    background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                    fontWeight: 800, fontSize: 15,
                }}>
                    {appt.doctorName?.[0]?.toUpperCase() || 'D'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>Dr. {appt.doctorName || 'Unknown'}</Typography>
                    <Typography variant="caption" color={brand.inkFaint}>Consultation</Typography>
                </Box>
                <Chip
                    icon={<StatusIcon sx={{ fontSize: 14 }} />}
                    label={meta.label}
                    size="small"
                    sx={{
                        fontWeight: 700, textTransform: 'capitalize',
                        background: alpha(meta.color, 0.15),
                        color: meta.color,
                        '& .MuiChip-icon': { color: meta.color },
                    }}
                />
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                <IconRow icon={<CalendarMonthIcon fontSize="small" />}
                    text={appt.date ? new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} />
                <IconRow icon={<AccessTimeIcon fontSize="small" />}
                    text={appt.date ? new Date(appt.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'} />
            </Box>
            <IconRow
                icon={<CurrencyRupeeIcon fontSize="small" />}
                text={`${appt.fee || 0} · Consultation fee`}
            />

            {appt.rating && (
                <Box sx={{
                    mt: 1.5, p: 1, borderRadius: 2,
                    background: alpha(brand.accent, 0.08),
                    display: 'flex', alignItems: 'center', gap: 1,
                }}>
                    <Rating value={appt.rating} readOnly size="small" />
                    <Typography variant="caption" color={brand.inkMuted}>Your rating</Typography>
                </Box>
            )}

            {!isPast && appt.status === 'scheduled' && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        size="small" variant="outlined" color="primary"
                        startIcon={<EditCalendarIcon />}
                        onClick={() => onReschedule(appt)} sx={{ flex: 1 }}
                    >
                        Reschedule
                    </Button>
                    <Button
                        size="small" variant="outlined" color="error"
                        onClick={() => onCancel(appt._id)} sx={{ flex: 1 }}
                    >
                        Cancel
                    </Button>
                </Box>
            )}

            {canRate && (
                <Button
                    size="small" variant="contained" color="warning"
                    startIcon={<StarIcon />} onClick={() => onRate(appt)}
                    fullWidth sx={{ mt: 2 }}
                >
                    Rate this appointment
                </Button>
            )}
        </Paper>
    );
}

function IconRow({ icon, text }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: brand.inkMuted }}>
            {icon}
            <Typography variant="body2">{text}</Typography>
        </Box>
    );
}

function EmptyState() {
    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{
                width: 96, height: 96, borderRadius: '50%',
                background: brand.primarySoft,
                display: 'grid', placeItems: 'center',
                mx: 'auto', mb: 2,
            }}>
                <CalendarMonthIcon sx={{ fontSize: 48, color: brand.primary }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>No appointments yet</Typography>
            <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 1, mb: 3 }}>
                Browse our doctors and book your first appointment.
            </Typography>
            <Button component={Link} to="/doctors" variant="contained" size="large">
                Find a Doctor
            </Button>
        </Box>
    );
}

function EmptyBlock({ icon, title, subtitle, cta, ctaLink }) {
    return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
            <Box sx={{
                width: 64, height: 64, borderRadius: '50%',
                background: brand.surfaceAlt,
                display: 'grid', placeItems: 'center',
                mx: 'auto', mb: 1.5,
                color: brand.inkFaint,
            }}>
                {React.cloneElement(icon, { sx: { fontSize: 32 } })}
            </Box>
            <Typography fontWeight={800}>{title}</Typography>
            <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 0.5, mb: cta ? 2.5 : 0 }}>
                {subtitle}
            </Typography>
            {cta && ctaLink && (
                <Button component={Link} to={ctaLink} variant="contained">{cta}</Button>
            )}
        </Box>
    );
}

export default PatientDashboard;
