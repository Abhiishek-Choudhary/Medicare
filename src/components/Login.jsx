import { useContext, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authenticateLogin, authenticateDocLogin } from '../services/api';
import { DataContext } from '../context/DataProvider';

const LOGIN_IMG = "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";

function Login() {
    const location = useLocation();
    const [tab, setTab] = useState(location.state?.tab ?? 0);
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);
    const justRegistered = location.state?.registered;

    const isDoctor = tab === 1;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleTabChange = (_, val) => {
        setTab(val);
        setForm({ email: '', password: '', name: '' });
        setError('');
    };

    const handleSubmit = async () => {
        if (isDoctor) {
            if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
        } else {
            if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
        }

        setLoading(true);
        const response = isDoctor
            ? await authenticateDocLogin({ email: form.email, password: form.password })
            : await authenticateLogin({ email: form.email, password: form.password });
        setLoading(false);

        if (response?.data?.success) {
            const userData = response.data.data;
            if (!isDoctor && userData.role === 'hospital') {
                setError('This is a hospital account. Please use "For Hospitals" sign in.');
                return;
            }
            const resolvedRole = isDoctor ? 'doctor' : 'patient';
            setAccount(userData, resolvedRole, response.data.token);
            if (!isDoctor && userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(isDoctor ? '/doctor-dashboard' : '/');
            }
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                <img src={LOGIN_IMG} alt="Medicare" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#f8fafd' }}>
                <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 440, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>Sign In</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Welcome back to Medicare
                    </Typography>

                    <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }} variant="fullWidth">
                        <Tab icon={<PersonIcon />} iconPosition="start" label="Patient" />
                        <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Doctor" />
                    </Tabs>

                    {justRegistered && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Registration successful! Please sign in with your credentials.
                        </Alert>
                    )}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {isDoctor ? (
                        <>
                            <TextField
                                fullWidth label="Email" name="email" type="email"
                                value={form.email} onChange={handleChange} onKeyDown={handleKeyDown}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth label="Password" name="password" type="password"
                                value={form.password} onChange={handleChange} onKeyDown={handleKeyDown}
                                sx={{ mb: 3 }}
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                fullWidth label="Email" name="email" type="email"
                                value={form.email} onChange={handleChange} onKeyDown={handleKeyDown}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth label="Password" name="password" type="password"
                                value={form.password} onChange={handleChange} onKeyDown={handleKeyDown}
                                sx={{ mb: 3 }}
                            />
                        </>
                    )}

                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={handleSubmit} disabled={loading}
                        sx={{ borderRadius: 2, py: 1.5, mb: 2 }}
                    >
                        {loading ? 'Signing in...' : `Login as ${isDoctor ? 'Doctor' : 'Patient'}`}
                    </Button>

                    <Typography variant="body2" textAlign="center">
                        {isDoctor ? (
                            <>
                                Not registered?{' '}
                                <Link to="/doctor-register" style={{ color: '#1976d2', fontWeight: 600 }}>Register as Doctor</Link>
                            </>
                        ) : (
                            <>
                                New here?{' '}
                                <Link to="/register" style={{ color: '#1976d2', fontWeight: 600 }}>Create an account</Link>
                            </>
                        )}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default Login;
