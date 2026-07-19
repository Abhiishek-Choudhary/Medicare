import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Chip, Button, Skeleton, Alert, Divider, IconButton, Tooltip, alpha,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getOrder, cancelOrder } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const TIMELINE_STEPS = [
    { key: 'placed', label: 'Order Placed', description: 'We received your order' },
    { key: 'confirmed', label: 'Confirmed', description: 'Being prepared by our pharmacy' },
    { key: 'packed', label: 'Packed', description: 'Your medicines are packed' },
    { key: 'shipped', label: 'Shipped', description: 'Your package is on the way' },
    { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Arriving today' },
    { key: 'delivered', label: 'Delivered', description: 'Enjoy your medicines' },
];

const cancellable = ['awaiting_payment', 'awaiting_verification', 'placed', 'confirmed'];

const formatStatus = (s) => (s || '').replace(/_/g, ' ');
const formatTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const pollRef = useRef(null);

    useEffect(() => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: `/pharmacy/orders/${id}` } });
            return;
        }
        load(true);
        // Poll every 20s while page is open — but only for active orders.
        pollRef.current = setInterval(() => {
            if (!document.hidden) load(false);
        }, 20000);
        return () => clearInterval(pollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Stop polling once the order reaches a terminal state
    useEffect(() => {
        if (!order) return;
        if (['delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
            if (pollRef.current) clearInterval(pollRef.current);
        }
    }, [order]);

    const load = async (initial) => {
        if (initial) setLoading(true);
        else setRefreshing(true);
        try {
            const { data } = await getOrder(id);
            setOrder(data);
            setLastUpdated(new Date());
            setError('');
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load order');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Cancel this order? This cannot be undone.')) return;
        setCancelling(true);
        try {
            await cancelOrder(id, 'Cancelled by customer');
            await load(false);
        } catch (e) {
            setError(e?.response?.data?.message || 'Cancel failed');
        } finally {
            setCancelling(false);
        }
    };

    const copyOrderNumber = async () => {
        if (!order) return;
        try {
            await navigator.clipboard.writeText(order.orderNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch { /* ignore */ }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 4 }}>
                    <Skeleton variant="rounded" height={400} />
                </Box>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
                <Navbar />
                <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 6 }}>
                    <Alert severity="error">{error || 'Order not found'}</Alert>
                </Box>
            </Box>
        );
    }

    const isCancelled = order.orderStatus === 'cancelled';
    const isPending = ['awaiting_payment', 'awaiting_verification'].includes(order.orderStatus);

    // Build a map: step.key → timestamp (from statusHistory)
    const historyMap = {};
    (order.statusHistory || []).forEach((h) => {
        if (!historyMap[h.status]) historyMap[h.status] = h;
    });

    const currentIndex = TIMELINE_STEPS.findIndex((t) => t.key === order.orderStatus);
    const activeIndex = currentIndex === -1 ? -1 : currentIndex;

    const statusChipColor = isCancelled ? brand.danger : isPending ? brand.accent : brand.primary;

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Header */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h5" fontWeight={800}>Order {order.orderNumber}</Typography>
                                <Tooltip title={copied ? 'Copied!' : 'Copy order number'}>
                                    <IconButton size="small" onClick={copyOrderNumber} sx={{ color: brand.inkMuted }}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="body2" color={brand.inkMuted}>
                                Placed on {formatTime(order.createdAt)}
                            </Typography>
                            {lastUpdated && (
                                <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 0.4 }}>
                                    Last checked {formatTime(lastUpdated)}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={formatStatus(order.orderStatus)}
                                sx={{
                                    textTransform: 'capitalize', fontWeight: 700,
                                    background: alpha(statusChipColor, 0.15),
                                    color: statusChipColor,
                                }}
                            />
                            <Tooltip title="Refresh status">
                                <IconButton size="small" onClick={() => load(false)} disabled={refreshing}>
                                    <RefreshIcon
                                        fontSize="small"
                                        sx={{
                                            animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
                                            '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {order.expectedDelivery && !isCancelled && order.orderStatus !== 'delivered' && (
                        <Box sx={{
                            mt: 2, p: 1.5, borderRadius: 2,
                            background: alpha(brand.primary, 0.08),
                            display: 'flex', alignItems: 'center', gap: 1.5,
                        }}>
                            <EventAvailableIcon sx={{ color: brand.primary }} />
                            <Typography variant="body2" fontWeight={600}>
                                Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { dateStyle: 'full' })}
                            </Typography>
                        </Box>
                    )}

                    {order.requiresPrescription && (
                        <Alert
                            severity={order.prescriptionStatus === 'verified' ? 'success' : order.prescriptionStatus === 'rejected' ? 'error' : 'info'}
                            sx={{ mt: 2 }}
                        >
                            Prescription: <b style={{ textTransform: 'capitalize' }}>{order.prescriptionStatus}</b>
                            {order.prescriptionStatus === 'pending' && ' — awaiting pharmacist verification.'}
                            {order.prescriptionStatus === 'rejected' && ' — please contact support.'}
                        </Alert>
                    )}
                </Paper>

                {/* Timeline with real timestamps */}
                {!isCancelled && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Order Progress</Typography>

                        <Box sx={{ position: 'relative' }}>
                            {TIMELINE_STEPS.map((step, i) => {
                                const done = i <= activeIndex;
                                const isCurrent = i === activeIndex;
                                const history = historyMap[step.key];
                                const isLast = i === TIMELINE_STEPS.length - 1;

                                return (
                                    <Box
                                        key={step.key}
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            pb: isLast ? 0 : 3,
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Vertical connector */}
                                        {!isLast && (
                                            <Box sx={{
                                                position: 'absolute',
                                                left: 15, top: 32,
                                                width: 2, bottom: 0,
                                                background: done ? brand.success : brand.border,
                                            }} />
                                        )}

                                        {/* Dot */}
                                        <Box sx={{
                                            width: 32, height: 32,
                                            flexShrink: 0,
                                            display: 'grid', placeItems: 'center',
                                            position: 'relative', zIndex: 1,
                                        }}>
                                            {done ? (
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: brand.success, fontSize: 32,
                                                        ...(isCurrent && {
                                                            animation: 'pulse 2s ease-in-out infinite',
                                                            '@keyframes pulse': {
                                                                '0%, 100%': { transform: 'scale(1)' },
                                                                '50%': { transform: 'scale(1.15)' },
                                                            },
                                                        }),
                                                    }}
                                                />
                                            ) : (
                                                <RadioButtonUncheckedIcon sx={{ color: brand.border, fontSize: 32 }} />
                                            )}
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flex: 1, pt: 0.4 }}>
                                            <Typography
                                                fontWeight={done ? 700 : 500}
                                                color={done ? brand.ink : brand.inkFaint}
                                            >
                                                {step.label}
                                                {isCurrent && (
                                                    <Chip
                                                        label="Current"
                                                        size="small"
                                                        sx={{
                                                            ml: 1, height: 18, fontSize: 10, fontWeight: 700,
                                                            background: alpha(brand.primary, 0.15),
                                                            color: brand.primary,
                                                        }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography variant="caption" color={brand.inkMuted}>
                                                {step.description}
                                            </Typography>
                                            {history && (
                                                <Box sx={{ mt: 0.4 }}>
                                                    <Typography variant="caption" fontWeight={600} color={brand.success}>
                                                        {formatTime(history.at)}
                                                    </Typography>
                                                    {history.note && (
                                                        <Typography variant="caption" color={brand.inkMuted} sx={{ display: 'block' }}>
                                                            {history.note}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {order.trackingId && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    mt: 3, p: 2,
                                    background: brand.surfaceAlt,
                                    borderRadius: 2, border: `1px solid ${brand.border}`,
                                    display: 'flex', alignItems: 'center', gap: 2,
                                }}
                            >
                                <LocalShippingIcon sx={{ color: brand.primary }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color={brand.inkMuted}>Shipment tracking</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {order.deliveryPartner || 'Courier'} · {order.trackingId}
                                    </Typography>
                                </Box>
                            </Paper>
                        )}
                    </Paper>
                )}

                {isCancelled && (
                    <Alert severity="error" icon={<CancelIcon />} sx={{ mb: 3 }}>
                        <Typography fontWeight={700}>This order was cancelled.</Typography>
                        {order.cancelledReason && <Typography variant="body2">{order.cancelledReason}</Typography>}
                        {historyMap.cancelled && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.4 }}>
                                Cancelled on {formatTime(historyMap.cancelled.at)}
                            </Typography>
                        )}
                    </Alert>
                )}

                {/* Full activity log */}
                {(order.statusHistory?.length || 0) > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Activity Log</Typography>
                        <Box>
                            {order.statusHistory.slice().reverse().map((h, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: 'flex', gap: 2, py: 1.2,
                                        borderBottom: `1px solid ${brand.border}`,
                                        '&:last-of-type': { borderBottom: 'none' },
                                    }}
                                >
                                    <Box sx={{ minWidth: 160 }}>
                                        <Typography variant="caption" color={brand.inkMuted}>
                                            {formatTime(h.at)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                            {formatStatus(h.status)}
                                        </Typography>
                                        {h.note && (
                                            <Typography variant="caption" color={brand.inkMuted}>
                                                {h.note}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: 3 }}>
                    {/* Items */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Items</Typography>
                        {order.items.map((it, i) => (
                            <Box
                                key={i}
                                sx={{
                                    py: 1.5,
                                    display: 'flex', gap: 2, alignItems: 'center',
                                    borderBottom: `1px solid ${brand.border}`,
                                    '&:last-of-type': { borderBottom: 'none' },
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight={700}>{it.name}</Typography>
                                    <Typography variant="body2" color={brand.inkFaint}>
                                        {it.sku} · Qty {it.quantity} × ₹{it.price}
                                    </Typography>
                                    {it.prescriptionRequired && (
                                        <Chip label="Rx" size="small" sx={{
                                            mt: 0.5, height: 18, fontSize: 10,
                                            background: brand.accentSoft, color: brand.accent,
                                        }} />
                                    )}
                                </Box>
                                <Typography fontWeight={800}>₹{it.subtotal}</Typography>
                            </Box>
                        ))}
                    </Paper>

                    {/* Summary + shipping */}
                    <Box>
                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Bill Details</Typography>
                            <Row label="Subtotal" value={`₹${order.subtotal}`} />
                            <Row label="Delivery" value={order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`} />
                            <Row label="Tax" value={`₹${order.tax}`} />
                            {order.discount > 0 && <Row label="Discount" value={`-₹${order.discount}`} />}
                            <Divider sx={{ my: 1.5 }} />
                            <Row label="Total" value={`₹${order.totalAmount}`} bold />
                            <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 1 }}>
                                Paid via {order.paymentMethod} · {order.paymentStatus}
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Shipping to</Typography>
                            <Typography variant="body2" fontWeight={700}>{order.shippingAddress.fullName}</Typography>
                            <Typography variant="body2" color={brand.inkMuted}>
                                {order.shippingAddress.line1}
                                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                            </Typography>
                            <Typography variant="body2" color={brand.inkMuted}>
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </Typography>
                            <Typography variant="body2" color={brand.inkMuted}>
                                Phone: {order.shippingAddress.phone}
                            </Typography>
                        </Paper>

                        {cancellable.includes(order.orderStatus) && (
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={handleCancel}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling…' : 'Cancel order'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

function Row({ label, value, bold }) {
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

export default OrderDetail;
