import { useContext, useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, TextField, MenuItem, FormControl, InputLabel, Select, Chip, Button,
    Tabs, Tab, Paper, Skeleton, Alert, IconButton, Divider, alpha,
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import LaunchIcon from '@mui/icons-material/Launch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getBloodMeta, searchDonors, listHospitals } from '../../services/api';
import { DataContext } from '../../context/DataProvider';
import { brand } from '../../theme';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function BloodBank() {
    const navigate = useNavigate();
    const { account, role } = useContext(DataContext);

    const [tab, setTab] = useState('donors');
    const [meta, setMeta] = useState({ bloodGroups: BLOOD_GROUPS, months: [] });
    const [bloodGroup, setBloodGroup] = useState('');
    const [city, setCity] = useState('');
    const [month, setMonth] = useState('');
    const [type, setType] = useState('');

    const [donors, setDonors] = useState([]);
    const [donorTotal, setDonorTotal] = useState(0);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getBloodMeta().then((res) => setMeta(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        setError('');
        const t = setTimeout(() => {
            if (tab === 'donors') {
                searchDonors({ bloodGroup, city, month, limit: 30 })
                    .then((res) => {
                        setDonors(res.data.items || []);
                        setDonorTotal(res.data.total || 0);
                    })
                    .catch((e) => setError(e?.response?.data?.message || 'Failed to search donors'))
                    .finally(() => setLoading(false));
            } else {
                listHospitals({ city, type, bloodGroup })
                    .then((res) => setHospitals(res.data || []))
                    .catch((e) => setError(e?.response?.data?.message || 'Failed to load hospitals'))
                    .finally(() => setLoading(false));
            }
        }, 300);
        return () => clearTimeout(t);
    }, [tab, bloodGroup, city, month, type]);

    const clearFilters = () => { setBloodGroup(''); setCity(''); setMonth(''); setType(''); };

    const canRegisterAsDonor = useMemo(() => account && role !== 'doctor', [account, role]);

    return (
        <Box sx={{ minHeight: '100vh', background: brand.surfaceMuted }}>
            <Navbar />

            {/* Hero */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brand.danger} 0%, #7f1d1d 100%)`,
                    color: '#fff',
                    py: { xs: 5, md: 7 },
                    px: 3,
                }}
            >
                <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                        <BloodtypeIcon sx={{ fontSize: 48 }} />
                        <Typography variant="h3" fontWeight={800}>Blood Bank</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 640, mb: 3 }}>
                        Find willing donors near you, connect with hospitals and blood banks,
                        or register yourself as a life-saver.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<PersonAddIcon />}
                        onClick={() => canRegisterAsDonor ? navigate('/blood/register') : navigate('/login', { state: { from: '/blood/register' } })}
                        sx={{
                            background: '#fff', color: brand.danger,
                            '&:hover': { background: '#fff', opacity: 0.9 },
                        }}
                    >
                        Register as a donor
                    </Button>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
                {/* Tabs */}
                <Paper sx={{ mb: 2 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="fullWidth"
                        sx={{ borderBottom: `1px solid ${brand.border}` }}
                    >
                        <Tab value="donors" icon={<BloodtypeIcon />} iconPosition="start" label="Find Donors" />
                        <Tab value="hospitals" icon={<LocalHospitalIcon />} iconPosition="start" label="Hospitals & Blood Banks" />
                    </Tabs>
                </Paper>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <InputLabel>Blood group</InputLabel>
                            <Select value={bloodGroup} label="Blood group" onChange={(e) => setBloodGroup(e.target.value)}>
                                <MenuItem value=""><em>Any</em></MenuItem>
                                {(meta.bloodGroups || BLOOD_GROUPS).map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small" label="City" value={city}
                            onChange={(e) => setCity(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />

                        {tab === 'donors' && (
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Available month</InputLabel>
                                <Select value={month} label="Available month" onChange={(e) => setMonth(e.target.value)}>
                                    <MenuItem value=""><em>Any month</em></MenuItem>
                                    {(meta.months || []).map((m) => (
                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {tab === 'hospitals' && (
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Type</InputLabel>
                                <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                                    <MenuItem value=""><em>All</em></MenuItem>
                                    <MenuItem value="hospital">Hospital</MenuItem>
                                    <MenuItem value="blood_bank">Blood bank</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Button size="small" onClick={clearFilters}>Clear</Button>
                        <Box sx={{ ml: 'auto' }}>
                            <Chip
                                label={tab === 'donors' ? `${donorTotal} donors` : `${hospitals.length} hospitals`}
                                size="small"
                                sx={{ background: brand.surfaceAlt }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Results */}
                {loading ? (
                    <Box sx={{
                        display: 'grid', gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    }}>
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={220} />)}
                    </Box>
                ) : tab === 'donors' ? (
                    donors.length === 0 ? (
                        <EmptyState message="No matching donors found. Try clearing filters." />
                    ) : (
                        <Box sx={{
                            display: 'grid', gap: 2,
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                        }}>
                            {donors.map((d) => <DonorCard key={d._id} donor={d} />)}
                        </Box>
                    )
                ) : (
                    hospitals.length === 0 ? (
                        <EmptyState message="No hospitals found. Try clearing filters." />
                    ) : (
                        <Box sx={{
                            display: 'grid', gap: 2,
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        }}>
                            {hospitals.map((h) => <HospitalCard key={h._id} hospital={h} />)}
                        </Box>
                    )
                )}
            </Box>

            <Footer />
        </Box>
    );
}

function DonorCard({ donor }) {
    const contactHidden = !donor.showContactInfo;
    return (
        <Paper sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: 2,
                    background: alpha(brand.danger, 0.12), color: brand.danger,
                    display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20,
                }}>
                    {donor.bloodGroup}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontWeight={800} noWrap>{donor.fullName}</Typography>
                        {donor.verified && <VerifiedIcon fontSize="small" sx={{ color: brand.primary }} />}
                    </Box>
                    <Typography variant="caption" color={brand.inkMuted}>
                        {donor.age} yr · {donor.gender || 'N/A'} · {donor.city}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            <Box>
                <Typography variant="caption" color={brand.inkFaint} fontWeight={600}>Available in</Typography>
                <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mt: 0.4 }}>
                    {(donor.availableMonths || []).slice(0, 6).map((m) => (
                        <Chip key={m} label={m.slice(0, 3)} size="small" sx={{
                            height: 20, fontSize: 10,
                            background: alpha(brand.success, 0.12), color: brand.success,
                        }} />
                    ))}
                    {donor.availableMonths?.length > 6 && (
                        <Chip label={`+${donor.availableMonths.length - 6}`} size="small" sx={{ height: 20, fontSize: 10 }} />
                    )}
                </Box>
            </Box>

            {donor.lastDonationDate && (
                <Typography variant="caption" color={brand.inkMuted}>
                    Last donated {new Date(donor.lastDonationDate).toLocaleDateString('en-IN')}
                </Typography>
            )}

            <Divider />

            {contactHidden ? (
                <Alert severity="info" sx={{ py: 0.5, fontSize: 12 }}>
                    Donor keeps contact info private. Contact via platform (coming soon).
                </Alert>
            ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        fullWidth variant="contained" color="error" size="small"
                        startIcon={<CallIcon />}
                        component="a" href={`tel:${donor.phone}`}
                    >
                        Call
                    </Button>
                    <Button
                        fullWidth variant="outlined" size="small"
                        startIcon={<EmailIcon />}
                        component="a" href={`mailto:${donor.email}?subject=Blood%20donation%20request%20(${donor.bloodGroup})`}
                    >
                        Email
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

function HospitalCard({ hospital }) {
    return (
        <Paper sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{
                    width: 48, height: 48, borderRadius: 2,
                    background: alpha(brand.primary, 0.12), color: brand.primary,
                    display: 'grid', placeItems: 'center',
                }}>
                    <LocalHospitalIcon />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography fontWeight={800}>{hospital.name}</Typography>
                        {hospital.is24x7 && (
                            <Chip label="24×7" size="small" sx={{
                                height: 18, fontSize: 10, fontWeight: 700,
                                background: alpha(brand.success, 0.15), color: brand.success,
                            }} />
                        )}
                    </Box>
                    <Typography variant="caption" color={brand.inkMuted} sx={{ textTransform: 'capitalize' }}>
                        {hospital.type.replace('_', ' ')} · {hospital.city}, {hospital.state}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="body2" color={brand.inkMuted}>
                {hospital.address}{hospital.pincode ? `, ${hospital.pincode}` : ''}
            </Typography>

            {hospital.bloodGroupsAvailable?.length > 0 && (
                <Box>
                    <Typography variant="caption" color={brand.inkFaint} fontWeight={600}>Blood groups typically available</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.4 }}>
                        {hospital.bloodGroupsAvailable.map((g) => (
                            <Chip key={g} label={g} size="small" sx={{
                                height: 20, fontSize: 10,
                                background: alpha(brand.danger, 0.1), color: brand.danger, fontWeight: 700,
                            }} />
                        ))}
                    </Box>
                </Box>
            )}

            {hospital.notes && (
                <Typography variant="caption" color={brand.inkMuted}>{hospital.notes}</Typography>
            )}

            <Divider />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                    variant="contained" color="error" size="small" startIcon={<CallIcon />}
                    component="a" href={`tel:${hospital.phone}`}
                >
                    {hospital.phone}
                </Button>
                {hospital.emergencyPhone && hospital.emergencyPhone !== hospital.phone && (
                    <Button
                        variant="outlined" color="error" size="small"
                        component="a" href={`tel:${hospital.emergencyPhone}`}
                    >
                        Emergency: {hospital.emergencyPhone}
                    </Button>
                )}
                {hospital.website && (
                    <IconButton size="small" component="a" href={hospital.website} target="_blank" rel="noreferrer" sx={{ color: brand.primary }}>
                        <LaunchIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
}

function EmptyState({ message }) {
    return (
        <Paper sx={{ textAlign: 'center', py: 8, border: `1px dashed ${brand.border}` }}>
            <BloodtypeIcon sx={{ fontSize: 72, color: brand.inkFaint, mb: 2 }} />
            <Typography variant="body1" color={brand.inkMuted}>{message}</Typography>
            <Button component={Link} to="/blood/register" variant="contained" sx={{ mt: 2 }}>
                Register as a donor
            </Button>
        </Paper>
    );
}

export default BloodBank;
