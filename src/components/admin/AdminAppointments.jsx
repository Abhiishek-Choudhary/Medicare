import { useEffect, useState } from 'react';
import {
    Box, Paper, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, Chip,
    Skeleton, Typography, Pagination, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import { adminListAppointments } from '../../services/api';
import { brand } from '../../theme';

const csvColumns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'customerEmail', label: 'Email' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date', accessor: (r) => r.date ? new Date(r.date).toISOString() : '' },
    { key: 'fee', label: 'Fee (INR)' },
    { key: 'rating', label: 'Rating' },
    { key: 'review', label: 'Review' },
    { key: 'status', label: 'Status' },
    { key: 'paymentId', label: 'Payment ID' },
];

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const STATUS_FILTERS = [
    { value: '', label: 'All statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
];

function AdminAppointments() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            adminListAppointments({ q, status, page, limit: 25 })
                .then((res) => {
                    setItems(res.data.items || []);
                    setPages(res.data.pages || 0);
                    setTotal(res.data.total || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(t);
    }, [q, status, page]);

    return (
        <AdminLayout title="Appointments">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search customer or doctor…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        size="small"
                        sx={{ minWidth: 280 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            {STATUS_FILTERS.map((s) => (
                                <MenuItem key={s.value || 'all'} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Chip label={`${total} appointments`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="appointments.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={50} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell align="right">Fee</TableCell>
                                    <TableCell align="center">Rating</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No appointments found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((a) => (
                                    <TableRow key={a._id} hover>
                                        <TableCell>
                                            <Typography fontWeight={600}>{a.customerName}</Typography>
                                            {a.customerEmail && (
                                                <Typography variant="caption" color={brand.inkFaint}>{a.customerEmail}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight={600}>Dr. {a.doctorName}</Typography>
                                        </TableCell>
                                        <TableCell>{fmt(a.date)}</TableCell>
                                        <TableCell align="right">{a.fee ? rupees(a.fee) : '—'}</TableCell>
                                        <TableCell align="center">
                                            {a.rating ? (
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
                                                    <StarIcon fontSize="small" sx={{ color: brand.accent }} />
                                                    <Typography fontWeight={700}>{a.rating}</Typography>
                                                </Box>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={a.status} size="small" sx={{ textTransform: 'capitalize' }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>

            {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={pages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                </Box>
            )}
        </AdminLayout>
    );
}

export default AdminAppointments;
