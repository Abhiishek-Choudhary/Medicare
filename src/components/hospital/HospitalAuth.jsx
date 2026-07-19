import { useContext, useState } from 'react';
import {
    Box, Paper, TextField, Button, Typography, Tabs, Tab, Alert,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link, useNavigate } from 'react-router-dom';
import { hospitalLogin, hospitalSignup } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const HOSPITAL_IMG = "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=1200&q=80";

function HospitalAuth({ initialTab = 0 }) {
    const [tab, setTab] = useState(initialTab);
    const [form, setForm] = useState({
        username: '', email: '', password: '', phone: '',
        hospitalName: '', address: '', city: '', state: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);

    const change = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) { setError('Email and password required'); return; }
        setLoading(true);
        try {
            const { data } = await hospitalLogin({ email: form.email, password: form.password });
            if (!data?.success) { setError(data?.message || 'Login failed'); return; }
            setAccount(
                { ...data.user, role: 'hospital', hospitalId: data.user.hospitalId },
                'hospital',
                data.token
            );
            navigate('/hospital/dashboard');
        } catch (e) {
            setError(e?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        const req = ['username', 'email', 'password', 'hospitalName', 'address', 'city', 'state'];
        for (const k of req) {
            if (!form[k]) { setError(`${k} is required`); return; }
        }
        setLoading(true);
        try {
            const { data } = await hospitalSignup(form);
            if (!data?.success) { setError(data?.message || 'Signup failed'); return; }
            setAccount(
                { ...data.user, role: 'hospital', hospitalId: data.user.hospitalId },
                'hospital',
                data.token
            );
            navigate('/hospital/dashboard');
        } catch (e) {
            setError(e?.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') tab === 0 ? handleLogin() : handleSignup();
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, position: 'relative' }}>
                <img
                    src={HOSPITAL_IMG}
                    alt="Hospital"
                    style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
                />
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(14,165,164,0.85), rgba(11,136,134,0.75))',
                    color: '#fff', p: 5,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                    <LocalHospitalIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h3" fontWeight={800}>Hospital Panel</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 1, maxWidth: 480 }}>
                        Manage services, list your doctors and medicines, and take bookings from patients.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: brand.surfaceMuted }}>
                <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 460, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={800} mb={0.5}>
                        {tab === 0 ? 'Hospital Login' : 'Register your Hospital'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {tab === 0 ? 'Sign in to manage your hospital.' : 'Get started in less than a minute.'}
                    </Typography>

                    <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} sx={{ mb: 3 }} variant="fullWidth">
                        <Tab label="Sign In" />
                        <Tab label="Register" />
                    </Tabs>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {tab === 0 ? (
                        <>
                            <TextField fullWidth label="Email" name="email" value={form.email}
                                onChange={change} onKeyDown={handleKeyDown} sx={{ mb: 2 }} />
                            <TextField fullWidth label="Password" name="password" type="password" value={form.password}
                                onChange={change} onKeyDown={handleKeyDown} sx={{ mb: 3 }} />
                            <Button fullWidth size="large" variant="contained" onClick={handleLogin}
                                disabled={loading} sx={{ py: 1.5, mb: 2 }}>
                                {loading ? 'Signing in…' : 'Sign In'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>ACCOUNT</Typography>
                            <TextField fullWidth label="Owner username" name="username" value={form.username} onChange={change} sx={{ mb: 2 }} size="small" />
                            <TextField fullWidth label="Owner email" name="email" type="email" value={form.email} onChange={change} sx={{ mb: 2 }} size="small" />
                            <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={change} sx={{ mb: 2 }} size="small" />
                            <TextField fullWidth label="Contact phone" name="phone" value={form.phone} onChange={change} sx={{ mb: 3 }} size="small" />

                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>HOSPITAL</Typography>
                            <TextField fullWidth label="Hospital name" name="hospitalName" value={form.hospitalName} onChange={change} sx={{ mb: 2 }} size="small" />
                            <TextField fullWidth label="Address" name="address" value={form.address} onChange={change} sx={{ mb: 2 }} size="small" />
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                <TextField fullWidth label="City" name="city" value={form.city} onChange={change} size="small" />
                                <TextField fullWidth label="State" name="state" value={form.state} onChange={change} size="small" />
                            </Box>
                            <Button fullWidth size="large" variant="contained" onClick={handleSignup}
                                disabled={loading} sx={{ py: 1.5, mb: 2 }}>
                                {loading ? 'Creating account…' : 'Create hospital account'}
                            </Button>
                        </>
                    )}

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        Not a hospital?{' '}
                        <Link to="/login" style={{ color: brand.primary, fontWeight: 600 }}>Patient / Doctor login</Link>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default HospitalAuth;
