import { useContext, useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
    Chip, Pagination, Alert, Skeleton, IconButton, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import MedicineCard from './MedicineCard';
import { listMedicines, listCategories, addToCart, getHospitalPublic } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { CartContext } from '../../context/CartProvider';
import { brand } from '../../theme';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A → Z' },
];

function Pharmacy() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hospitalId = searchParams.get('hospitalId') || '';
    const { account, role } = useContext(DataContext);
    const { refresh: refreshCart } = useContext(CartContext);

    const [categories, setCategories] = useState([]);
    const [hospital, setHospital] = useState(null);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingId, setAddingId] = useState(null);
    const [toast, setToast] = useState('');

    const [q, setQ] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);

    const filtersApplied = q || category;

    const clearHospitalFilter = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('hospitalId');
        setSearchParams(next);
    };

    useEffect(() => {
        if (hospitalId) {
            getHospitalPublic(hospitalId).then((res) => setHospital(res.data)).catch(() => setHospital(null));
        } else {
            setHospital(null);
        }
    }, [hospitalId]);

    useEffect(() => {
        listCategories()
            .then((res) => setCategories(res.data || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { q, category, sort, page, limit: 12 };
        if (hospitalId) params.hospitalId = hospitalId;
        listMedicines(params)
            .then((res) => {
                setItems(res.data.items || []);
                setTotal(res.data.total || 0);
                setPages(res.data.pages || 0);
                setError('');
            })
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load medicines'))
            .finally(() => setLoading(false));
    }, [q, category, sort, page, hospitalId]);

    const handleAdd = async (medicine) => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: '/pharmacy' } });
            return;
        }
        setAddingId(medicine._id);
        try {
            await addToCart(medicine._id, 1);
            await refreshCart();
            setToast(`Added ${medicine.name} to cart`);
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setToast(e?.response?.data?.message || 'Failed to add to cart');
            setTimeout(() => setToast(''), 3000);
        } finally {
            setAddingId(null);
        }
    };

    const skeletons = useMemo(() => Array.from({ length: 8 }), []);

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            {/* Hero */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                    color: '#fff',
                    py: { xs: 5, md: 7 },
                    px: 3,
                }}
            >
                <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                        Online Pharmacy
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 620 }}>
                        Genuine medicines delivered to your doorstep. Upload your prescription and order in minutes.
                    </Typography>

                    <TextField
                        placeholder="Search medicines, brands, salts…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: brand.inkMuted }} />
                                </InputAdornment>
                            ),
                            sx: { background: '#fff', borderRadius: 3 },
                        }}
                        sx={{ maxWidth: 560, width: '100%' }}
                    />
                </Box>
            </Box>

            {/* Filters + results */}
            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {hospital && (
                    <Box sx={{
                        mb: 3, p: 1.5, background: brand.primarySoft,
                        borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
                    }}>
                        <LocalHospitalIcon sx={{ color: brand.primary }} />
                        <Typography variant="body2" fontWeight={600}>
                            Showing in-house medicines at <b>{hospital.name}</b>
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

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        >
                            <MenuItem value=""><em>All categories</em></MenuItem>
                            {categories.map((c) => (
                                <MenuItem key={c._id} value={c.slug}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                            value={sort}
                            label="Sort"
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {SORT_OPTIONS.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {filtersApplied && (
                        <IconButton
                            onClick={() => { setQ(''); setCategory(''); setPage(1); }}
                            size="small"
                            sx={{ color: brand.inkMuted }}
                        >
                            <FilterAltOffIcon />
                        </IconButton>
                    )}

                    <Box sx={{ ml: 'auto' }}>
                        <Chip label={`${total} results`} size="small" sx={{ background: brand.surfaceAlt }} />
                    </Box>
                </Box>

                {toast && (
                    <Alert
                        severity="success"
                        sx={{
                            position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
                            boxShadow: '0 12px 40px rgba(15,23,42,0.16)',
                        }}
                    >
                        {toast}
                    </Alert>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box
                    sx={{
                        display: 'grid',
                        gap: 2.5,
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                    }}
                >
                    {loading
                        ? skeletons.map((_, i) => (
                              <Skeleton key={i} variant="rounded" height={340} sx={{ borderRadius: 3 }} />
                          ))
                        : items.map((m) => (
                              <MedicineCard
                                  key={m._id}
                                  medicine={m}
                                  onAdd={handleAdd}
                                  adding={addingId === m._id}
                              />
                          ))}
                </Box>

                {!loading && items.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center', py: 8, mt: 2,
                            background: '#fff', borderRadius: 3,
                            border: `1px dashed ${brand.border}`,
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color={brand.ink}>
                            No medicines found
                        </Typography>
                        <Typography variant="body2" color={brand.inkMuted} sx={{ mt: 1 }}>
                            Try clearing filters or searching a different term.
                        </Typography>
                    </Box>
                )}

                {pages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={pages}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    );
}

export default Pharmacy;
