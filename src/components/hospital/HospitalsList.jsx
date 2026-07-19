import { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, Chip, Skeleton, Button, Pagination, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { listHospitalsPublic } from '../../services/api';
import { brand } from '../../theme';

function HospitalsList() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            listHospitalsPublic({ q, city, page, limit: 12 })
                .then((res) => {
                    setItems(res.data.items || []);
                    setTotal(res.data.total || 0);
                    setPages(res.data.pages || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(t);
    }, [q, city, page]);

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                color: '#fff', py: { xs: 5, md: 7 }, px: 3,
            }}>
                <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1.5 }}>
                        <LocalHospitalIcon sx={{ fontSize: 48 }} />
                        <Typography variant="h3" fontWeight={800}>Hospitals</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 640, mb: 3 }}>
                        Browse hospitals near you, book appointments and lab tests in advance.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search hospital name…"
                            value={q}
                            onChange={(e) => { setQ(e.target.value); setPage(1); }}
                            size="small"
                            sx={{ minWidth: 260 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                            }}
                        />
                        <TextField
                            placeholder="City"
                            value={city}
                            onChange={(e) => { setCity(e.target.value); setPage(1); }}
                            size="small"
                            sx={{ minWidth: 180 }}
                        />
                        <Chip label={`${total} hospitals`} size="small" sx={{ background: brand.surfaceAlt, ml: 'auto' }} />
                    </Box>
                </Paper>

                {loading ? (
                    <Box sx={{
                        display: 'grid', gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    }}>
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={240} />)}
                    </Box>
                ) : items.length === 0 ? (
                    <Paper sx={{ textAlign: 'center', py: 8, border: `1px dashed ${brand.border}` }}>
                        <LocalHospitalIcon sx={{ fontSize: 72, color: brand.inkFaint, mb: 2 }} />
                        <Typography variant="h6" fontWeight={700}>No hospitals found</Typography>
                        <Typography variant="body2" color={brand.inkMuted}>Try clearing filters.</Typography>
                    </Paper>
                ) : (
                    <Box sx={{
                        display: 'grid', gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    }}>
                        {items.map((h) => <HospitalCard key={h._id} hospital={h} />)}
                    </Box>
                )}

                {pages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination count={pages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    );
}

function HospitalCard({ hospital }) {
    const serviceCount = hospital.services?.filter((s) => s.isActive).length || 0;
    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            <Box sx={{
                height: 140, background: `linear-gradient(135deg, ${brand.primarySoft}, #fff)`,
                display: 'grid', placeItems: 'center',
            }}>
                {hospital.logoUrl ? (
                    <img src={hospital.logoUrl} alt={hospital.name} style={{ maxHeight: 100, maxWidth: '80%', objectFit: 'contain' }} />
                ) : (
                    <LocalHospitalIcon sx={{ fontSize: 72, color: brand.primary, opacity: 0.5 }} />
                )}
            </Box>
            <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                    <Typography fontWeight={800} noWrap sx={{ flex: 1 }}>{hospital.name}</Typography>
                    {hospital.isVerified && <VerifiedIcon fontSize="small" sx={{ color: brand.primary }} />}
                    {hospital.is24x7 && (
                        <Chip label="24×7" size="small" sx={{
                            height: 18, fontSize: 10, fontWeight: 700,
                            background: alpha(brand.success, 0.15), color: brand.success,
                        }} />
                    )}
                </Box>
                <Typography variant="caption" color={brand.inkMuted}>
                    {hospital.city}, {hospital.state}
                </Typography>
                {hospital.specialties?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap', mt: 0.4 }}>
                        {hospital.specialties.slice(0, 3).map((s) => (
                            <Chip key={s} label={s} size="small" sx={{ height: 20, fontSize: 10 }} />
                        ))}
                        {hospital.specialties.length > 3 && (
                            <Chip label={`+${hospital.specialties.length - 3}`} size="small" sx={{ height: 20, fontSize: 10 }} />
                        )}
                    </Box>
                )}
                <Typography variant="caption" color={brand.inkFaint} sx={{ mt: 'auto' }}>
                    {serviceCount} service{serviceCount === 1 ? '' : 's'} available
                </Typography>
                <Button component={Link} to={`/hospitals/${hospital._id}`} variant="contained" size="small">
                    View & book
                </Button>
            </Box>
        </Paper>
    );
}

export default HospitalsList;
