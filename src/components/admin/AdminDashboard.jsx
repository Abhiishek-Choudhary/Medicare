import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Skeleton, Chip, Divider, alpha } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import AdminLayout from './AdminLayout';
import { adminGetStats, adminGetActivity } from '../../services/api';
import { brand } from '../../theme';

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function StatCard({ icon, label, value, sub, color = brand.primary }) {
    return (
        <Paper sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 48, height: 48, borderRadius: 2,
                    display: 'grid', placeItems: 'center',
                    background: alpha(color, 0.12), color,
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" color={brand.inkMuted} fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} lineHeight={1.1}>
                        {value}
                    </Typography>
                </Box>
            </Box>
            {sub && (
                <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block', mt: 1.2 }}>
                    {sub}
                </Typography>
            )}
        </Paper>
    );
}

const typeMeta = {
    order:        { color: brand.primary, label: 'Order' },
    appointment:  { color: brand.success, label: 'Appointment' },
    prescription: { color: brand.accent,  label: 'Prescription' },
};

function ActivityItem({ event }) {
    const meta = typeMeta[event.type] || { color: brand.inkMuted, label: event.type };
    return (
        <Box sx={{
            display: 'flex', gap: 2, py: 1.5, alignItems: 'flex-start',
            borderBottom: `1px solid ${brand.border}`,
            '&:last-of-type': { borderBottom: 'none' },
        }}>
            <Chip
                label={meta.label}
                size="small"
                sx={{
                    background: alpha(meta.color, 0.15), color: meta.color,
                    fontWeight: 700, minWidth: 100,
                }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{event.title}</Typography>
                <Typography variant="caption" color={brand.inkMuted}>{event.subtitle}</Typography>
                <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block' }}>
                    by <b>{event.actor}</b> · {new Date(event.at).toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([adminGetStats(), adminGetActivity()])
            .then(([s, a]) => {
                setStats(s.data);
                setActivity(a.data || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout title="Dashboard">
            {loading ? (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={110} />)}
                </Box>
            ) : (
                <>
                    <Box sx={{
                        display: 'grid', gap: 2,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                        mb: 3,
                    }}>
                        <StatCard
                            icon={<PeopleIcon />} color={brand.primary}
                            label="Customers" value={stats.users}
                            sub={`Registered users`}
                        />
                        <StatCard
                            icon={<MedicalServicesIcon />} color={brand.success}
                            label="Doctors" value={stats.doctors}
                            sub="Available on platform"
                        />
                        <StatCard
                            icon={<EventNoteIcon />} color={brand.accent}
                            label="Appointments" value={stats.appointments}
                            sub={`${stats.todayAppointments} booked today`}
                        />
                        <StatCard
                            icon={<ReceiptLongIcon />} color={brand.primary}
                            label="Medicine Orders" value={stats.orders}
                            sub={`${stats.todayOrders} placed today`}
                        />
                        <StatCard
                            icon={<CurrencyRupeeIcon />} color={brand.success}
                            label="Pharmacy Revenue" value={rupees(stats.pharmacyRevenue)}
                            sub={`From ${stats.paidOrders} paid orders`}
                        />
                        <StatCard
                            icon={<CurrencyRupeeIcon />} color={brand.success}
                            label="Consult Revenue" value={rupees(stats.consultRevenue)}
                            sub="Doctor consultation payments"
                        />
                        <StatCard
                            icon={<ReceiptLongIcon />} color={brand.success}
                            label="Delivered" value={stats.deliveredOrders}
                            sub={`${stats.cancelledOrders} cancelled`}
                        />
                        <StatCard
                            icon={<DescriptionIcon />} color={brand.accent}
                            label="Pending Prescriptions" value={stats.pendingPrescriptions}
                            sub="Awaiting verification"
                        />
                    </Box>

                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={800}>Recent Activity</Typography>
                            <Chip label={`${activity.length} events`} size="small" />
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        {activity.length === 0 ? (
                            <Typography color={brand.inkMuted} sx={{ py: 3, textAlign: 'center' }}>
                                No activity yet.
                            </Typography>
                        ) : (
                            activity.map((e, i) => <ActivityItem key={i} event={e} />)
                        )}
                    </Paper>
                </>
            )}
        </AdminLayout>
    );
}

export default AdminDashboard;
