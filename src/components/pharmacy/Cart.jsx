import { useContext, useEffect, useState } from 'react';
import {
    Box, Typography, Button, IconButton, Alert, Skeleton, Divider, Chip, alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/api';
import { CartContext } from '../../context/CartProvider';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const DELIVERY_FEE_FLAT = 40;
const FREE_DELIVERY_THRESHOLD = 499;
const GST_RATE = 0.05;

function Cart() {
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const { refresh } = useContext(CartContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: '/pharmacy/cart' } });
            return;
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await getCart();
            setCart(data);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleQty = async (medicineId, quantity) => {
        setBusyId(medicineId);
        try {
            const { data } = await updateCartItem(medicineId, quantity);
            setCart(data);
            refresh();
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to update quantity');
        } finally {
            setBusyId(null);
        }
    };

    const handleRemove = async (medicineId) => {
        setBusyId(medicineId);
        try {
            const { data } = await removeFromCart(medicineId);
            setCart(data);
            refresh();
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to remove item');
        } finally {
            setBusyId(null);
        }
    };

    const handleClear = async () => {
        try {
            await clearCart();
            await load();
            refresh();
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to clear cart');
        }
    };

    const subtotal = cart?.subtotal || 0;
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (subtotal > 0 ? DELIVERY_FEE_FLAT : 0);
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + deliveryFee + tax;

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
                    Your Cart
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Skeleton variant="rounded" height={300} />
                ) : !cart || cart.items.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', py: 8,
                        background: '#fff', borderRadius: 4,
                        border: `1px dashed ${brand.border}`,
                    }}>
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 72, color: brand.inkFaint, mb: 2 }} />
                        <Typography variant="h6" fontWeight={700}>Your cart is empty</Typography>
                        <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 3 }}>
                            Browse our catalog and add medicines to your cart.
                        </Typography>
                        <Button component={Link} to="/pharmacy" variant="contained" size="large">
                            Shop medicines
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: 3 }}>
                        {/* Items */}
                        <Box sx={{ background: '#fff', borderRadius: 4, border: `1px solid ${brand.border}`, p: { xs: 1, md: 2 } }}>
                            {cart.items.map((it) => {
                                const med = it.medicine;
                                if (!med) return null;
                                return (
                                    <Box
                                        key={med._id}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '72px 1fr', md: '96px 1fr auto auto' },
                                            gap: 2, alignItems: 'center',
                                            p: 2,
                                            borderBottom: `1px solid ${brand.border}`,
                                            '&:last-of-type': { borderBottom: 'none' },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: { xs: 72, md: 96 },
                                                height: { xs: 72, md: 96 },
                                                display: 'grid', placeItems: 'center',
                                                background: brand.primarySoft,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {med.images?.[0] ? (
                                                <img src={med.images[0]} alt={med.name} style={{ maxWidth: '80%', maxHeight: '80%' }} />
                                            ) : (
                                                <LocalPharmacyIcon sx={{ color: brand.primary, opacity: 0.55 }} />
                                            )}
                                        </Box>

                                        <Box>
                                            <Typography
                                                component={Link}
                                                to={`/pharmacy/medicine/${med._id}`}
                                                fontWeight={700}
                                                sx={{ color: brand.ink, textDecoration: 'none', '&:hover': { color: brand.primary } }}
                                            >
                                                {med.name}
                                            </Typography>
                                            <Typography variant="body2" color={brand.inkFaint}>
                                                ₹{med.price} each
                                            </Typography>
                                            {med.prescriptionRequired && (
                                                <Chip label="Rx required" size="small"
                                                    sx={{ mt: 0.7, height: 20, fontSize: 10, background: brand.accentSoft, color: brand.accent }} />
                                            )}
                                        </Box>

                                        <Box sx={{
                                            display: 'flex', alignItems: 'center',
                                            border: `1px solid ${brand.border}`, borderRadius: 2,
                                            gridColumn: { xs: '1 / -1', md: 'auto' },
                                            justifySelf: { md: 'end' },
                                        }}>
                                            <IconButton
                                                size="small"
                                                disabled={busyId === med._id || it.quantity <= 1}
                                                onClick={() => handleQty(med._id, it.quantity - 1)}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ px: 1.5, minWidth: 32, textAlign: 'center', fontWeight: 700 }}>
                                                {it.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                disabled={busyId === med._id || it.quantity >= (med.stock || 0)}
                                                onClick={() => handleQty(med._id, it.quantity + 1)}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                                            gridColumn: { xs: '1 / -1', md: 'auto' },
                                        }}>
                                            <Typography fontWeight={800}>₹{it.lineTotal}</Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemove(med._id)}
                                                disabled={busyId === med._id}
                                                sx={{ color: brand.danger }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })}

                            <Box sx={{ p: 2, textAlign: 'right' }}>
                                <Button size="small" onClick={handleClear} sx={{ color: brand.danger }}>
                                    Clear cart
                                </Button>
                            </Box>
                        </Box>

                        {/* Summary */}
                        <Box
                            sx={{
                                background: '#fff', borderRadius: 4,
                                border: `1px solid ${brand.border}`,
                                p: 3, height: 'fit-content',
                                position: { md: 'sticky' }, top: { md: 100 },
                            }}
                        >
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Order Summary</Typography>

                            <Row label={`Subtotal (${cart.itemCount} items)`} value={`₹${subtotal}`} />
                            <Row label="Delivery" value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`} />
                            <Row label="GST (5%)" value={`₹${tax}`} />

                            {deliveryFee > 0 && subtotal > 0 && (
                                <Typography variant="caption" sx={{ display: 'block', color: brand.accent, mb: 1 }}>
                                    Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more for free delivery
                                </Typography>
                            )}

                            <Divider sx={{ my: 1.5 }} />
                            <Row label="Total" value={`₹${total}`} bold />

                            {cart.prescriptionRequired && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    One or more items need a prescription. You'll upload it at checkout.
                                </Alert>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 2.5 }}
                                onClick={() => navigate('/pharmacy/checkout')}
                            >
                                Proceed to Checkout
                            </Button>
                            <Button
                                fullWidth
                                component={Link}
                                to="/pharmacy"
                                sx={{ mt: 1, color: brand.inkMuted }}
                            >
                                Continue shopping
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    );
}

function Row({ label, value, bold }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
            <Typography variant={bold ? 'body1' : 'body2'} fontWeight={bold ? 800 : 500} color={bold ? 'text.primary' : 'text.secondary'}>
                {label}
            </Typography>
            <Typography variant={bold ? 'body1' : 'body2'} fontWeight={bold ? 800 : 600}>
                {value}
            </Typography>
        </Box>
    );
}

export default Cart;
