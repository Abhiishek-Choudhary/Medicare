import { useContext, useEffect, useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Tabs, Tab, TextField, Button, Chip, Skeleton, Alert,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Switch,
    FormControlLabel, Divider, Avatar, Autocomplete, alpha,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeIcon from '@mui/icons-material/Home';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate, Link } from 'react-router-dom';
import {
    getMyHospital, updateMyHospital,
    addHospitalService, updateHospitalService, deleteHospitalService,
    setHospitalDoctors, setHospitalMedicines,
    getHospitalBookingsInbox, updateHospitalBookingStatus,
    getAllDoctors, listMedicines,
} from '../../services/api';
import DoctorAvatar from '../DoctorAvatar';
import { DataContext } from '../../context/DataProvider';
import { CartContext } from '../../context/CartProvider';
import { brand } from '../../theme';

const emptyService = { name: '', description: '', category: '', price: 0, durationMinutes: 30, isActive: true };
const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function HospitalDashboard() {
    const navigate = useNavigate();
    const { account, setAccount } = useContext(DataContext);
    const { clearLocal } = useContext(CartContext);
    const [tab, setTab] = useState(0);
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!account || account.role !== 'hospital') {
            navigate('/hospital/login');
            return;
        }
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const load = () => {
        setLoading(true);
        getMyHospital()
            .then((res) => setHospital(res.data))
            .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    };

    const handleLogout = () => {
        setAccount(null, null);
        clearLocal();
        navigate('/hospital/login');
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 1240, mx: 'auto' }}>
                <Skeleton variant="rounded" height={500} />
            </Box>
        );
    }

    if (!hospital) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Alert severity="error">{error || 'No hospital profile found.'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            {/* Top bar */}
            <Paper sx={{ borderRadius: 0, borderBottom: `1px solid ${brand.border}`, py: 1.5, px: { xs: 2, md: 3 } }}>
                <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalHospitalIcon sx={{ color: brand.primary }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={800} lineHeight={1}>{hospital.name}</Typography>
                        <Typography variant="caption" color={brand.inkFaint}>Hospital dashboard</Typography>
                    </Box>
                    <Button component={Link} to="/" startIcon={<HomeIcon />} size="small">Site</Button>
                    <Button onClick={handleLogout} startIcon={<LogoutIcon />} size="small" color="error">Logout</Button>
                </Box>
            </Paper>

            <Box sx={{ maxWidth: 1240, mx: 'auto', p: { xs: 2, md: 3 } }}>
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: `1px solid ${brand.border}` }}
                    >
                        <Tab icon={<BusinessIcon />} iconPosition="start" label="Profile" />
                        <Tab icon={<EventNoteIcon />} iconPosition="start" label="Bookings" />
                        <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Services" />
                        <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Doctors" />
                        <Tab icon={<LocalPharmacyIcon />} iconPosition="start" label="Medicines" />
                    </Tabs>
                </Paper>

                {tab === 0 && <ProfileTab hospital={hospital} onSaved={setHospital} />}
                {tab === 1 && <BookingsTab hospitalId={hospital._id} />}
                {tab === 2 && <ServicesTab hospital={hospital} onChange={load} />}
                {tab === 3 && <DoctorsTab hospital={hospital} onChange={load} />}
                {tab === 4 && <MedicinesTab hospital={hospital} onChange={load} />}
            </Box>
        </Box>
    );
}

// ── PROFILE TAB ────────────────────────────────────────────────
function ProfileTab({ hospital, onSaved }) {
    const [form, setForm] = useState({
        name: hospital.name || '',
        description: hospital.description || '',
        address: hospital.address || '',
        city: hospital.city || '',
        state: hospital.state || '',
        pincode: hospital.pincode || '',
        phone: hospital.phone || '',
        emergencyPhone: hospital.emergencyPhone || '',
        email: hospital.email || '',
        website: hospital.website || '',
        openingTime: hospital.openingTime || '09:00',
        closingTime: hospital.closingTime || '18:00',
        is24x7: !!hospital.is24x7,
        specialties: (hospital.specialties || []).join(', '),
        facilities: (hospital.facilities || []).join(', '),
        logoUrl: hospital.logoUrl || '',
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');

    const save = async () => {
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
                facilities: form.facilities.split(',').map((s) => s.trim()).filter(Boolean),
            };
            const { data } = await updateMyHospital(payload);
            onSaved(data);
            setToast('Hospital profile updated');
            setTimeout(() => setToast(''), 2500);
        } catch (e) {
            setError(e?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>General</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <TextField label="Hospital name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <TextField label="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
                    <TextField label="Description" multiline rows={2} sx={{ gridColumn: { md: '1 / -1' } }}
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <TextField label="Specialties (comma-separated)" value={form.specialties}
                        onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
                    <TextField label="Facilities (comma-separated)" value={form.facilities}
                        onChange={(e) => setForm({ ...form, facilities: e.target.value })} />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Contact & Location</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <TextField label="Address" sx={{ gridColumn: { md: '1 / -1' } }}
                        value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <TextField label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    <TextField label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                    <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <TextField label="Emergency phone" value={form.emergencyPhone}
                        onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
                    <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <TextField label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Working Hours</Typography>
                <FormControlLabel
                    control={<Switch checked={form.is24x7} onChange={(e) => setForm({ ...form, is24x7: e.target.checked })} />}
                    label="Open 24 × 7"
                />
                {!form.is24x7 && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        <TextField label="Opening time" type="time" value={form.openingTime}
                            onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                            InputLabelProps={{ shrink: true }} />
                        <TextField label="Closing time" type="time" value={form.closingTime}
                            onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                            InputLabelProps={{ shrink: true }} />
                    </Box>
                )}
            </Paper>

            <Button variant="contained" size="large" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
            </Button>
        </>
    );
}

// ── BOOKINGS TAB ───────────────────────────────────────────────
const BOOKING_STATUS_COLORS = {
    pending: brand.accent,
    confirmed: brand.primary,
    completed: brand.success,
    cancelled: brand.danger,
    no_show: brand.danger,
};

function BookingsTab({ hospitalId }) {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState('');
    const [cancelling, setCancelling] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const params = {};
        if (status) params.status = status;
        if (date) params.date = date;
        getHospitalBookingsInbox(params)
            .then((res) => setItems(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [status, date]);

    useEffect(() => { load(); }, [load]);

    const changeStatus = async (id, s, reason) => {
        setUpdating(id);
        try {
            await updateHospitalBookingStatus(id, { status: s, cancellationReason: reason });
            setToast(`Booking marked ${s}`);
            setTimeout(() => setToast(''), 2500);
            load();
            setCancelling(null);
        } catch (e) {
        } finally {
            setUpdating(null);
        }
    };

    return (
        <>
            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="no_show">No show</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        type="date" size="small" label="Date"
                        InputLabelProps={{ shrink: true }} value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Button size="small" onClick={() => { setStatus(''); setDate(''); }}>Clear</Button>
                    <Chip label={`${items.length} bookings`} size="small" sx={{ background: brand.surfaceAlt, ml: 'auto' }} />
                </Box>
            </Paper>

            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={55} sx={{ mb: 0.5 }} />)}
                    </Box>
                ) : items.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography color={brand.inkMuted}>No bookings</Typography>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ background: brand.surfaceAlt }}>
                                <TableRow>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>When</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((b) => {
                                    const c = BOOKING_STATUS_COLORS[b.status] || brand.inkMuted;
                                    return (
                                        <TableRow key={b._id} hover>
                                            <TableCell>
                                                <Typography fontWeight={700}>{b.customerName}</Typography>
                                                <Typography variant="caption" color={brand.inkMuted}>
                                                    {b.customerPhone} · {b.customerEmail}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{b.serviceName}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                                </Typography>
                                                <Typography variant="caption" color={brand.inkFaint}>
                                                    {b.timeSlot} · {b.durationMinutes} min
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right"><Typography fontWeight={700}>{rupees(b.amount)}</Typography></TableCell>
                                            <TableCell align="center">
                                                <Chip label={b.status.replace('_', ' ')} size="small" sx={{
                                                    textTransform: 'capitalize', fontWeight: 700,
                                                    background: alpha(c, 0.15), color: c,
                                                }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                {b.status === 'pending' && (
                                                    <Button size="small" onClick={() => changeStatus(b._id, 'confirmed')} disabled={updating === b._id}>
                                                        Confirm
                                                    </Button>
                                                )}
                                                {['pending', 'confirmed'].includes(b.status) && (
                                                    <>
                                                        <Button size="small" color="success" onClick={() => changeStatus(b._id, 'completed')} disabled={updating === b._id}>
                                                            Complete
                                                        </Button>
                                                        <Button size="small" color="error" onClick={() => setCancelling(b)} disabled={updating === b._id}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>

            <Dialog open={!!cancelling} onClose={() => setCancelling(null)} maxWidth="xs" fullWidth>
                {cancelling && (
                    <>
                        <DialogTitle>Cancel booking</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus fullWidth multiline rows={2} label="Reason"
                                value={cancelling._reason || ''}
                                onChange={(e) => setCancelling({ ...cancelling, _reason: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCancelling(null)}>Close</Button>
                            <Button
                                color="error" variant="contained"
                                onClick={() => changeStatus(cancelling._id, 'cancelled', cancelling._reason)}
                            >
                                Cancel booking
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

// ── SERVICES TAB ───────────────────────────────────────────────
function ServicesTab({ hospital, onChange }) {
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');

    const save = async () => {
        if (!editing.name || editing.price == null) { setError('Name and price are required'); return; }
        setSaving(true);
        setError('');
        try {
            if (editing._new) {
                await addHospitalService(editing);
            } else {
                await updateHospitalService(editing._id, editing);
            }
            setToast('Service saved');
            setTimeout(() => setToast(''), 2500);
            setEditing(null);
            onChange();
        } catch (e) {
            setError(e?.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (s) => {
        if (!window.confirm(`Delete service "${s.name}"?`)) return;
        await deleteHospitalService(s._id);
        onChange();
    };

    return (
        <>
            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing({ ...emptyService, _new: true })}>
                    Add service
                </Button>
            </Box>

            <Paper sx={{ overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ background: brand.surfaceAlt }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Duration</TableCell>
                            <TableCell align="center">Active</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hospital.services.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography color={brand.inkMuted}>No services yet. Add your first one.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : hospital.services.map((s) => (
                            <TableRow key={s._id} hover>
                                <TableCell>
                                    <Typography fontWeight={700}>{s.name}</Typography>
                                    <Typography variant="caption" color={brand.inkFaint}>{s.description}</Typography>
                                </TableCell>
                                <TableCell>{s.category || '—'}</TableCell>
                                <TableCell align="right"><Typography fontWeight={700}>{rupees(s.price)}</Typography></TableCell>
                                <TableCell align="center">{s.durationMinutes} min</TableCell>
                                <TableCell align="center">
                                    <Chip label={s.isActive ? 'Yes' : 'No'} size="small" color={s.isActive ? 'success' : 'default'} />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" onClick={() => setEditing(s)} sx={{ color: brand.primary }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => remove(s)} sx={{ color: brand.danger }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
                {editing && (
                    <>
                        <DialogTitle>{editing._new ? 'Add Service' : 'Edit Service'}</DialogTitle>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                <TextField label="Name *" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                />
                                <TextField label="Category" size="small" placeholder="e.g. Consultation, Diagnostic"
                                    value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                />
                                <TextField label="Duration (minutes) *" type="number" size="small"
                                    value={editing.durationMinutes}
                                    onChange={(e) => setEditing({ ...editing, durationMinutes: Number(e.target.value) })}
                                />
                                <TextField label="Price (INR) *" type="number" size="small" sx={{ gridColumn: '1 / -1' }}
                                    value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                                />
                                <TextField label="Description" multiline rows={2} sx={{ gridColumn: '1 / -1' }}
                                    value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                />
                                <FormControlLabel
                                    control={<Switch checked={editing.isActive}
                                        onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />}
                                    label="Active (bookable)"
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditing(null)}>Cancel</Button>
                            <Button variant="contained" onClick={save} disabled={saving}>
                                {saving ? 'Saving…' : editing._new ? 'Add' : 'Save'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

// ── DOCTORS TAB ────────────────────────────────────────────────
function DoctorsTab({ hospital, onChange }) {
    const [allDoctors, setAllDoctors] = useState([]);
    const [selected, setSelected] = useState(hospital.affiliatedDoctorIds || []);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getAllDoctors().then((res) => setAllDoctors(res?.data || [])).catch(() => {});
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await setHospitalDoctors(selected.map((s) => s._id));
            setToast('Affiliations updated');
            setTimeout(() => setToast(''), 2500);
            onChange();
        } catch { /* ignore */ }
        finally { setSaving(false); }
    };

    return (
        <>
            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Affiliated Doctors</Typography>
                <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 2 }}>
                    Pick doctors that patients will see when browsing this hospital.
                </Typography>

                <Autocomplete
                    multiple
                    options={allDoctors}
                    value={selected}
                    onChange={(_, v) => setSelected(v)}
                    getOptionLabel={(o) => `${o.name} — ${o.speciality || ''}`}
                    isOptionEqualToValue={(a, b) => a._id === b._id}
                    renderOption={(props, o) => (
                        <li {...props} key={o._id}>
                            <Box sx={{ width: 32, height: 32, mr: 1.5, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                <DoctorAvatar src={o.imageUrl} name={o.name} variant="circle" size={32} />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>{o.name}</Typography>
                                <Typography variant="caption" color={brand.inkFaint}>{o.speciality}</Typography>
                            </Box>
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} placeholder="Search doctors" />}
                />

                <Divider sx={{ my: 3 }} />

                <Button variant="contained" onClick={save} disabled={saving}>
                    {saving ? 'Saving…' : 'Save affiliations'}
                </Button>
            </Paper>
        </>
    );
}

// ── MEDICINES TAB ──────────────────────────────────────────────
function MedicinesTab({ hospital, onChange }) {
    const [allMeds, setAllMeds] = useState([]);
    const [selected, setSelected] = useState(hospital.inHouseMedicineIds || []);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        listMedicines({ limit: 200 }).then((res) => setAllMeds(res.data?.items || [])).catch(() => {});
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await setHospitalMedicines(selected.map((s) => s._id));
            setToast('In-house catalog updated');
            setTimeout(() => setToast(''), 2500);
            onChange();
        } catch { /* ignore */ }
        finally { setSaving(false); }
    };

    return (
        <>
            {toast && <Alert severity="success" sx={{ mb: 2 }}>{toast}</Alert>}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>In-house Medicines</Typography>
                <Typography variant="body2" color={brand.inkMuted} sx={{ mb: 2 }}>
                    Mark medicines your pharmacy carries. Patients can filter the store to only show these.
                </Typography>

                <Autocomplete
                    multiple
                    options={allMeds}
                    value={selected}
                    onChange={(_, v) => setSelected(v)}
                    getOptionLabel={(o) => `${o.name} (${o.brand || 'Generic'})`}
                    isOptionEqualToValue={(a, b) => a._id === b._id}
                    renderInput={(params) => <TextField {...params} placeholder="Search medicines" />}
                />

                <Divider sx={{ my: 3 }} />

                <Button variant="contained" onClick={save} disabled={saving}>
                    {saving ? 'Saving…' : 'Save in-house list'}
                </Button>
            </Paper>
        </>
    );
}

export default HospitalDashboard;
