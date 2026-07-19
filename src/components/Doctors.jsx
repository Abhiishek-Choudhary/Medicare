import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, TextField, InputAdornment,
    Chip, Grid, MenuItem, Select, FormControl, InputLabel, alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DoctorCard from './Card';
import DoctorCardSkeleton from './DoctorCardSkeleton';
import { getAllDoctors, getHospitalPublic } from '../services/api';
import { brand } from '../theme';

const SPECIALTIES = [
    'All', 'Cardiology', 'Dermatology', 'Neurology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'General Medicine',
    'ENT', 'Ophthalmology', 'Gynecology',
];

const SORT_OPTIONS = [
    { value: 'rating_desc', label: 'Top Rated' },
    { value: 'fee_asc', label: 'Fee: Low to High' },
    { value: 'fee_desc', label: 'Fee: High to Low' },
    { value: 'name_asc', label: 'Name: A–Z' },
];

function Doctors() {
    const [searchParams, setSearchParams] = useSearchParams();
    const hospitalId = searchParams.get('hospitalId') || '';
    const [hospital, setHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('All');
    const [sort, setSort] = useState('rating_desc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = hospitalId ? { hospitalId } : {};
        getAllDoctors(params).then(res => {
            if (res?.data) setDoctors(res.data);
            setLoading(false);
        });
        if (hospitalId) {
            getHospitalPublic(hospitalId).then((res) => setHospital(res.data)).catch(() => setHospital(null));
        } else {
            setHospital(null);
        }
    }, [hospitalId]);

    const clearHospitalFilter = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('hospitalId');
        setSearchParams(next);
    };

    const filtered = useMemo(() => {
        let result = doctors.filter(d => {
            const matchSearch =
                !search ||
                d.name?.toLowerCase().includes(search.toLowerCase()) ||
                d.speciality?.toLowerCase().includes(search.toLowerCase());
            const matchSpecialty = specialty === 'All' || d.speciality === specialty;
            return matchSearch && matchSpecialty;
        });

        if (sort === 'rating_desc') result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        if (sort === 'fee_asc') result = [...result].sort((a, b) => (a.fee || 0) - (b.fee || 0));
        if (sort === 'fee_desc') result = [...result].sort((a, b) => (b.fee || 0) - (a.fee || 0));
        if (sort === 'name_asc') result = [...result].sort((a, b) => a.name?.localeCompare(b.name));

        return result;
    }, [doctors, search, specialty, sort]);

    const uniqueSpecialties = [...new Set(doctors.map(d => d.speciality).filter(Boolean))];
    const avgRating = (() => {
        const rated = doctors.filter(d => d.averageRating > 0);
        return rated.length ? (rated.reduce((s, d) => s + d.averageRating, 0) / rated.length).toFixed(1) : null;
    })();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: brand.surfaceMuted }}>
            <Navbar />

            {/* Hero Header */}
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                px: { xs: 3, md: 8 },
                pt: { xs: 5, md: 8 },
                pb: { xs: 8, md: 10 },
                background: `linear-gradient(135deg, ${brand.primaryDark} 0%, ${brand.primary} 100%)`,
            }}>
                {/* Decorative dot pattern */}
                <Box aria-hidden sx={{
                    position: 'absolute', inset: 0, opacity: 0.15,
                    backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    maskImage: 'radial-gradient(ellipse at 30% 40%, black 40%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black 40%, transparent 75%)',
                }} />
                <Box aria-hidden sx={{
                    position: 'absolute', top: -60, right: -60,
                    width: 260, height: 260, borderRadius: '50%',
                    background: alpha('#fff', 0.08),
                }} />

                <Box sx={{ position: 'relative', maxWidth: 1200, mx: 'auto' }}>
                    <Typography sx={{
                        display: 'inline-block',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: alpha('#fff', 0.85),
                        background: alpha('#fff', 0.14), borderRadius: 999,
                        px: 1.5, py: 0.4, mb: 2,
                    }}>
                        Directory
                    </Typography>
                    <Typography variant="h2" fontWeight={800} color="#fff" mb={1.2}
                        sx={{ fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.025em' }}>
                        Find your doctor
                    </Typography>
                    <Typography color={alpha('#fff', 0.85)} fontSize={16} mb={4} maxWidth={560}>
                        Browse verified specialists, compare ratings and fees, and book instantly.
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search by doctor name or specialty..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: brand.inkFaint }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: 620, bgcolor: '#fff', borderRadius: 3,
                            '& fieldset': { border: 'none' },
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            '& .MuiOutlinedInput-root': { py: 0.4 },
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                        {[
                            { icon: PeopleIcon, value: doctors.length, label: 'Doctors' },
                            { icon: LocalHospitalIcon, value: uniqueSpecialties.length, label: 'Specialties' },
                            { icon: StarIcon, value: avgRating ? `${avgRating}★` : 'N/A', label: 'Avg rating' },
                        ].map(({ icon: Icon, value, label }) => (
                            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#fff' }}>
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: 2,
                                    display: 'grid', placeItems: 'center',
                                    background: alpha('#fff', 0.14),
                                }}>
                                    <Icon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography fontWeight={800} lineHeight={1} fontSize={18}>{value}</Typography>
                                    <Typography fontSize={12.5} sx={{ opacity: 0.85 }}>{label}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 4 }, py: 5 }}>
                {hospital && (
                    <Box sx={{
                        mb: 3, p: 1.5, background: brand.primarySoft,
                        borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
                    }}>
                        <LocalHospitalIcon sx={{ color: brand.primary }} />
                        <Typography variant="body2" fontWeight={600}>
                            Showing doctors affiliated with <b>{hospital.name}</b>
                        </Typography>
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Chip
                                label={`Back to ${hospital.name}`}
                                component={Link}
                                to={`/hospitals/${hospitalId}`}
                                clickable
                                size="small"
                            />
                            <Chip
                                label="Clear hospital filter"
                                icon={<CloseIcon fontSize="small" />}
                                onClick={clearHospitalFilter}
                                size="small"
                                sx={{ background: '#fff' }}
                            />
                        </Box>
                    </Box>
                )}

                {/* Filters Row */}
                <Box sx={{
                    display: 'flex', gap: 2, mb: 3,
                    alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between',
                }}>
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        {SPECIALTIES.map(s => {
                            const active = specialty === s;
                            return (
                                <Chip
                                    key={s}
                                    label={s}
                                    onClick={() => setSpecialty(s)}
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

                    <FormControl size="small" sx={{ minWidth: 190 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
                            {SORT_OPTIONS.map(o => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                                <DoctorCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : filtered.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', py: 10, borderRadius: 4,
                        border: `1px dashed ${brand.border}`, bgcolor: '#fff',
                    }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: brand.primarySoft,
                            display: 'grid', placeItems: 'center',
                            mx: 'auto', mb: 2,
                        }}>
                            <LocalHospitalIcon sx={{ fontSize: 36, color: brand.primary }} />
                        </Box>
                        <Typography fontWeight={700} fontSize={18} color={brand.ink}>No doctors found</Typography>
                        <Typography color="text.secondary" fontSize={14} mt={0.5}>
                            Try a different name or specialty.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={3} fontWeight={500}>
                            Showing <Box component="b" sx={{ color: brand.ink }}>{filtered.length}</Box> doctor{filtered.length !== 1 ? 's' : ''}
                            {specialty !== 'All' ? ` in ${specialty}` : ''}
                        </Typography>
                        <Grid container spacing={3}>
                            {filtered.map(doctor => (
                                <Grid item key={doctor._id} xs={12} sm={6} md={4} lg={3}>
                                    <DoctorCard doctor={doctor} />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>

            <Footer />
        </Box>
    );
}

export default Doctors;
