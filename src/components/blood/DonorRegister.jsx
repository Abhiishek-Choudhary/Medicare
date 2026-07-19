import { useContext, useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel,
    Chip, FormControlLabel, Switch, Alert, Divider, Skeleton, Dialog, DialogTitle,
    DialogContent, DialogActions, alpha,
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {
    getBloodMeta, registerDonor, getMyDonorProfile, updateMyDonorProfile, deleteMyDonorProfile,
} from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DEFAULT_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const emptyForm = {
    fullName: '', phone: '', email: '',
    bloodGroup: '', age: '', weight: '', gender: '',
    city: '', state: '', pincode: '', address: '',
    availableMonths: [],
    lastDonationDate: '',
    medicalConditions: '',
    showContactInfo: true,
    isActive: true,
};

function DonorRegister() {
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const [form, setForm] = useState(emptyForm);
    const [meta, setMeta] = useState({ bloodGroups: BLOOD_GROUPS, months: DEFAULT_MONTHS });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [existingId, setExistingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!account || role === 'doctor') {
            navigate('/login', { state: { from: '/blood/register' } });
            return;
        }
        Promise.all([
            getBloodMeta().catch(() => ({ data: { bloodGroups: BLOOD_GROUPS, months: DEFAULT_MONTHS } })),
            getMyDonorProfile().catch(() => ({ data: null })),
        ]).then(([metaRes, meRes]) => {
            setMeta(metaRes.data);
            if (meRes.data) {
                setExistingId(meRes.data._id);
                setForm({
                    ...emptyForm,
                    ...meRes.data,
                    lastDonationDate: meRes.data.lastDonationDate ? meRes.data.lastDonationDate.slice(0, 10) : '',
                });
            } else {
                // Prefill from account
                setForm((f) => ({
                    ...f,
                    fullName: account.name || account.username || '',
                    email: account.email || '',
                }));
            }
        }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMonth = (m) => {
        setForm((f) => ({
            ...f,
            availableMonths: f.availableMonths.includes(m)
                ? f.availableMonths.filter((x) => x !== m)
                : [...f.availableMonths, m],
        }));
    };

    const selectAllMonths = () => setForm({ ...form, availableMonths: [...meta.months] });
    const clearMonths = () => setForm({ ...form, availableMonths: [] });

    const validate = () => {
        const required = ['fullName', 'phone', 'email', 'bloodGroup', 'age', 'city', 'state'];
        for (const r of required) {
            if (!form[r]) return `${r} is required`;
        }
        if (form.availableMonths.length === 0) return 'Please select at least one available month';
        if (form.age < 18 || form.age > 70) return 'Age must be between 18 and 70';
        if (form.phone.length < 10) return 'Enter a valid phone number';
        if (form.pincode && !/^\d{6}$/.test(form.pincode)) return 'Pincode must be 6 digits';
        return null;
    };

    const handleSubmit = async () => {
        const v = validate();
        if (v) { setError(v); return; }
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, age: Number(form.age), weight: form.weight ? Number(form.weight) : undefined };
            if (!payload.lastDonationDate) delete payload.lastDonationDate;

            if (existingId) {
                await updateMyDonorProfile(payload);
                setToast('Your donor profile has been updated');
            } else {
                const res = await registerDonor(payload);
                setExistingId(res.data._id);
                setToast('You are now registered as a blood donor. Thank you!');
            }
            setTimeout(() => setToast(''), 3500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteMyDonorProfile();
            navigate('/blood');
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
        } finally {
            setSaving(false);
            setConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 4 }}>
                    <Skeleton variant="rounded" height={500} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <BloodtypeIcon sx={{ color: brand.danger, fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            {existingId ? 'Update Donor Profile' : 'Register as a Blood Donor'}
                        </Typography>
                        <Typography variant="body2" color={brand.inkMuted}>
                            Every donation can save up to 3 lives.
                        </Typography>
                    </Box>
                </Box>

                {toast && <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>{toast}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Personal details</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField label="Full name *" value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        <TextField label="Phone *" value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        <TextField label="Email *" value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <FormControl>
                            <InputLabel>Blood group *</InputLabel>
                            <Select
                                value={form.bloodGroup} label="Blood group *"
                                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                            >
                                {(meta.bloodGroups || BLOOD_GROUPS).map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Age * (18–70)" type="number" value={form.age}
                            onChange={(e) => setForm({ ...form, age: e.target.value })} />
                        <TextField label="Weight (kg)" type="number" value={form.weight}
                            onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                        <FormControl>
                            <InputLabel>Gender</InputLabel>
                            <Select value={form.gender} label="Gender"
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                                <MenuItem value=""><em>Prefer not to say</em></MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Last donation date (optional)" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.lastDonationDate}
                            onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })} />
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Location</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField label="City *" value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        <TextField label="State *" value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })} />
                        <TextField label="Pincode" value={form.pincode}
                            onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                        <TextField label="Address (optional)" value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="h6" fontWeight={800}>Availability</Typography>
                        <Box>
                            <Button size="small" onClick={selectAllMonths}>Select all</Button>
                            <Button size="small" onClick={clearMonths} sx={{ color: brand.inkMuted }}>Clear</Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 2 }}>
                        Pick the months you're willing to donate in.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {meta.months.map((m) => {
                            const active = form.availableMonths.includes(m);
                            return (
                                <Chip
                                    key={m}
                                    label={m}
                                    onClick={() => toggleMonth(m)}
                                    sx={{
                                        fontWeight: 700, cursor: 'pointer',
                                        background: active ? brand.danger : alpha(brand.danger, 0.08),
                                        color: active ? '#fff' : brand.danger,
                                        '&:hover': {
                                            background: active ? brand.danger : alpha(brand.danger, 0.18),
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Medical & Privacy</Typography>
                    <TextField
                        fullWidth multiline rows={2}
                        label="Medical conditions / medications (optional)"
                        value={form.medicalConditions}
                        onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.showContactInfo}
                                onChange={(e) => setForm({ ...form, showContactInfo: e.target.checked })}
                            />
                        }
                        label="Show my phone and email to blood-seekers"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            />
                        }
                        label="I'm actively available for donations"
                    />
                </Paper>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained" size="large" color="error"
                        onClick={handleSubmit} disabled={saving}
                        sx={{ flex: 1, minWidth: 200 }}
                    >
                        {saving ? 'Saving…' : existingId ? 'Update profile' : 'Register as donor'}
                    </Button>
                    {existingId && (
                        <Button
                            variant="outlined" color="error" size="large"
                            startIcon={<DeleteIcon />}
                            onClick={() => setConfirmDelete(true)}
                            disabled={saving}
                        >
                            Remove my profile
                        </Button>
                    )}
                </Box>
            </Box>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Remove yourself from the donor list?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        You'll be removed from search results. You can re-register anytime.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
                        {saving ? 'Removing…' : 'Remove me'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
}

export default DonorRegister;
