import { useCallback, useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem,
    Table, TableHead, TableRow, TableCell, TableBody, Chip, Skeleton, Pagination, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import ExportButton from './ExportButton';
import { adminListDonors, adminVerifyDonor, adminDeleteDonor } from '../../services/api';
import { brand } from '../../theme';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const csvColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'availableMonths', label: 'Available Months', accessor: (r) => (r.availableMonths || []).join('; ') },
    { key: 'lastDonationDate', label: 'Last Donation', accessor: (r) => r.lastDonationDate ? new Date(r.lastDonationDate).toISOString().slice(0, 10) : '' },
    { key: 'verified', label: 'Verified' },
    { key: 'isActive', label: 'Active' },
    { key: 'createdAt', label: 'Joined', accessor: (r) => r.createdAt ? new Date(r.createdAt).toISOString() : '' },
];

function AdminBloodDonors() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [q, setQ] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [verified, setVerified] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        const params = { q, page, limit: 25 };
        if (bloodGroup) params.bloodGroup = bloodGroup;
        if (verified !== '') params.verified = verified;
        adminListDonors(params)
            .then((res) => {
                setItems(res.data.items || []);
                setTotal(res.data.total || 0);
                setPages(res.data.pages || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [q, bloodGroup, verified, page]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const toggleVerify = async (donor) => {
        setBusyId(donor._id);
        try {
            await adminVerifyDonor(donor._id, !donor.verified);
            setToast(donor.verified ? 'Verification revoked' : 'Donor verified');
            setTimeout(() => setToast(''), 2500);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Verify failed');
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async () => {
        setBusyId(confirmDelete._id);
        try {
            await adminDeleteDonor(confirmDelete._id);
            setToast(`${confirmDelete.fullName} removed`);
            setTimeout(() => setToast(''), 2500);
            setConfirmDelete(null);
            load();
        } catch (e) {
            setError(e?.response?.data?.message || 'Delete failed');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <AdminLayout title="Blood Donors">
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by name, email, city…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        size="small"
                        sx={{ minWidth: 260 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel>Blood group</InputLabel>
                        <Select value={bloodGroup} label="Blood group" onChange={(e) => { setBloodGroup(e.target.value); setPage(1); }}>
                            <MenuItem value=""><em>Any</em></MenuItem>
                            {BLOOD_GROUPS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel>Verified</InputLabel>
                        <Select value={verified} label="Verified" onChange={(e) => { setVerified(e.target.value); setPage(1); }}>
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
                    <Chip label={`${total} donors`} size="small" sx={{ background: brand.surfaceAlt }} />
                    <Box sx={{ ml: 'auto' }}>
                        <ExportButton filename="donors.csv" rows={items} columns={csvColumns} />
                    </Box>
                </Box>
            </Paper>

            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={55} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Donor</TableCell>
                                    <TableCell align="center">Blood Group</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Available in</TableCell>
                                    <TableCell align="center">Verified</TableCell>
                                    <TableCell align="center">Active</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <Typography color={brand.inkMuted}>No donors registered</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : items.map((d) => (
                                    <TableRow key={d._id} hover>
                                        <TableCell>
                                            <Typography fontWeight={700}>{d.fullName}</Typography>
                                            <Typography variant="caption" color={brand.inkMuted}>
                                                {d.phone} · {d.email}
                                            </Typography>
                                            <Typography variant="caption" color={brand.inkFaint} sx={{ display: 'block' }}>
                                                {d.age} yr · {d.gender || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={d.bloodGroup}
                                                sx={{
                                                    fontWeight: 800,
                                                    background: alpha(brand.danger, 0.15), color: brand.danger,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{d.city}, {d.state}</Typography>
                                            {d.pincode && <Typography variant="caption" color={brand.inkFaint}>{d.pincode}</Typography>}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, maxWidth: 200 }}>
                                                {(d.availableMonths || []).slice(0, 4).map((m) => (
                                                    <Chip key={m} label={m.slice(0, 3)} size="small" sx={{ height: 18, fontSize: 10 }} />
                                                ))}
                                                {d.availableMonths?.length > 4 && (
                                                    <Chip label={`+${d.availableMonths.length - 4}`} size="small" sx={{ height: 18, fontSize: 10 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {d.verified ? (
                                                <VerifiedIcon sx={{ color: brand.primary }} />
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={d.isActive === false ? 'No' : 'Yes'}
                                                size="small"
                                                color={d.isActive === false ? 'default' : 'success'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleVerify(d)}
                                                disabled={busyId === d._id}
                                                sx={{ color: d.verified ? brand.inkMuted : brand.primary }}
                                                title={d.verified ? 'Revoke verification' : 'Verify donor'}
                                            >
                                                {d.verified ? <UnpublishedIcon fontSize="small" /> : <VerifiedIcon fontSize="small" />}
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => setConfirmDelete(d)}
                                                sx={{ color: brand.danger }}
                                            >
                                                <DeleteIcon fontSize="small" />
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

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle>Remove donor?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        <b>{confirmDelete?.fullName}</b> will be removed from the donor list. They can re-register anytime.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Remove</Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

export default AdminBloodDonors;
