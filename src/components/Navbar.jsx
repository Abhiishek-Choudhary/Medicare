import React, { useContext } from 'react';
import { Box, Button, Avatar, Menu, MenuItem, Divider, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataProvider';

const LOGO_URL = 'https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg';

const PATIENT_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Meetings', path: '/meetings' },
    { label: 'My Appointments', path: '/patient-dashboard' },
];

const DOCTOR_LINKS = [
    { label: 'Dashboard', path: '/doctor-dashboard' },
    { label: 'Meetings', path: '/meetings' },
];

const GUEST_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Meetings', path: '/meetings' },
];

function NavLink({ label, path }) {
    const location = useLocation();
    const active = location.pathname === path;
    return (
        <Box
            component={Link}
            to={path}
            sx={{
                px: 2, py: 0.8, borderRadius: 2, textDecoration: 'none',
                fontWeight: active ? 700 : 500, fontSize: 15,
                color: active ? '#1976d2' : '#444',
                bgcolor: active ? '#e3f0ff' : 'transparent',
                '&:hover': { bgcolor: '#f0f4ff', color: '#1976d2' },
                transition: '0.2s',
            }}
        >
            {label}
        </Box>
    );
}

function Navbar() {
    const { account, role, setAccount } = useContext(DataContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLogout = () => {
        setAccount(null, null);
        setAnchorEl(null);
        navigate('/login');
    };

    const links = !account ? GUEST_LINKS : role === 'doctor' ? DOCTOR_LINKS : PATIENT_LINKS;
    const displayName = account?.name || account?.username || 'User';
    const dashboardPath = role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', px: 3, py: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff',
            position: 'sticky', top: 0, zIndex: 100,
        }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img width={80} src={LOGO_URL} alt='Medicare logo' style={{ borderRadius: 8 }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                {links.map(l => <NavLink key={l.path} {...l} />)}
            </Box>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {account ? (
                    <>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>{displayName}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                {role}
                            </Typography>
                        </Box>
                        <Avatar
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ width: 36, height: 36, bgcolor: role === 'doctor' ? '#2e7d32' : '#1976d2', fontSize: 15, cursor: 'pointer' }}
                        >
                            {displayName[0].toUpperCase()}
                        </Avatar>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem disabled sx={{ fontSize: 13 }}>{account.email}</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { navigate(dashboardPath); setAnchorEl(null); }}>
                                My Dashboard
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button variant="contained" component={Link} to="/login" sx={{ borderRadius: 2 }}>
                        Login
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Navbar;
