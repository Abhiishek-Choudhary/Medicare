import { useContext, useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, Alert, Skeleton, Divider, Radio,
    RadioGroup, FormControlLabel, Chip, Paper, alpha,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {
    getCart, listAddresses, createAddress, uploadPrescription,
    placeMedicineOrder, verifyMedicineOrderPayment,
} from '../../services/api';
import { CartContext } from '../../context/CartProvider';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', landmark: '' };

// dynamically load Razorpay checkout script
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

function Checkout() {
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const { refresh: refreshCart } = useContext(CartContext);

    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [newAddress, setNewAddress] = useState(emptyAddress);
    const [useNew, setUseNew] = useState(false);

    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [uploadedRxId, setUploadedRxId] = useState(null);
    const [uploadingRx, setUploadingRx] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: '/pharmacy/checkout' } });
            return;
        }
        Promise.all([getCart(), listAddresses()])
            .then(([cartRes, addrRes]) => {
                setCart(cartRes.data);
                setAddresses(addrRes.data || []);
                if (addrRes.data?.length) {
                    const def = addrRes.data.find((a) => a.isDefault) || addrRes.data[0];
                    setSelectedAddressId(def._id);
                } else {
                    setUseNew(true);
                }
            })
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load checkout'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUploadRx = async () => {
        if (!prescriptionFile) return;
        setUploadingRx(true);
        try {
            const { data } = await uploadPrescription(prescriptionFile);
            setUploadedRxId(data._id);
        } catch (e) {
            setError(e?.response?.data?.message || 'Prescription upload failed');
        } finally {
            setUploadingRx(false);
        }
    };

    const resolveShippingAddress = async () => {
        if (useNew) {
            const req = ['fullName', 'phone', 'line1', 'city', 'state', 'pincode'];
            for (const k of req) {
                if (!newAddress[k]) throw new Error(`Address field "${k}" is required`);
            }
            if (!/^\d{6}$/.test(newAddress.pincode)) {
                throw new Error('Pincode must be 6 digits');
            }
            const { data } = await createAddress({ ...newAddress, isDefault: addresses.length === 0 });
            setAddresses([data, ...addresses]);
            setSelectedAddressId(data._id);
            return data;
        }
        const addr = addresses.find((a) => a._id === selectedAddressId);
        if (!addr) throw new Error('Please select an address');
        return addr;
    };

    const handlePlace = async () => {
        setError('');
        if (cart.prescriptionRequired && !uploadedRxId) {
            setError('Please upload and confirm your prescription first.');
            return;
        }
        setPlacing(true);
        try {
            const address = await resolveShippingAddress();
            const shippingAddress = {
                fullName: address.fullName, phone: address.phone,
                line1: address.line1, line2: address.line2,
                city: address.city, state: address.state,
                pincode: address.pincode, landmark: address.landmark,
            };

            const { data } = await placeMedicineOrder({
                shippingAddress,
                prescriptionId: uploadedRxId || undefined,
                paymentMethod,
            });

            if (paymentMethod === 'COD') {
                await refreshCart();
                navigate(`/pharmacy/orders/${data.order._id}`);
                return;
            }

            // Razorpay flow
            const ok = await loadRazorpay();
            if (!ok) throw new Error('Failed to load payment gateway');

            const rzp = new window.Razorpay({
                key: data.razorpay.keyId,
                amount: data.razorpay.amount,
                currency: data.razorpay.currency,
                order_id: data.razorpay.orderId,
                name: 'Medicare Pharmacy',
                description: `Order ${data.order.orderNumber}`,
                prefill: {
                    name: account?.name || account?.username,
                    email: account?.email,
                    contact: shippingAddress.phone,
                },
                theme: { color: brand.primary },
                handler: async (rp) => {
                    try {
                        await verifyMedicineOrderPayment({
                            orderId: data.order._id,
                            razorpay_order_id: rp.razorpay_order_id,
                            razorpay_payment_id: rp.razorpay_payment_id,
                            razorpay_signature: rp.razorpay_signature,
                        });
                        await refreshCart();
                        navigate(`/pharmacy/orders/${data.order._id}`);
                    } catch (e) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => setPlacing(false),
                },
            });
            rzp.open();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || 'Failed to place order');
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 1240, mx: 'auto', px: 3, py: 4 }}>
                    <Skeleton variant="rounded" height={400} />
                </Box>
            </Box>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 6, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700}>Your cart is empty</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/pharmacy')}>
                        Shop medicines
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Checkout</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: 3 }}>
                    <Box>
                        {/* Shipping */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                                Shipping Address
                            </Typography>

                            {addresses.length > 0 && (
                                <RadioGroup
                                    value={useNew ? 'new' : selectedAddressId}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') { setUseNew(true); }
                                        else { setUseNew(false); setSelectedAddressId(e.target.value); }
                                    }}
                                >
                                    {addresses.map((a) => (
                                        <Paper
                                            key={a._id}
                                            variant="outlined"
                                            sx={{
                                                mb: 1.5, p: 2, borderRadius: 3,
                                                borderColor: (!useNew && selectedAddressId === a._id) ? brand.primary : brand.border,
                                                background: (!useNew && selectedAddressId === a._id) ? brand.primarySoft : 'transparent',
                                            }}
                                        >
                                            <FormControlLabel
                                                value={a._id}
                                                control={<Radio />}
                                                sx={{ alignItems: 'flex-start', m: 0, width: '100%' }}
                                                label={
                                                    <Box>
                                                        <Typography fontWeight={700}>
                                                            {a.fullName}
                                                            {a.isDefault && (
                                                                <Chip label="Default" size="small" sx={{ ml: 1, height: 18, fontSize: 10 }} />
                                                            )}
                                                        </Typography>
                                                        <Typography variant="body2" color={brand.inkMuted}>
                                                            {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} - {a.pincode}
                                                        </Typography>
                                                        <Typography variant="body2" color={brand.inkMuted}>
                                                            Phone: {a.phone}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    ))}
                                    <FormControlLabel value="new" control={<Radio />} label="Add a new address" />
                                </RadioGroup>
                            )}

                            {useNew && (
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                                    <TextField label="Full name" value={newAddress.fullName}
                                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                                    <TextField label="Phone" value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                                    <TextField label="Address line 1" value={newAddress.line1} sx={{ gridColumn: '1 / -1' }}
                                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
                                    <TextField label="Address line 2" value={newAddress.line2} sx={{ gridColumn: '1 / -1' }}
                                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
                                    <TextField label="City" value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                    <TextField label="State" value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                                    <TextField label="Pincode" value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                                    <TextField label="Landmark (optional)" value={newAddress.landmark}
                                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })} />
                                </Box>
                            )}
                        </Paper>

                        {/* Prescription */}
                        {cart.prescriptionRequired && (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                                    Prescription
                                </Typography>
                                <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 2 }}>
                                    One or more items in your cart require a valid doctor's prescription. Please upload a clear photo or scan.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<UploadFileIcon />}
                                        disabled={uploadingRx || !!uploadedRxId}
                                    >
                                        Choose file
                                        <input
                                            hidden
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => { setPrescriptionFile(e.target.files?.[0] || null); setUploadedRxId(null); }}
                                        />
                                    </Button>
                                    {prescriptionFile && !uploadedRxId && (
                                        <>
                                            <Typography variant="body2">{prescriptionFile.name}</Typography>
                                            <Button
                                                variant="contained"
                                                onClick={handleUploadRx}
                                                disabled={uploadingRx}
                                            >
                                                {uploadingRx ? 'Uploading…' : 'Upload'}
                                            </Button>
                                        </>
                                    )}
                                    {uploadedRxId && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Prescription uploaded"
                                            sx={{ background: alpha(brand.success, 0.15), color: brand.success }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 1.5 }}>
                                    Your order will be verified by our pharmacist before dispatch.
                                </Typography>
                            </Paper>
                        )}

                        {/* Payment */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                                Payment Method
                            </Typography>
                            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel value="Razorpay" control={<Radio />} label="Razorpay (UPI / Card / Netbanking)" />
                                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                            </RadioGroup>
                        </Paper>
                    </Box>

                    {/* Summary */}
                    <Paper sx={{ p: 3, height: 'fit-content', position: { md: 'sticky' }, top: { md: 100 } }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Order Summary</Typography>

                        {cart.items.map((it) => (
                            <Box key={it.medicine?._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
                                <Typography variant="body2" sx={{ flex: 1, mr: 1 }} noWrap>
                                    {it.medicine?.name} × {it.quantity}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>₹{it.lineTotal}</Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 1.5 }} />
                        <SummaryRow label="Subtotal" value={`₹${cart.subtotal}`} />
                        <SummaryRow
                            label="Delivery"
                            value={cart.subtotal >= 499 ? 'FREE' : '₹40'}
                        />
                        <SummaryRow label="GST (5%)" value={`₹${Math.round(cart.subtotal * 0.05)}`} />
                        <Divider sx={{ my: 1.5 }} />
                        <SummaryRow
                            label="Total"
                            value={`₹${cart.subtotal + (cart.subtotal >= 499 ? 0 : 40) + Math.round(cart.subtotal * 0.05)}`}
                            bold
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 2.5 }}
                            onClick={handlePlace}
                            disabled={placing}
                        >
                            {placing ? 'Placing order…' : paymentMethod === 'COD' ? 'Place order' : 'Pay & Place order'}
                        </Button>
                    </Paper>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

function SummaryRow({ label, value, bold }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant={bold ? 'body1' : 'body2'} fontWeight={bold ? 800 : 500} color={bold ? 'text.primary' : 'text.secondary'}>
                {label}
            </Typography>
            <Typography variant={bold ? 'body1' : 'body2'} fontWeight={bold ? 800 : 600}>
                {value}
            </Typography>
        </Box>
    );
}

export default Checkout;
