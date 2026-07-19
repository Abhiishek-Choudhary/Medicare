import { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Skeleton, IconButton, Avatar, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import DoctorAvatar from '../DoctorAvatar';
import { adminListDoctors } from '../../services/api';
import { brand } from '../../theme';

const csvColumns = [
    { key: 'title', label: 'Doctor' },
    { key: 'category', label: 'Category' },
    { key: 'fee', label: 'Fee (INR)' },
    { key: 'available', label: 'Available' },
    { key: 'totalAppointments', label: 'Appointments' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'revenue', label: 'Revenue (INR)' },
    { key: 'avgRating', label: 'Avg Rating' },
];

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function AdminDoctors() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            adminListDoctors({ q })
                .then((res) => setItems(res.data || []))
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(t);
    }, [q]);

    return (
        <AdminLayout title="Doctors">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by name…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        size="small"
                        sx={{ minWidth: 280 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Chip label={`${items.length} doctors`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="doctors.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} height={60} sx={{ mb: 0.5 }} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Fee</TableCell>
                                    <TableCell align="center">Appointments</TableCell>
                                    <TableCell align="center">Cancelled</TableCell>
                                    <TableCell align="right">Revenue</TableCell>
                                    <TableCell align="center">Rating</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No doctors found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((d) => (
                                    <TableRow key={d._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                                    <DoctorAvatar
                                                        src={d.url}
                                                        name={d.title}
                                                        variant="circle"
                                                        size={40}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography fontWeight={700}>{d.title}</Typography>
                                                    <Typography variant="caption" color={brand.inkFaint}>
                                                        {d.available === false ? 'Unavailable' : 'Available'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={d.category} size="small" sx={{ background: brand.surfaceAlt }} />
                                        </TableCell>
                                        <TableCell align="right">{rupees(d.fee)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={d.totalAppointments}
                                                size="small"
                                                sx={{
                                                    background: alpha(brand.primary, 0.15),
                                                    color: brand.primary, fontWeight: 700,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography color={d.cancelled > 0 ? brand.danger : brand.inkMuted} fontWeight={600}>
                                                {d.cancelled}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight={700}>{rupees(d.revenue)}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {d.avgRating ? (
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
                                                    <StarIcon fontSize="small" sx={{ color: brand.accent }} />
                                                    <Typography fontWeight={700}>{d.avgRating}</Typography>
                                                </Box>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                component={Link}
                                                to={`/admin/doctors/${d._id}`}
                                                size="small"
                                                sx={{ color: brand.primary }}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>
        </AdminLayout>
    );
}

export default AdminDoctors;
