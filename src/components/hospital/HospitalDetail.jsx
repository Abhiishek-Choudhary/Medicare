import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box, Paper, Typography, Chip, Button, Skeleton, Alert, Avatar, Divider, Tabs, Tab,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, alpha,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedIcon from '@mui/icons-material/Verified';
import CallIcon from '@mui/icons-material/Call';
import LanguageIcon from '@mui/icons-material/Language';
import EmergencyIcon from '@mui/icons-material/Emergency';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '../Navbar';
import Footer from '../Footer';
import DoctorAvatar from '../DoctorAvatar';
import { getHospitalPublic, getHospitalSlots, bookHospitalSlot } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function HospitalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState(0);
    const [booking, setBooking] = useState(null); // { service }
    const [toast, setToast] = useState('');

    useEffect(() => {
        getHospitalPublic(id)
            .then((res) => setHospital(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    }, [id]);

    const startBooking = (service) => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: `/hospitals/${id}` } });
            return;
        }
        setBooking({ service });
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 1240, mx: 'auto', px: 3, py: 4 }}>
                    <Skeleton variant="rounded" height={400} />
                </Box>
            </Box>
        );
    }

    if (!hospital) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 6 }}>
                    <Alert severity="error">{error || 'Hospital not found'}</Alert>
                </Box>
            </Box>
        );
    }

    const services = (hospital.services || []).filter((s) => s.isActive);

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {toast && (
                    <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>{toast}</Alert>
                )}

                {/* Header */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Avatar
                            src={hospital.logoUrl}
                            sx={{
                                width: 88, height: 88,
                                background: alpha(brand.primary, 0.12), color: brand.primary,
                            }}
                        >
                            <LocalHospitalIcon sx={{ fontSize: 44 }} />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 240 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, flexWrap: 'wrap' }}>
                                <Typography variant="h4" fontWeight={800}>{hospital.name}</Typography>
                                {hospital.isVerified && <VerifiedIcon sx={{ color: brand.primary }} />}
                                {hospital.is24x7 && (
                                    <Chip label="24×7 Open" size="small" sx={{
                                        fontWeight: 700,
                                        background: alpha(brand.success, 0.15), color: brand.success,
                                    }} />
                                )}
                            </Box>
                            <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 0.5 }}>
                                {hospital.address}, {hospital.city}, {hospital.state}
                                {hospital.pincode ? ` - ${hospital.pincode}` : ''}
                            </Typography>
                            {hospital.description && (
                                <Typography variant="body2" sx={{ mt: 1 }}>{hospital.description}</Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                <Button size="small" variant="contained" color="error"
                                    startIcon={<CallIcon />}
                                    component="a" href={`tel:${hospital.phone}`}>
                                    {hospital.phone}
                                </Button>
                                {hospital.emergencyPhone && (
                                    <Button size="small" variant="outlined" color="error"
                                        startIcon={<EmergencyIcon />}
                                        component="a" href={`tel:${hospital.emergencyPhone}`}>
                                        Emergency: {hospital.emergencyPhone}
                                    </Button>
                                )}
                                {hospital.website && (
                                    <Button size="small" variant="outlined"
                                        startIcon={<LanguageIcon />}
                                        component="a" href={hospital.website} target="_blank" rel="noreferrer">
                                        Website
                                    </Button>
                                )}
                                {!hospital.is24x7 && hospital.openingTime && (
                                    <Chip
                                        icon={<ScheduleIcon />}
                                        label={`${hospital.openingTime}–${hospital.closingTime}`}
                                        size="small"
                                    />
                                )}
                            </Box>

                            {hospital.specialties?.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 2 }}>
                                    {hospital.specialties.map((s) => (
                                        <Chip key={s} label={s} size="small"
                                            sx={{ background: brand.primarySoft, color: brand.primary, fontWeight: 600 }} />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>

                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        sx={{ borderBottom: `1px solid ${brand.border}` }}
                    >
                        <Tab icon={<ScheduleIcon />} iconPosition="start" label={`Services (${services.length})`} />
                        <Tab icon={<MedicalServicesIcon />} iconPosition="start" label={`Doctors (${hospital.affiliatedDoctorIds?.length || 0})`} />
                        <Tab icon={<LocalPharmacyIcon />} iconPosition="start" label={`Pharmacy (${hospital.inHouseMedicineIds?.length || 0})`} />
                    </Tabs>
                </Paper>

                {tab === 0 && <ServicesGrid services={services} onBook={startBooking} />}
                {tab === 1 && <DoctorsGrid doctors={hospital.affiliatedDoctorIds || []} hospitalId={id} />}
                {tab === 2 && <MedicinesGrid medicines={hospital.inHouseMedicineIds || []} hospitalId={id} />}
            </Box>

            <BookingDialog
                open={!!booking}
                onClose={() => setBooking(null)}
                hospital={hospital}
                service={booking?.service}
                onSuccess={(msg) => {
                    setToast(msg);
                    setTimeout(() => setToast(''), 4000);
                    setBooking(null);
                }}
            />

            <Footer />
        </Box>
    );
}

function ServicesGrid({ services, onBook }) {
    if (services.length === 0) {
        return (
            <Paper sx={{ py: 8, textAlign: 'center' }}>
                <Typography color={brand.inkMuted}>This hospital hasn't listed any bookable services yet.</Typography>
            </Paper>
        );
    }
    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
            {services.map((s) => (
                <Paper key={s._id} sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Box>
                            <Typography fontWeight={800}>{s.name}</Typography>
                            {s.category && (
                                <Chip label={s.category} size="small" sx={{ mt: 0.5, background: brand.surfaceAlt }} />
                            )}
                            {s.description && (
                                <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 1 }}>{s.description}</Typography>
                            )}
                            <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 1 }}>
                                Duration: {s.durationMinutes} minutes
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight={800}>{rupees(s.price)}</Typography>
                            <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={() => onBook(s)}>
                                Book slot
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

function DoctorsGrid({ doctors, hospitalId }) {
    if (doctors.length === 0) {
        return (
            <Paper sx={{ py: 8, textAlign: 'center' }}>
                <Typography color={brand.inkMuted}>No doctors listed at this hospital yet.</Typography>
                <Button component={Link} to={`/doctors?hospitalId=${hospitalId}`} sx={{ mt: 2 }}>
                    Browse all doctors
                </Button>
            </Paper>
        );
    }
    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
            {doctors.map((d) => (
                <Paper key={d._id} sx={{ p: 2.5, textAlign: 'center' }}>
                    <Box sx={{
                        width: 72, height: 72, mx: 'auto', mb: 1.5,
                        borderRadius: '50%', overflow: 'hidden',
                    }}>
                        <DoctorAvatar
                            src={d.imageUrl}
                            name={d.name}
                            variant="circle"
                            size={72}
                        />
                    </Box>
                    <Typography fontWeight={700}>Dr. {d.name}</Typography>
                    <Typography variant="caption" color={brand.inkFaint}>{d.speciality}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5, color: brand.primary }}>
                        {rupees(d.fee)} consultation
                    </Typography>
                    <Button
                        component={Link} to={`/docprofile/${d._id}`}
                        variant="outlined" size="small" sx={{ mt: 1.5 }}
                    >
                        Book appointment
                    </Button>
                </Paper>
            ))}
        </Box>
    );
}

function MedicinesGrid({ medicines, hospitalId }) {
    if (medicines.length === 0) {
        return (
            <Paper sx={{ py: 8, textAlign: 'center' }}>
                <Typography color={brand.inkMuted}>No in-house medicines yet.</Typography>
                <Button component={Link} to={`/pharmacy?hospitalId=${hospitalId}`} sx={{ mt: 2 }}>
                    Browse all medicines
                </Button>
            </Paper>
        );
    }
    return (
        <>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
                {medicines.slice(0, 12).map((m) => (
                    <Paper key={m._id} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography fontWeight={700}>{m.name}</Typography>
                        <Typography variant="caption" color={brand.inkFaint}>Stock: {m.stock}</Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>{rupees(m.price)}</Typography>
                        <Button component={Link} to={`/pharmacy/medicine/${m._id}`} size="small" sx={{ mt: 'auto' }}>
                            View
                        </Button>
                    </Paper>
                ))}
            </Box>
            {medicines.length > 12 && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button component={Link} to={`/pharmacy?hospitalId=${hospitalId}`} variant="outlined">
                        View all {medicines.length} medicines
                    </Button>
                </Box>
            )}
        </>
    );
}

// ── BOOKING DIALOG ─────────────────────────────────────────────
function BookingDialog({ open, onClose, hospital, service, onSuccess }) {
    const { account } = useContext(DataContext);
    const [step, setStep] = useState(0);
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', notes: '' });

    useEffect(() => {
        if (!open) {
            setStep(0); setDate(''); setSlots([]); setSelectedSlot(''); setError('');
            return;
        }
        if (account) {
            setForm({
                customerName: account.name || account.username || '',
                customerPhone: '',
                customerEmail: account.email || '',
                notes: '',
            });
        }
    }, [open, account]);

    useEffect(() => {
        if (!date || !service || !hospital) return;
        setLoading(true);
        setSelectedSlot('');
        getHospitalSlots(hospital._id, { serviceId: service._id, date })
            .then((res) => setSlots(res.data.slots || []))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load slots'))
            .finally(() => setLoading(false));
    }, [date, service, hospital]);

    const submit = async () => {
        if (!form.customerName || !form.customerPhone) {
            setError('Name and phone are required'); return;
        }
        setSaving(true);
        setError('');
        try {
            await bookHospitalSlot(hospital._id, {
                serviceId: service._id, date, timeSlot: selectedSlot, ...form,
            });
            onSuccess(`Slot booked at ${hospital.name} on ${date} at ${selectedSlot}. Hospital will confirm shortly.`);
        } catch (e) {
            setError(e?.response?.data?.message || 'Booking failed');
        } finally {
            setSaving(false);
        }
    };

    if (!service) return null;
    const today = new Date().toISOString().slice(0, 10);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Book: {service.name}
                <Typography variant="caption" sx={{ display: 'block', color: brand.inkMuted }}>
                    {rupees(service.price)} · {service.durationMinutes} min
                </Typography>
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {step === 0 && (
                    <>
                        <TextField
                            fullWidth type="date" size="small" label="Pick a date"
                            InputLabelProps={{ shrink: true }}
                            value={date} onChange={(e) => setDate(e.target.value)}
                            inputProps={{ min: today }}
                            sx={{ mt: 1, mb: 2 }}
                        />
                        {date && (
                            loading ? (
                                <Skeleton height={80} />
                            ) : slots.length === 0 ? (
                                <Alert severity="info">No slots configured for this date.</Alert>
                            ) : (
                                <Box>
                                    <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Available slots</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {slots.map((s) => (
                                            <Chip
                                                key={s.time}
                                                label={s.time}
                                                onClick={() => !s.booked && !s.past && setSelectedSlot(s.time)}
                                                disabled={s.booked || s.past}
                                                sx={{
                                                    fontWeight: 700, cursor: (s.booked || s.past) ? 'not-allowed' : 'pointer',
                                                    background: selectedSlot === s.time ? brand.primary
                                                        : s.booked || s.past ? brand.surfaceAlt
                                                        : alpha(brand.primary, 0.1),
                                                    color: selectedSlot === s.time ? '#fff'
                                                        : s.booked || s.past ? brand.inkFaint
                                                        : brand.primary,
                                                    textDecoration: s.booked || s.past ? 'line-through' : 'none',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )
                        )}
                    </>
                )}

                {step === 1 && (
                    <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                        <Alert severity="info">
                            Confirming: <b>{service.name}</b> on <b>{date}</b> at <b>{selectedSlot}</b>
                        </Alert>
                        <TextField label="Full name *" size="small" value={form.customerName}
                            onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                        <TextField label="Phone *" size="small" value={form.customerPhone}
                            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
                        <TextField label="Email" size="small" value={form.customerEmail}
                            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                        <TextField label="Notes for the hospital" size="small" multiline rows={2}
                            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {step === 0 && (
                    <Button
                        variant="contained"
                        disabled={!selectedSlot}
                        onClick={() => setStep(1)}
                    >
                        Continue
                    </Button>
                )}
                {step === 1 && (
                    <>
                        <Button onClick={() => setStep(0)}>Back</Button>
                        <Button variant="contained" onClick={submit} disabled={saving}>
                            {saving ? 'Booking…' : 'Confirm booking'}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default HospitalDetail;
