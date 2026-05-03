import React, { useContext, useEffect, useState } from 'react';
import {
    Box, Typography, Chip, CircularProgress, Avatar, Divider,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton,
    Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Alert
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Navbar from './Navbar';
import { DataContext } from '../context/DataProvider';
import { getDoctorAppointments, cancelAppointmentByDoctor, rescheduleAppointment } from '../services/api';

const STATUS_COLORS = {
    scheduled: 'success',
    cancelled: 'error',
    rescheduled: 'warning',
};

function DoctorDashboard() {
    const { account } = useContext(DataContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [actionMsg, setActionMsg] = useState('');

    const doctorId = account?._id || account?.id;

    const fetchAppointments = async () => {
        if (!doctorId) return;
        const res = await getDoctorAppointments(doctorId);
        if (res?.data?.data) setAppointments(res.data.data);
        else setAppointments([]);
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [doctorId]);

    const handleCancel = async (id) => {
        await cancelAppointmentByDoctor(id);
        setActionMsg('Appointment cancelled. Patient has been notified.');
        fetchAppointments();
    };

    const handleReschedule = async () => {
        if (!newDate) return;
        await rescheduleAppointment(selected._id, newDate);
        setRescheduleOpen(false);
        setNewDate('');
        setActionMsg('Appointment rescheduled. Patient has been notified.');
        fetchAppointments();
    };

    const stats = {
        total: appointments.length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        earnings: appointments
            .filter(a => a.status !== 'cancelled')
            .reduce((sum, a) => sum + (a.fee || 0), 0),
    };

    const displayName = account?.name || account?.username || 'Doctor';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 5 }}>
                {/* Doctor Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#fff', borderRadius: 3, p: 4, mb: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <Avatar sx={{ width: 72, height: 72, bgcolor: '#2e7d32', fontSize: 28 }}>
                        {displayName[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Dr. {displayName}</Typography>
                        {account?.speciality && (
                            <Chip icon={<MedicalServicesIcon />} label={account.speciality} color="success" variant="outlined" size="small" sx={{ mt: 0.5 }} />
                        )}
                        <Typography variant="body2" color="text.secondary" mt={0.5}>{account?.email}</Typography>
                    </Box>
                </Box>

                {actionMsg && (
                    <Alert severity="success" onClose={() => setActionMsg('')} sx={{ mb: 3, borderRadius: 2 }}>
                        {actionMsg}
                    </Alert>
                )}

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Appointments', value: stats.total, color: '#1976d2' },
                        { label: 'Scheduled', value: stats.scheduled, color: '#2e7d32' },
                        { label: 'Cancelled', value: stats.cancelled, color: '#c62828' },
                        { label: 'Total Earnings', value: `₹${stats.earnings}`, color: '#6a1b9a' },
                    ].map(({ label, value, color }) => (
                        <Box key={label} sx={{ bgcolor: '#fff', borderRadius: 3, px: 4, py: 3, flex: 1, minWidth: 140, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={700} color={color}>{value}</Typography>
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Appointments Table */}
                <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <Box sx={{ px: 4, py: 3, borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" fontWeight={600}>Appointments</Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : appointments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">No appointments found.</Typography>
                        </Box>
                    ) : (
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafd' }}>
                                <TableRow>
                                    <TableCell fontWeight={600}>Patient</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Fee</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map(appt => (
                                    <TableRow key={appt._id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{appt.customerName || '—'}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{appt.customerEmail || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: 13 }}>
                                            {appt.date ? new Date(appt.date).toLocaleString() : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CurrencyRupeeIcon sx={{ fontSize: 14 }} />
                                                {appt.fee || '—'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={appt.status || 'scheduled'}
                                                color={STATUS_COLORS[appt.status] || 'default'}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {appt.status !== 'cancelled' && (
                                                <>
                                                    <Tooltip title="Reschedule">
                                                        <IconButton size="small" color="primary" onClick={() => { setSelected(appt); setRescheduleOpen(true); }}>
                                                            <EditCalendarIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancel">
                                                        <IconButton size="small" color="error" onClick={() => handleCancel(appt._id)}>
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            </Box>

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Patient: {selected?.customerName}
                    </Typography>
                    <TextField
                        fullWidth
                        label="New Date & Time"
                        type="datetime-local"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setRescheduleOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleReschedule} disabled={!newDate}>
                        Confirm Reschedule
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DoctorDashboard;
