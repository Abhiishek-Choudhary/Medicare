import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, InputAdornment,
    Button, Grid, Chip, Avatar, Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import { getDoctors } from '../redux/action/doctorAction';

const FALLBACK_IMG = 'https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg';

const FEATURES = [
    {
        icon: FavoriteIcon,
        title: 'Trusted Doctors',
        desc: 'All doctors are verified and certified by medical boards.',
        color: '#e53935',
        bg: '#fff5f5',
    },
    {
        icon: AccessTimeIcon,
        title: 'Instant Booking',
        desc: 'Book appointments in under a minute, any time of day.',
        color: '#1976d2',
        bg: '#f0f7ff',
    },
    {
        icon: SecurityIcon,
        title: 'Secure & Private',
        desc: 'Your health data is encrypted and never shared.',
        color: '#2e7d32',
        bg: '#f0fff4',
    },
    {
        icon: LocalHospitalIcon,
        title: 'All Specialties',
        desc: 'From cardiology to psychiatry — find the right specialist.',
        color: '#6a1b9a',
        bg: '#f8f0ff',
    },
];

const SPECIALTIES = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry'];

function Home() {
    const { doctors } = useSelector((state) => state.getDoctors);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');

    useEffect(() => {
        dispatch(getDoctors());
    }, [dispatch]);

    const filtered = (doctors || [])
        .filter(d => {
            const matchSearch =
                !search ||
                d.name?.toLowerCase().includes(search.toLowerCase()) ||
                d.speciality?.toLowerCase().includes(search.toLowerCase());
            const matchSpecialty = !specialty || d.speciality === specialty;
            return matchSearch && matchSpecialty;
        })
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    const preview = filtered.slice(0, 4);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />
            <Hero />

            {/* Features Section */}
            <Box sx={{ px: { xs: 3, md: 8 }, py: 8, maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" fontWeight={800} mb={1}>
                        Why Choose <Box component="span" sx={{ color: '#1976d2' }}>Medicare?</Box>
                    </Typography>
                    <Typography color="text.secondary" maxWidth={500} mx="auto">
                        Everything you need for a seamless healthcare experience
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
                        <Grid item xs={12} sm={6} md={3} key={title}>
                            <Box sx={{
                                bgcolor: '#fff', borderRadius: 3, p: 3.5,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                            }}>
                                <Box sx={{
                                    width: 52, height: 52, borderRadius: 2.5,
                                    bgcolor: bg, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', mb: 2,
                                }}>
                                    <Icon sx={{ color, fontSize: 28 }} />
                                </Box>
                                <Typography fontWeight={700} mb={0.8}>{title}</Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Doctors Section */}
            <Box sx={{ bgcolor: '#fff', py: 8 }}>
                <Box sx={{ px: { xs: 3, md: 8 }, maxWidth: 1200, mx: 'auto' }}>
                    {/* Section header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} mb={0.5}>
                                Top Rated <Box component="span" sx={{ color: '#1976d2' }}>Doctors</Box>
                            </Typography>
                            <Typography color="text.secondary" fontSize={15}>
                                Highly rated specialists trusted by thousands of patients
                            </Typography>
                        </Box>
                        <Button
                            component={Link} to="/doctors"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: 2, fontWeight: 600, color: '#1976d2' }}
                        >
                            View All
                        </Button>
                    </Box>

                    {/* Search + Filter */}
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search doctors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafd' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="All" size="small" onClick={() => setSpecialty('')}
                                color={!specialty ? 'primary' : 'default'}
                                variant={!specialty ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }} />
                            {SPECIALTIES.map(s => (
                                <Chip key={s} label={s} size="small"
                                    onClick={() => setSpecialty(s === specialty ? '' : s)}
                                    color={specialty === s ? 'primary' : 'default'}
                                    variant={specialty === s ? 'filled' : 'outlined'}
                                    sx={{ cursor: 'pointer' }} />
                            ))}
                        </Box>
                    </Box>

                    {/* Doctor cards */}
                    {preview.length > 0 ? (
                        <Grid container spacing={2.5}>
                            {preview.map(doctor => (
                                <Grid item xs={12} sm={6} md={3} key={doctor._id}>
                                    <Box
                                        onClick={() => navigate(`/docprofile/${doctor._id}`)}
                                        sx={{
                                            bgcolor: '#fff',
                                            borderRadius: 3,
                                            border: '1px solid #e8f0fe',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 10px 28px rgba(25,118,210,0.14)',
                                            },
                                        }}
                                    >
                                        {/* Image */}
                                        <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                                            <Box
                                                component="img"
                                                src={doctor.imageUrl || FALLBACK_IMG}
                                                alt={doctor.name}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Box sx={{
                                                position: 'absolute', inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)',
                                            }} />
                                            <Chip
                                                label="● Available"
                                                size="small"
                                                sx={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    bgcolor: 'rgba(46,125,50,0.9)', color: '#fff',
                                                    fontSize: 10, fontWeight: 700,
                                                    '& .MuiChip-label': { px: 1 },
                                                }}
                                            />
                                        </Box>

                                        {/* Info */}
                                        <Box sx={{ p: 2 }}>
                                            <Typography fontWeight={700} fontSize={15} noWrap>
                                                Dr. {doctor.name}
                                            </Typography>
                                            <Chip
                                                label={doctor.speciality}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontSize: 10, my: 0.8, height: 22 }}
                                            />

                                            {/* Rating row */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                {doctor.averageRating > 0 ? (
                                                    <>
                                                        <Rating value={doctor.averageRating} precision={0.5} readOnly size="small"
                                                            sx={{ fontSize: 14 }} />
                                                        <Typography variant="caption" fontWeight={700} color="#f59e0b">
                                                            {doctor.averageRating.toFixed(1)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ({doctor.totalRatings})
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">New Doctor</Typography>
                                                )}
                                            </Box>

                                            {/* Fee + Book */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <CurrencyRupeeIcon sx={{ fontSize: 14, color: '#1976d2' }} />
                                                    <Typography fontWeight={700} fontSize={14} color="#1976d2">
                                                        {doctor.fee}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/docprofile/${doctor._id}`); }}
                                                    sx={{ borderRadius: 2, fontSize: 11, fontWeight: 600, px: 1.5, py: 0.4, textTransform: 'none', minWidth: 0 }}
                                                >
                                                    Book
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography color="text.secondary">
                                {!doctors?.length ? 'Loading doctors...' : 'No doctors match your search.'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* CTA Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                py: 8, px: { xs: 3, md: 8 }, textAlign: 'center',
            }}>
                <Typography variant="h4" fontWeight={800} color="#fff" mb={1}>
                    Ready to take charge of your health?
                </Typography>
                <Typography color="rgba(255,255,255,0.85)" mb={4} fontSize={16}>
                    Join thousands of patients who trust Medicare for their healthcare needs.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        component={Link} to="/register"
                        variant="contained"
                        size="large"
                        sx={{ bgcolor: '#fff', color: '#1976d2', borderRadius: 2, px: 4, fontWeight: 700, '&:hover': { bgcolor: '#e3f2fd' } }}
                    >
                        Sign Up Free
                    </Button>
                    <Button
                        component={Link} to="/doctors"
                        variant="outlined"
                        size="large"
                        sx={{ color: '#fff', borderColor: '#fff', borderRadius: 2, px: 4, fontWeight: 700, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        Browse Doctors
                    </Button>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

export default Home;
