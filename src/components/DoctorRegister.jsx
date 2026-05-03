import { useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper, Alert,
    MenuItem, Avatar, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REGISTER_IMG = "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";

const SPECIALTIES = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'General Medicine', 'ENT',
    'Ophthalmology', 'Gynecology', 'Oncology', 'Radiology',
];

const initialForm = { name: '', email: '', speciality: '', fee: '', password: '' };

function DoctorRegister() {
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError('');
    };

    const handleSubmit = async () => {
        const { name, email, speciality, fee, password } = form;
        if (!name || !email || !speciality || !fee || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('speciality', speciality);
        formData.append('fee', fee);
        formData.append('password', password);
        formData.append('file', image);

        setLoading(true);
        try {
            const response = await axios.post('https://medicare2-0.onrender.com/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response?.data?.doctor) {
                navigate('/login', { state: { tab: 1, registered: true } });
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            const msg = err?.response?.data?.error || 'Registration failed. Email may already be registered.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                <img src={REGISTER_IMG} alt="Medicare" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#f8fafd', overflowY: 'auto' }}>
                <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 460, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>Doctor Registration</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Create your Medicare doctor profile
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Profile Photo Upload */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={preview}
                            sx={{ width: 90, height: 90, mb: 1.5, bgcolor: '#e3f2fd', fontSize: 36 }}
                        >
                            {!preview && '👨‍⚕️'}
                        </Avatar>
                        <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Upload Photo
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </Button>
                        <Typography variant="caption" color="text.secondary" mt={0.5}>
                            JPG, PNG or WEBP (optional)
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth label="Full Name" name="name"
                        value={form.name} onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth label="Email" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select fullWidth label="Speciality" name="speciality"
                        value={form.speciality} onChange={handleChange}
                        sx={{ mb: 2 }}
                    >
                        {SPECIALTIES.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth label="Consultation Fee (₹)" name="fee" type="number"
                        value={form.fee} onChange={handleChange}
                        inputProps={{ min: 0 }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth label="Password" name="password" type="password"
                        value={form.password} onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={handleSubmit} disabled={loading}
                        sx={{ borderRadius: 2, py: 1.5, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Doctor'}
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

export default DoctorRegister;
