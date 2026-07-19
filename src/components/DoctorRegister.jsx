import { useEffect, useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper, Alert,
    MenuItem, Avatar, CircularProgress, Autocomplete, InputAdornment, alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { listHospitalsPublic } from '../services/api';
import { brand } from '../theme';

const REGISTER_IMG = "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";

const SPECIALTIES = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'General Medicine', 'ENT',
    'Ophthalmology', 'Gynecology', 'Oncology', 'Radiology',
];

const initialForm = {
    name: '', email: '', speciality: '', fee: '', password: '',
    hospitalCity: '', hospitalState: '',
};

function DoctorRegister() {
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hospital selection
    const [hospitals, setHospitals] = useState([]);
    const [hospitalsLoading, setHospitalsLoading] = useState(true);
    const [selectedHospital, setSelectedHospital] = useState(null); // {_id, name, city, state} OR {inputValue, name, isNew}

    const navigate = useNavigate();

    useEffect(() => {
        listHospitalsPublic({ limit: 200 })
            .then((res) => setHospitals(res.data?.items || []))
            .catch(() => setHospitals([]))
            .finally(() => setHospitalsLoading(false));
    }, []);

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
            setError('Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('speciality', speciality);
        formData.append('fee', fee);
        formData.append('password', password);
        if (image) formData.append('file', image);

        // Hospital linkage
        if (selectedHospital) {
            if (selectedHospital._id && !selectedHospital.isNew) {
                formData.append('hospitalId', selectedHospital._id);
            } else {
                // Free-typed name — backend will auto-create
                formData.append('hospitalName', selectedHospital.name || selectedHospital.inputValue || '');
                if (form.hospitalCity) formData.append('city', form.hospitalCity);
                if (form.hospitalState) formData.append('state', form.hospitalState);
            }
        }

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

    const showNewCityFields = selectedHospital?.isNew;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                <img src={REGISTER_IMG} alt="Medicare" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: brand.surfaceMuted, overflowY: 'auto' }}>
                <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 480, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={800} mb={0.5}>Doctor Registration</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Create your Medicare doctor profile
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Profile Photo Upload */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={preview}
                            sx={{
                                width: 90, height: 90, mb: 1.5, fontSize: 36,
                                background: preview ? undefined : `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                                color: '#fff',
                            }}
                        >
                            {!preview && (form.name?.[0]?.toUpperCase() || 'Dr')}
                        </Avatar>
                        <Button
                            component="label"
                            variant="outlined" size="small"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Photo
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </Button>
                        <Typography variant="caption" color="text.secondary" mt={0.5}>
                            JPG, PNG or WEBP (optional)
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth label="Full Name *" name="name" size="small"
                        value={form.name} onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth label="Email *" name="email" type="email" size="small"
                        value={form.email} onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select fullWidth label="Speciality *" name="speciality" size="small"
                        value={form.speciality} onChange={handleChange}
                        sx={{ mb: 2 }}
                    >
                        {SPECIALTIES.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth label="Consultation Fee (₹) *" name="fee" type="number" size="small"
                        value={form.fee} onChange={handleChange}
                        inputProps={{ min: 0 }}
                        sx={{ mb: 2 }}
                    />

                    {/* Hospital section */}
                    <Typography
                        variant="caption"
                        color={brand.inkFaint}
                        fontWeight={800}
                        sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.6, mt: 1.5, mb: 1 }}
                    >
                        Affiliated Hospital
                    </Typography>
                    <Autocomplete
                        size="small"
                        options={hospitals}
                        loading={hospitalsLoading}
                        value={selectedHospital}
                        getOptionLabel={(o) => o?.name || ''}
                        isOptionEqualToValue={(a, b) => a?._id === b?._id && !a?.isNew && !b?.isNew}
                        filterOptions={(options, params) => {
                            const filtered = options.filter((o) =>
                                (o.name || '').toLowerCase().includes(params.inputValue.toLowerCase())
                            );
                            const inputValue = params.inputValue.trim();
                            // Suggest "add new" if user typed something that doesn't exactly match
                            const exact = options.some((o) => (o.name || '').toLowerCase() === inputValue.toLowerCase());
                            if (inputValue && !exact) {
                                filtered.push({
                                    inputValue,
                                    name: `Add new: "${inputValue}"`,
                                    _addNew: true,
                                });
                            }
                            return filtered;
                        }}
                        onChange={(_, newValue) => {
                            if (newValue?._addNew) {
                                setSelectedHospital({
                                    name: newValue.inputValue,
                                    isNew: true,
                                });
                            } else {
                                setSelectedHospital(newValue);
                            }
                        }}
                        onInputChange={(_, val, reason) => {
                            // If the user clears the field, drop the selection
                            if (reason === 'clear') setSelectedHospital(null);
                        }}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={option._id || option.inputValue || option.name}>
                                {option._addNew ? (
                                    <>
                                        <AddCircleOutlineIcon fontSize="small" sx={{ color: brand.primary, mr: 1 }} />
                                        <Typography variant="body2" color={brand.primary} fontWeight={600}>
                                            {option.name}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <LocalHospitalIcon fontSize="small" sx={{ color: brand.inkFaint, mr: 1 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.city}{option.state ? `, ${option.state}` : ''}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search or type a new hospital name"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                                                <LocalHospitalIcon fontSize="small" sx={{ color: brand.inkFaint }} />
                                            </InputAdornment>
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {hospitalsLoading ? <CircularProgress size={16} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{ mb: showNewCityFields ? 1 : 2 }}
                    />

                    {selectedHospital && !selectedHospital.isNew && (
                        <Alert severity="info" sx={{ mb: 2, py: 0.5 }} icon={<LocalHospitalIcon fontSize="small" />}>
                            You'll be listed under <b>{selectedHospital.name}</b>
                            {selectedHospital.city ? `, ${selectedHospital.city}` : ''}.
                        </Alert>
                    )}

                    {showNewCityFields && (
                        <Box sx={{
                            p: 1.5, mb: 2, borderRadius: 2,
                            background: alpha(brand.primary, 0.06),
                            border: `1px dashed ${alpha(brand.primary, 0.4)}`,
                        }}>
                            <Typography variant="caption" color={brand.primary} fontWeight={700} sx={{ display: 'block', mb: 1 }}>
                                We'll create <b>"{selectedHospital.name}"</b> as a new hospital. Optional details:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth size="small" label="City" name="hospitalCity"
                                    value={form.hospitalCity} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth size="small" label="State" name="hospitalState"
                                    value={form.hospitalState} onChange={handleChange}
                                />
                            </Box>
                        </Box>
                    )}

                    <TextField
                        fullWidth label="Password *" name="password" type="password" size="small"
                        value={form.password} onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={handleSubmit} disabled={loading}
                        sx={{ py: 1.5, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Register as Doctor'}
                    </Button>

                    <Typography variant="body2" textAlign="center">
                        Already registered?{' '}
                        <Link to="/login" style={{ color: brand.primary, fontWeight: 600 }}>Sign in</Link>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default DoctorRegister;
