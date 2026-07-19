import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, InputAdornment,
    Button, Grid, Chip, alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoctorCard from './Card';
import DoctorCardSkeleton from './DoctorCardSkeleton';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import { getDoctors } from '../redux/action/doctorAction';
import { brand } from '../theme';

const FEATURES = [
    {
        icon: FavoriteIcon,
        title: 'Verified Doctors',
        desc: 'Every specialist is vetted and certified by medical boards.',
        color: brand.danger,
        bg: '#FEF2F2',
    },
    {
        icon: AccessTimeIcon,
        title: 'Instant Booking',
        desc: 'Slot an appointment in under a minute, any time of day.',
        color: brand.primary,
        bg: brand.primarySoft,
    },
    {
        icon: SecurityIcon,
        title: 'Private & Secure',
        desc: 'Your health data is encrypted end-to-end. Never shared.',
        color: brand.success,
        bg: '#ECFDF5',
    },
    {
        icon: LocalHospitalIcon,
        title: 'All Specialties',
        desc: 'Cardiology to psychiatry — find the right care, fast.',
        color: '#7C3AED',
        bg: '#F5F3FF',
    },
];

const SPECIALTIES = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry'];

function SectionEyebrow({ children }) {
    return (
        <Typography sx={{
            display: 'inline-block',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: brand.primary,
            background: brand.primarySoft, borderRadius: 999,
            px: 1.5, py: 0.4, mb: 1.5,
        }}>
            {children}
        </Typography>
    );
}

function Home() {
    const { doctors, loading } = useSelector((state) => state.getDoctors);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');

    useEffect(() => {
        dispatch(getDoctors());
    }, [dispatch]);

    const isLoading = loading || !doctors;

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
        <Box sx={{ minHeight: '100vh', bgcolor: brand.surfaceMuted }}>
            <Navbar />
            <Hero />

            {/* Features Section */}
            <Box sx={{ px: { xs: 3, md: 8 }, pt: { xs: 8, md: 12 }, pb: 8, maxWidth: 1240, mx: 'auto' }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <SectionEyebrow>Why Medicare</SectionEyebrow>
                    <Typography variant="h3" fontWeight={800} mb={1.5} sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' }, letterSpacing: '-0.02em' }}>
                        Care that fits into your life
                    </Typography>
                    <Typography color="text.secondary" maxWidth={560} mx="auto" fontSize={16}>
                        Everything you need for a calmer, more connected healthcare experience.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
                        <Grid item xs={12} sm={6} md={3} key={title}>
                            <Box sx={{
                                position: 'relative',
                                bgcolor: '#fff',
                                borderRadius: 4,
                                p: 3.5,
                                border: `1px solid ${brand.border}`,
                                height: '100%',
                                overflow: 'hidden',
                                transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 20px 44px rgba(15,23,42,0.10)',
                                    borderColor: alpha(color, 0.4),
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -30, right: -30,
                                    width: 90, height: 90,
                                    borderRadius: '50%',
                                    background: alpha(color, 0.06),
                                },
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    width: 52, height: 52, borderRadius: 3,
                                    bgcolor: bg, display: 'grid', placeItems: 'center', mb: 2.5,
                                }}>
                                    <Icon sx={{ color, fontSize: 26 }} />
                                </Box>
                                <Typography fontWeight={800} mb={0.8} fontSize={17} letterSpacing="-0.01em">
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.7} fontSize={13.5}>
                                    {desc}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Doctors Section */}
            <Box sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 }, borderTop: `1px solid ${brand.border}`, borderBottom: `1px solid ${brand.border}` }}>
                <Box sx={{ px: { xs: 3, md: 8 }, maxWidth: 1240, mx: 'auto' }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                        mb: 4, flexWrap: 'wrap', gap: 2,
                    }}>
                        <Box>
                            <SectionEyebrow>Featured</SectionEyebrow>
                            <Typography variant="h3" fontWeight={800} mb={0.8}
                                sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' }, letterSpacing: '-0.02em' }}>
                                Top rated doctors
                            </Typography>
                            <Typography color="text.secondary" fontSize={15.5}>
                                Highly rated specialists trusted by thousands of patients.
                            </Typography>
                        </Box>
                        <Button
                            component={Link} to="/doctors"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                borderRadius: 999, fontWeight: 700,
                                color: brand.primary,
                                border: `1.5px solid ${brand.primarySoft}`,
                                px: 2.5, py: 1,
                                '&:hover': { background: brand.primarySoft, borderColor: brand.primary },
                            }}
                        >
                            View all doctors
                        </Button>
                    </Box>

                    {/* Search + Filter */}
                    <Box sx={{
                        display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center',
                        p: 2, borderRadius: 3,
                        bgcolor: brand.surfaceMuted,
                        border: `1px solid ${brand.border}`,
                    }}>
                        <TextField
                            placeholder="Search by doctor name or specialty..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" sx={{ color: brand.inkFaint }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 280, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                            <Chip
                                label="All"
                                size="small"
                                onClick={() => setSpecialty('')}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    background: !specialty ? brand.ink : '#fff',
                                    color: !specialty ? '#fff' : brand.inkMuted,
                                    border: `1px solid ${!specialty ? brand.ink : brand.border}`,
                                    '&:hover': { background: !specialty ? brand.ink : brand.surfaceAlt },
                                }}
                            />
                            {SPECIALTIES.map(s => {
                                const active = specialty === s;
                                return (
                                    <Chip
                                        key={s}
                                        label={s}
                                        size="small"
                                        onClick={() => setSpecialty(active ? '' : s)}
                                        sx={{
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            background: active ? brand.ink : '#fff',
                                            color: active ? '#fff' : brand.inkMuted,
                                            border: `1px solid ${active ? brand.ink : brand.border}`,
                                            '&:hover': { background: active ? brand.ink : brand.surfaceAlt },
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Doctor cards / skeletons / empty */}
                    {isLoading ? (
                        <Grid container spacing={3}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <DoctorCardSkeleton />
                                </Grid>
                            ))}
                        </Grid>
                    ) : preview.length > 0 ? (
                        <Grid container spacing={3}>
                            {preview.map(doctor => (
                                <Grid item xs={12} sm={6} md={3} key={doctor._id}>
                                    <DoctorCard doctor={doctor} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <LocalHospitalIcon sx={{ fontSize: 56, color: brand.inkFaint, mb: 2 }} />
                            <Typography fontWeight={700} color={brand.ink} fontSize={17}>
                                No doctors match your search
                            </Typography>
                            <Typography color="text.secondary" fontSize={14} mt={0.5}>
                                Try a different name or specialty.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* CTA Banner */}
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 8, md: 12 },
                px: { xs: 3, md: 8 },
                textAlign: 'center',
                background: `linear-gradient(135deg, ${brand.primaryDark} 0%, ${brand.primary} 100%)`,
            }}>
                {/* Decorative shapes */}
                <Box aria-hidden sx={{
                    position: 'absolute',
                    top: -80, right: -80,
                    width: 320, height: 320,
                    borderRadius: '50%',
                    background: alpha('#fff', 0.08),
                }} />
                <Box aria-hidden sx={{
                    position: 'absolute',
                    bottom: -100, left: -60,
                    width: 260, height: 260,
                    borderRadius: '50%',
                    background: alpha('#fff', 0.06),
                }} />

                <Box sx={{ position: 'relative', maxWidth: 720, mx: 'auto' }}>
                    <Typography variant="h3" fontWeight={800} color="#fff" mb={2}
                        sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' }, letterSpacing: '-0.02em' }}>
                        Ready to take charge of your health?
                    </Typography>
                    <Typography color={alpha('#fff', 0.88)} mb={4} fontSize={17} lineHeight={1.6}>
                        Join thousands of patients who trust Medicare for calm, connected healthcare.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            component={Link} to="/register"
                            size="large"
                            sx={{
                                bgcolor: '#fff', color: brand.primaryDark,
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#F1F5F9', color: brand.primaryDark },
                            }}
                        >
                            Sign up free
                        </Button>
                        <Button
                            component={Link} to="/doctors"
                            variant="outlined"
                            size="large"
                            sx={{
                                color: '#fff',
                                borderColor: alpha('#fff', 0.4),
                                fontWeight: 700,
                                '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.1) },
                            }}
                        >
                            Browse doctors
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

export default Home;
