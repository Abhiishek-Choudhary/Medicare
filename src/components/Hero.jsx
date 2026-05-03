import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, FormControl, FormControlLabel,
    RadioGroup, Radio, Grid, Alert
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import { userDetails } from '../services/api';

const HERO_IMG = 'https://img.freepik.com/premium-photo/four-people-wearing-lab-coats-are-posing-photo_198067-951158.jpg?w=740';

const STATS = [
    { icon: GroupsIcon, value: '500+', label: 'Doctors' },
    { icon: CalendarMonthIcon, value: '10k+', label: 'Appointments' },
    { icon: VerifiedIcon, value: '98%', label: 'Satisfaction' },
    { icon: SupportAgentIcon, value: '24/7', label: 'Support' },
];

const initialForm = { firstname: '', lastname: '', age: '', gender: '', issues: '', radio: '', precription: '' };

function Hero() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const onValueChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        const response = await userDetails(form);
        setLoading(false);
        if (response) {
            setSubmitted(true);
            setTimeout(() => { setOpen(false); setSubmitted(false); setForm(initialForm); }, 2000);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 50%, #e3f2fd 100%)',
                    px: { xs: 3, md: 8 },
                    py: { xs: 6, md: 8 },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', maxWidth: 1200, mx: 'auto' }}>
                    {/* Text Side */}
                    <Box sx={{ flex: 1, minWidth: 280 }}>
                        <Box sx={{
                            display: 'inline-block', bgcolor: '#e3f2fd', color: '#1976d2',
                            px: 2, py: 0.5, borderRadius: 5, fontSize: 13, fontWeight: 600, mb: 2
                        }}>
                            #1 Healthcare Platform
                        </Box>
                        <Typography
                            variant="h3"
                            fontWeight={800}
                            lineHeight={1.2}
                            mb={2}
                            sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}
                        >
                            Find & Book{' '}
                            <Box component="span" sx={{ color: '#1976d2' }}>Appointments</Box>
                            {' '}with Your{' '}
                            <Box component="span" sx={{ color: '#1976d2' }}>Favourite</Box>{' '}
                            Doctor
                        </Typography>
                        <Typography color="text.secondary" fontSize={16} lineHeight={1.8} mb={4} maxWidth={480}>
                            Connect with verified healthcare professionals, book appointments instantly,
                            and manage your health records — all in one place.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/doctors"
                                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }}
                            >
                                Book Appointment
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => setOpen(true)}
                                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Box>

                    {/* Image Side */}
                    <Box sx={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{
                            position: 'relative',
                            '&::before': {
                                content: '""', position: 'absolute',
                                inset: -12, borderRadius: '1.5rem',
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                opacity: 0.15, zIndex: 0,
                            }
                        }}>
                            <img
                                src={HERO_IMG}
                                alt="Healthcare professionals"
                                style={{
                                    width: '100%', maxWidth: 480,
                                    borderRadius: '1.2rem',
                                    objectFit: 'cover',
                                    position: 'relative', zIndex: 1,
                                    boxShadow: '0 20px 60px rgba(25, 118, 210, 0.2)',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Stats Bar */}
            <Box sx={{ bgcolor: '#1976d2', py: 3 }}>
                <Box sx={{
                    maxWidth: 1200, mx: 'auto', px: 4,
                    display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2
                }}>
                    {STATS.map(({ icon: Icon, value, label }) => (
                        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#fff' }}>
                            <Icon sx={{ fontSize: 32, opacity: 0.9 }} />
                            <Box>
                                <Typography fontWeight={800} fontSize={22} lineHeight={1}>{value}</Typography>
                                <Typography fontSize={13} sx={{ opacity: 0.85 }}>{label}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Patient Form Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: 20, pb: 0 }}>Patient Health Form</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {submitted ? (
                        <Alert severity="success" sx={{ my: 2 }}>
                            Details saved successfully! We'll get in touch soon.
                        </Alert>
                    ) : (
                        <>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="First Name" name="firstname" onChange={onValueChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Last Name" name="lastname" onChange={onValueChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Age" name="age" type="number" onChange={onValueChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Gender" name="gender" onChange={onValueChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Medical Issues" name="issues" multiline rows={2} onChange={onValueChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                                        Have you consulted a doctor before?
                                    </Typography>
                                    <FormControl>
                                        <RadioGroup row name="radio" onChange={onValueChange}>
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" name="radio" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" name="radio" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Current Prescription / Medicines"
                                        name="precription" multiline rows={2} onChange={onValueChange}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>
                {!submitted && (
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ borderRadius: 2, px: 4 }}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
}

export default Hero;
