import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateSignUp } from '../services/api';

const REGISTER_IMG = "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";

const initialValues = { username: '', email: '', password: '' };

function Register() {
    const [form, setForm] = useState(initialValues);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.username || !form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        const response = await authenticateSignUp(form);
        setLoading(false);
        if (response?.data) {
            navigate('/login');
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                <img src={REGISTER_IMG} alt="Medicare" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#f8fafd' }}>
                <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 440, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>Create Account</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Join Medicare as a patient
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField fullWidth label="Username" name="username" value={form.username}
                        onChange={onChange} onKeyDown={handleKeyDown} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Email" name="email" type="email" value={form.email}
                        onChange={onChange} onKeyDown={handleKeyDown} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Password" name="password" type="password" value={form.password}
                        onChange={onChange} onKeyDown={handleKeyDown} sx={{ mb: 3 }} />

                    <Button fullWidth variant="contained" size="large" onClick={handleSubmit}
                        disabled={loading} sx={{ borderRadius: 2, py: 1.5, mb: 2 }}>
                        {loading ? 'Creating account...' : 'Register'}
                    </Button>

                    <Typography variant="body2" textAlign="center">
                        Already registered?{' '}
                        <Link to="/login" style={{ color: '#1976d2', fontWeight: 600 }}>Sign in</Link>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default Register;
