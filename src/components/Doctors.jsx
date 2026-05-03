import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, TextField, InputAdornment,
    CircularProgress, Chip, Grid, MenuItem, Select,
    FormControl, InputLabel, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import Navbar from './Navbar';
import Footer from './Footer';
import DoctorCard from './Card';
import { getAllDoctors } from '../services/api';

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
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('All');
    const [sort, setSort] = useState('rating_desc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllDoctors().then(res => {
            if (res?.data) setDoctors(res.data);
            setLoading(false);
        });
    }, []);

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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            {/* Hero Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                px: { xs: 3, md: 8 }, py: { xs: 5, md: 7 },
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Typography variant="h3" fontWeight={800} color="#fff" mb={1}
                        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                        Find Your Doctor
                    </Typography>
                    <Typography color="rgba(255,255,255,0.85)" fontSize={16} mb={4}>
                        Browse verified specialists and book appointments instantly
                    </Typography>

                    {/* Search bar in header */}
                    <TextField
                        fullWidth
                        placeholder="Search by doctor name or specialty..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#888' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: 560, bgcolor: '#fff', borderRadius: 2,
                            '& fieldset': { border: 'none' },
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }}
                    />

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                        {[
                            { icon: PeopleIcon, value: doctors.length, label: 'Doctors' },
                            { icon: LocalHospitalIcon, value: uniqueSpecialties.length, label: 'Specialties' },
                            {
                            icon: StarIcon,
                            value: doctors.filter(d => d.averageRating > 0).length > 0
                                ? (doctors.filter(d => d.averageRating > 0).reduce((s, d) => s + d.averageRating, 0) /
                                    doctors.filter(d => d.averageRating > 0).length).toFixed(1) + '★'
                                : 'N/A',
                            label: 'Avg Rating'
                        },
                        ].map(({ icon: Icon, value, label }) => (
                            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                                <Icon sx={{ opacity: 0.85 }} />
                                <Box>
                                    <Typography fontWeight={700} lineHeight={1}>{value}</Typography>
                                    <Typography fontSize={12} sx={{ opacity: 0.8 }}>{label}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 5 }}>
                {/* Filters Row */}
                <Box sx={{
                    display: 'flex', gap: 2, mb: 2,
                    alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {SPECIALTIES.map(s => (
                            <Chip
                                key={s}
                                label={s}
                                onClick={() => setSpecialty(s)}
                                color={specialty === s ? 'primary' : 'default'}
                                variant={specialty === s ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer', fontWeight: specialty === s ? 700 : 400 }}
                            />
                        ))}
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
                            {SORT_OPTIONS.map(o => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : filtered.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <LocalHospitalIcon sx={{ fontSize: 56, color: '#ccc', mb: 2 }} />
                        <Typography color="text.secondary" fontSize={18}>No doctors found.</Typography>
                        <Typography color="text.secondary" fontSize={14} mt={1}>
                            Try a different name or specialty.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={3} fontWeight={500}>
                            Showing <b>{filtered.length}</b> doctor{filtered.length !== 1 ? 's' : ''}
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
