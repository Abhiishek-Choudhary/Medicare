import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Chip, Button, Skeleton, Tabs, Tab, LinearProgress, alpha } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { listMyOrders } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const STATUS_COLORS = {
    awaiting_payment: brand.accent,
    awaiting_verification: brand.accent,
    placed: brand.primary,
    confirmed: brand.primary,
    packed: brand.primary,
    shipped: brand.primary,
    out_for_delivery: brand.primary,
    delivered: brand.success,
    cancelled: brand.danger,
    returned: brand.danger,
};

const TIMELINE_ORDER = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const formatStatus = (s) => (s || '').replace(/_/g, ' ');

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
];

const matchesTab = (order, tabKey) => {
    if (tabKey === 'all') return true;
    if (tabKey === 'delivered') return order.orderStatus === 'delivered';
    if (tabKey === 'cancelled') return ['cancelled', 'returned'].includes(order.orderStatus);
    // active
    return !['delivered', 'cancelled', 'returned'].includes(order.orderStatus);
};

function orderProgress(order) {
    if (['cancelled', 'returned'].includes(order.orderStatus)) return { pct: 100, done: false };
    if (order.orderStatus === 'delivered') return { pct: 100, done: true };
    const idx = TIMELINE_ORDER.indexOf(order.orderStatus);
    if (idx < 0) return { pct: 5, done: false };
    return { pct: ((idx + 1) / TIMELINE_ORDER.length) * 100, done: false };
}

function Orders() {
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');

    useEffect(() => {
        if (!account || role !== 'patient') {
            navigate('/login', { state: { from: '/pharmacy/orders' } });
            return;
        }
        listMyOrders()
            .then((res) => setOrders(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const counts = useMemo(() => {
        const c = { all: orders.length, active: 0, delivered: 0, cancelled: 0 };
        for (const o of orders) {
            if (matchesTab(o, 'active')) c.active += 1;
            if (matchesTab(o, 'delivered')) c.delivered += 1;
            if (matchesTab(o, 'cancelled')) c.cancelled += 1;
        }
        return c;
    }, [orders]);

    const filteredOrders = useMemo(
        () => orders.filter((o) => matchesTab(o, tab)),
        [orders, tab]
    );

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />
            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Typography variant="h4" fontWeight={800}>My Orders</Typography>
                    <Button component={Link} to="/pharmacy" variant="outlined" size="small">
                        Continue shopping
                    </Button>
                </Box>

                {orders.length > 0 && (
                    <Paper sx={{ mb: 3, overflow: 'hidden' }}>
                        <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ borderBottom: `1px solid ${brand.border}` }}
                        >
                            {TABS.map((t) => (
                                <Tab
                                    key={t.key}
                                    value={t.key}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {t.label}
                                            <Chip
                                                label={counts[t.key]}
                                                size="small"
                                                sx={{
                                                    height: 20, fontSize: 11, fontWeight: 700,
                                                    background: tab === t.key ? alpha(brand.primary, 0.15) : brand.surfaceAlt,
                                                    color: tab === t.key ? brand.primary : brand.inkMuted,
                                                }}
                                            />
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Paper>
                )}

                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={140} sx={{ mb: 2 }} />
                    ))
                ) : orders.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', py: 8,
                        background: '#fff', borderRadius: 4,
                        border: `1px dashed ${brand.border}`,
                    }}>
                        <ReceiptLongIcon sx={{ fontSize: 72, color: brand.inkFaint, mb: 2 }} />
                        <Typography variant="h6" fontWeight={700}>No orders yet</Typography>
                        <Button component={Link} to="/pharmacy" variant="contained" sx={{ mt: 2 }}>
                            Shop medicines
                        </Button>
                    </Box>
                ) : filteredOrders.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', py: 6,
                        background: '#fff', borderRadius: 4,
                        border: `1px dashed ${brand.border}`,
                    }}>
                        <Typography variant="body1" color={brand.inkMuted}>
                            No orders in this category yet.
                        </Typography>
                    </Box>
                ) : (
                    filteredOrders.map((o) => {
                        const { pct, done } = orderProgress(o);
                        const isCancelled = ['cancelled', 'returned'].includes(o.orderStatus);
                        const statusColor = STATUS_COLORS[o.orderStatus] || brand.inkMuted;

                        return (
                            <Paper
                                key={o._id}
                                sx={{
                                    p: 2.5, mb: 2,
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                                }}
                                onClick={() => navigate(`/pharmacy/orders/${o._id}`)}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ flex: 1, minWidth: 180 }}>
                                        <Typography fontWeight={800}>{o.orderNumber}</Typography>
                                        <Typography variant="caption" color={brand.inkFaint}>
                                            {new Date(o.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ minWidth: 90 }}>
                                        <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block' }}>Items</Typography>
                                        <Typography fontWeight={600}>{o.items.length}</Typography>
                                    </Box>
                                    <Box sx={{ minWidth: 90 }}>
                                        <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block' }}>Total</Typography>
                                        <Typography fontWeight={800}>₹{o.totalAmount}</Typography>
                                    </Box>
                                    <Chip
                                        label={formatStatus(o.orderStatus)}
                                        sx={{
                                            textTransform: 'capitalize', fontWeight: 700,
                                            background: alpha(statusColor, 0.15),
                                            color: statusColor,
                                        }}
                                    />
                                </Box>

                                {/* Progress bar */}
                                <LinearProgress
                                    variant="determinate"
                                    value={pct}
                                    sx={{
                                        height: 6, borderRadius: 3,
                                        background: brand.surfaceAlt,
                                        '& .MuiLinearProgress-bar': {
                                            background: isCancelled ? brand.danger : done ? brand.success : brand.primary,
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                                <Typography variant="caption" color={brand.inkMuted} sx={{ display: 'block', mt: 0.5 }}>
                                    {isCancelled
                                        ? `Order ${o.orderStatus}`
                                        : done
                                            ? 'Delivered'
                                            : `In progress · ${formatStatus(o.orderStatus)}`
                                    }
                                    {o.requiresPrescription && ` · Rx ${o.prescriptionStatus}`}
                                </Typography>
                            </Paper>
                        );
                    })
                )}
            </Box>
            <Footer />
        </Box>
    );
}

export default Orders;
