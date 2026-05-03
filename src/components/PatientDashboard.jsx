import React, { useContext, useEffect, useState } from 'react';
import {
    Box, Typography, Chip, CircularProgress, Avatar,
    Card, CardContent, CardActions, Button, Alert, Grid,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Rating, Snackbar
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonIcon from '@mui/icons-material/Person';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import StarIcon from '@mui/icons-material/Star';
import Navbar from './Navbar';
import { DataContext } from '../context/DataProvider';
import { getUserAppointments, cancelAppointment, rescheduleAppointment, submitRating } from '../services/api';

const STATUS_COLORS = {
    scheduled: 'success',
    cancelled: 'error',
    rescheduled: 'warning',
};

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

function PatientDashboard() {
    const { account } = useContext(DataContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState({ text: '', type: 'info' });

    // Reschedule dialog
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);

    // Rating dialog
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
        await cancelAppointment(id);
        setActionMsg({ text: 'Appointment cancelled successfully.', type: 'info' });
        fetchAppointments();
    };

    const openReschedule = (appt) => {
        setSelected(appt);
        setNewDate('');
        setNewTime('');
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
        setRatingValue(0);
        setReviewText('');
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

    const upcoming = appointments.filter(
        a => a.status === 'scheduled' && new Date(a.date) >= new Date()
    );
    const past = appointments.filter(
        a => a.status !== 'scheduled' || new Date(a.date) < new Date()
    );

    const displayName = account?.name || account?.username || 'Patient';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 5 }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#fff',
                    borderRadius: 3, p: 4, mb: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                }}>
                    <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', fontSize: 28 }}>
                        {displayName[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>{displayName}</Typography>
                        <Typography variant="body2" color="text.secondary">{account?.email}</Typography>
                        <Chip icon={<PersonIcon />} label="Patient" color="primary" variant="outlined" size="small" sx={{ mt: 0.5 }} />
                    </Box>
                </Box>

                {actionMsg.text && (
                    <Alert
                        severity={actionMsg.type}
                        onClose={() => setActionMsg({ text: '', type: 'info' })}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                        {actionMsg.text}
                    </Alert>
                )}

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Booked', value: appointments.length, color: '#1976d2' },
                        { label: 'Upcoming', value: upcoming.length, color: '#2e7d32' },
                        { label: 'Past / Cancelled', value: past.length, color: '#e65100' },
                    ].map(({ label, value, color }) => (
                        <Box key={label} sx={{
                            bgcolor: '#fff', borderRadius: 3, px: 4, py: 3,
                            flex: 1, minWidth: 130, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center'
                        }}>
                            <Typography variant="h4" fontWeight={700} color={color}>{value}</Typography>
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                        </Box>
                    ))}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : appointments.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', bgcolor: '#fff', borderRadius: 3,
                        p: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                    }}>
                        <CalendarMonthIcon sx={{ fontSize: 56, color: '#bbb', mb: 2 }} />
                        <Typography color="text.secondary" fontSize={18}>No appointments yet.</Typography>
                        <Typography color="text.secondary" fontSize={14} mt={1}>
                            Browse our doctors and book your first appointment.
                        </Typography>
                        <Button variant="contained" href="/doctors" sx={{ mt: 3, borderRadius: 2 }}>
                            Find a Doctor
                        </Button>
                    </Box>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <Box mb={4}>
                                <Typography variant="h6" fontWeight={600} mb={2}>
                                    Upcoming Appointments
                                </Typography>
                                <Grid container spacing={2}>
                                    {upcoming.map(appt => (
                                        <Grid item xs={12} sm={6} key={appt._id}>
                                            <AppointmentCard
                                                appt={appt}
                                                onCancel={handleCancel}
                                                onReschedule={openReschedule}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {past.length > 0 && (
                            <Box>
                                <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
                                    Past / Cancelled
                                </Typography>
                                <Grid container spacing={2}>
                                    {past.map(appt => (
                                        <Grid item xs={12} sm={6} key={appt._id}>
                                            <AppointmentCard appt={appt} isPast onRate={openRating} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    {selected && (
                        <Box sx={{ bgcolor: '#f8fafd', borderRadius: 2, p: 2, mb: 3 }}>
                            <Typography variant="body2" fontWeight={600}>Current Appointment</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Doctor: Dr. {selected.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Date: {new Date(selected.date).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" fontWeight={600} mb={1}>Select New Date</Typography>
                    <TextField
                        type="date"
                        fullWidth
                        value={newDate}
                        onChange={(e) => { setNewDate(e.target.value); setNewTime(''); }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}
                        sx={{ mb: 3 }}
                    />
                    {newDate && (
                        <>
                            <Typography variant="body2" fontWeight={600} mb={1.5}>Select New Time Slot</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {TIME_SLOTS.map(slot => (
                                    <Chip
                                        key={slot}
                                        label={slot}
                                        onClick={() => setNewTime(slot)}
                                        color={newTime === slot ? 'primary' : 'default'}
                                        variant={newTime === slot ? 'filled' : 'outlined'}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    {newDate && newTime && (
                        <Box sx={{ bgcolor: '#f0f7ff', border: '1px solid #bbdefb', borderRadius: 2, p: 2, mt: 3 }}>
                            <Typography variant="body2" fontWeight={600}>New Appointment</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dr. {selected?.doctorName} — {newDate} at {newTime}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setRescheduleOpen(false)} color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<EditCalendarIcon />}
                        onClick={handleReschedule}
                        disabled={!newDate || !newTime || rescheduleLoading}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Rating Dialog */}
            <Dialog open={ratingOpen} onClose={() => setRatingOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Rate Your Appointment</DialogTitle>
                <DialogContent>
                    {ratingTarget && (
                        <Box sx={{ textAlign: 'center', py: 1 }}>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                How was your consultation with <strong>Dr. {ratingTarget.doctorName}</strong>?
                            </Typography>
                            <Rating
                                value={ratingValue}
                                onChange={(_, val) => setRatingValue(val)}
                                size="large"
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                label="Leave a review (optional)"
                                multiline
                                rows={3}
                                fullWidth
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setRatingOpen(false)} color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={handleSubmitRating}
                        disabled={!ratingValue || ratingLoading}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {ratingLoading ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                    {snackbar}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function AppointmentCard({ appt, onCancel, onReschedule, isPast, onRate }) {
    const isCompleted = isPast && appt.status !== 'cancelled' && new Date(appt.date) < new Date();
    const canRate = isCompleted && !appt.rating;

    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            opacity: isPast ? 0.85 : 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography fontWeight={700}>Dr. {appt.doctorName || 'Unknown'}</Typography>
                    <Chip
                        label={appt.status || 'scheduled'}
                        color={STATUS_COLORS[appt.status] || 'default'}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                        {appt.date ? new Date(appt.date).toLocaleString() : '—'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
                    <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{appt.fee || '—'} consultation fee</Typography>
                </Box>

                {/* Show existing rating */}
                {appt.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating value={appt.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">Your rating</Typography>
                    </Box>
                )}
            </CardContent>

            {!isPast && appt.status === 'scheduled' && (
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditCalendarIcon />}
                        onClick={() => onReschedule(appt)}
                        sx={{ borderRadius: 2, flex: 1 }}
                    >
                        Reschedule
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onCancel(appt._id)}
                        sx={{ borderRadius: 2, flex: 1 }}
                    >
                        Cancel
                    </Button>
                </CardActions>
            )}

            {canRate && (
                <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<StarIcon />}
                        onClick={() => onRate(appt)}
                        fullWidth
                        sx={{ borderRadius: 2 }}
                    >
                        Rate This Appointment
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

export default PatientDashboard;
