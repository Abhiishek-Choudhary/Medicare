import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Chip, IconButton, Alert, Skeleton, Divider, alpha,
} from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getMedicine, addToCart } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { CartContext } from '../../context/CartProvider';
import { brand } from '../../theme';

function MedicineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const { refresh: refreshCart } = useContext(CartContext);

    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setLoading(true);
        getMedicine(id)
            .then((res) => setMedicine(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load medicine'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = async () => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: `/pharmacy/medicine/${id}` } });
            return;
        }
        setAdding(true);
        try {
            await addToCart(medicine._id, qty);
            await refreshCart();
            setToast('Added to cart');
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setToast(e?.response?.data?.message || 'Failed to add to cart');
            setTimeout(() => setToast(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    const discount = medicine && medicine.mrp > medicine.price
        ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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

                {loading || !medicine ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        <Skeleton variant="rounded" height={400} />
                        <Box>
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={20} width="60%" sx={{ mb: 2 }} />
                            <Skeleton height={100} />
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        {/* Image */}
                        <Box
                            sx={{
                                background: '#fff',
                                borderRadius: 4,
                                border: `1px solid ${brand.border}`,
                                minHeight: 400,
                                display: 'grid', placeItems: 'center',
                                p: 3,
                            }}
                        >
                            {medicine.images?.[0] ? (
                                <img
                                    src={medicine.images[0]}
                                    alt={medicine.name}
                                    style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain' }}
                                />
                            ) : (
                                <LocalPharmacyIcon sx={{ fontSize: 120, color: brand.primary, opacity: 0.4 }} />
                            )}
                        </Box>

                        {/* Info */}
                        <Box>
                            <Box sx={{ display: 'flex', gap: 0.8, mb: 1.5, flexWrap: 'wrap' }}>
                                {medicine.category?.name && (
                                    <Chip label={medicine.category.name} size="small" sx={{ background: brand.primarySoft, color: brand.primary }} />
                                )}
                                {medicine.prescriptionRequired && (
                                    <Chip label="Prescription required" size="small"
                                        sx={{ background: brand.accentSoft, color: brand.accent }} />
                                )}
                                {discount > 0 && (
                                    <Chip label={`${discount}% OFF`} size="small"
                                        sx={{ background: alpha(brand.success, 0.15), color: brand.success }} />
                                )}
                            </Box>

                            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                                {medicine.name}
                            </Typography>
                            <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 2 }}>
                                {medicine.brand} · {medicine.manufacturer} · {medicine.packSize}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 3 }}>
                                <Typography variant="h4" fontWeight={800} color={brand.ink}>
                                    ₹{medicine.price}
                                </Typography>
                                {discount > 0 && (
                                    <Typography sx={{ textDecoration: 'line-through', color: brand.inkFaint }}>
                                        ₹{medicine.mrp}
                                    </Typography>
                                )}
                                {discount > 0 && (
                                    <Typography variant="body2" fontWeight={700} sx={{ color: brand.success }}>
                                        You save ₹{medicine.mrp - medicine.price}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <InfoRow label="Composition" value={medicine.composition} />
                            <InfoRow label="Dosage form" value={medicine.dosageForm} />
                            <InfoRow label="Strength" value={medicine.strength} />
                            <InfoRow label="SKU" value={medicine.sku} />

                            {medicine.description && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>Description</Typography>
                                    <Typography variant="body2" color={brand.inkMuted}>{medicine.description}</Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            {medicine.stock < 1 ? (
                                <Alert severity="error">Out of stock</Alert>
                            ) : (
                                <Box>
                                    <Typography variant="caption" color={brand.inkMuted}>
                                        {medicine.stock} in stock
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
                                        <Box
                                            sx={{
                                                display: 'flex', alignItems: 'center',
                                                border: `1px solid ${brand.border}`,
                                                borderRadius: 2, background: '#fff',
                                            }}
                                        >
                                            <IconButton onClick={() => setQty(Math.max(1, qty - 1))} size="small">
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography fontWeight={700} sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                                                {qty}
                                            </Typography>
                                            <IconButton
                                                onClick={() => setQty(Math.min(medicine.stock, qty + 1))}
                                                size="small"
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={handleAdd}
                                            disabled={adding}
                                            sx={{ flex: 1 }}
                                        >
                                            {adding ? 'Adding…' : 'Add to Cart'}
                                        </Button>
                                    </Box>
                                    {medicine.prescriptionRequired && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            You'll need to upload a valid prescription at checkout to buy this item.
                                        </Alert>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    );
}

function InfoRow({ label, value }) {
    if (!value) return null;
    return (
        <Box sx={{ display: 'flex', gap: 2, py: 0.6 }}>
            <Typography variant="body2" sx={{ minWidth: 120, color: brand.inkMuted }}>{label}</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{value}</Typography>
        </Box>
    );
}

export default MedicineDetail;
