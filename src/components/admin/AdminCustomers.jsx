import { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Skeleton, Pagination, IconButton, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import { adminListCustomers } from '../../services/api';
import { brand } from '../../theme';

const csvColumns = [
    { key: 'username', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'orders', label: 'Orders' },
    { key: 'spent', label: 'Spent (INR)' },
    { key: 'createdAt', label: 'Joined', accessor: (r) => r.createdAt ? new Date(r.createdAt).toISOString() : '' },
    { key: 'lastOrder', label: 'Last Order', accessor: (r) => r.lastOrder ? new Date(r.lastOrder).toISOString() : '' },
];

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—';

function AdminCustomers() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            adminListCustomers({ q, page, limit: 20 })
                .then((res) => {
                    setItems(res.data.items || []);
                    setPages(res.data.pages || 0);
                    setTotal(res.data.total || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300); // debounce search
        return () => clearTimeout(t);
    }, [q, page]);

    return (
        <AdminLayout title="Customers">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by name or email…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
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
                    <Chip label={`${total} customers`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="customers.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} height={50} sx={{ mb: 0.5 }} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Customer</TableCell>
                                    <TableCell align="center">Appointments</TableCell>
                                    <TableCell align="center">Orders</TableCell>
                                    <TableCell align="right">Spent</TableCell>
                                    <TableCell>Last order</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No customers found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((c) => (
                                    <TableRow key={c._id} hover>
                                        <TableCell>
                                            <Typography fontWeight={700}>{c.username}</Typography>
                                            <Typography variant="caption" color={brand.inkMuted}>{c.email}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={c.appointments}
                                                size="small"
                                                sx={{
                                                    background: c.appointments > 0 ? alpha(brand.accent, 0.15) : brand.surfaceAlt,
                                                    color: c.appointments > 0 ? brand.accent : brand.inkMuted,
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={c.orders}
                                                size="small"
                                                sx={{
                                                    background: c.orders > 0 ? alpha(brand.primary, 0.15) : brand.surfaceAlt,
                                                    color: c.orders > 0 ? brand.primary : brand.inkMuted,
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight={700}>{rupees(c.spent)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={brand.inkMuted}>{fmt(c.lastOrder)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={brand.inkMuted}>{fmt(c.createdAt)}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                component={Link}
                                                to={`/admin/customers/${c._id}`}
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

            {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={pages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                </Box>
            )}
        </AdminLayout>
    );
}

export default AdminCustomers;
