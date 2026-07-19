import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Avatar, Menu, MenuItem, Divider, Typography, IconButton, Drawer, Badge, alpha } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataProvider';
import { CartContext } from '../context/CartProvider';
import { brand } from '../theme';

const ROLE_META = {
    patient:  { label: 'Patient',       icon: PersonIcon,           color: brand.primary,  bg: alpha(brand.primary, 0.12) },
    doctor:   { label: 'Doctor',        icon: MedicalServicesIcon,  color: brand.success,  bg: alpha(brand.success, 0.12) },
    hospital: { label: 'Hospital',      icon: LocalHospitalIcon,    color: brand.accent,   bg: alpha(brand.accent, 0.15) },
    admin:    { label: 'Administrator', icon: ShieldIcon,           color: '#7c3aed',      bg: alpha('#7c3aed', 0.12) },
};

const PATIENT_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Hospitals', path: '/hospitals' },
    { label: 'Medicines', path: '/pharmacy' },
    { label: 'Blood Bank', path: '/blood' },
    { label: 'Meetings', path: '/meetings' },
    { label: 'My Appointments', path: '/patient-dashboard' },
];

const DOCTOR_LINKS = [
    { label: 'Dashboard', path: '/doctor-dashboard' },
    { label: 'Blood Bank', path: '/blood' },
    { label: 'Meetings', path: '/meetings' },
];

const HOSPITAL_LINKS = [
    { label: 'Dashboard', path: '/hospital/dashboard' },
];

const GUEST_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Hospitals', path: '/hospitals' },
    { label: 'Medicines', path: '/pharmacy' },
    { label: 'Blood Bank', path: '/blood' },
    { label: 'Meetings', path: '/meetings' },
];

function Logomark({ size = 34 }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
                sx={{
                    width: size,
                    height: size,
                    borderRadius: 2.2,
                    background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: `0 6px 16px ${alpha(brand.primary, 0.35)}`,
                }}
            >
                <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 3H10V10H3V14H10V21H14V14H21V10H14V3Z" fill="white" />
                </svg>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', lineHeight: 1 }}>
                <Typography fontWeight={800} fontSize={18} letterSpacing="-0.02em" color={brand.ink}>
                    Medicare
                </Typography>
                <Typography fontSize={10} fontWeight={600} letterSpacing="0.18em" color={brand.primary}>
                    HEALTHCARE
                </Typography>
            </Box>
        </Box>
    );
}

function NavLink({ label, path, onClick }) {
    const location = useLocation();
    const active = location.pathname === path;
    return (
        <Box
            component={Link}
            to={path}
            onClick={onClick}
            sx={{
                position: 'relative',
                px: 1.5, py: 1,
                textDecoration: 'none',
                fontWeight: active ? 700 : 500,
                fontSize: 14.5,
                color: active ? brand.primary : brand.inkMuted,
                transition: 'color 0.2s',
                '&:hover': { color: brand.primary },
                '&::after': active ? {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: 2,
                    width: 22,
                    height: 3,
                    borderRadius: 2,
                    transform: 'translateX(-50%)',
                    background: brand.primary,
                } : {},
            }}
        >
            {label}
        </Box>
    );
}

function Navbar() {
    const { account, role, setAccount } = useContext(DataContext);
    const { itemCount, clearLocal } = useContext(CartContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [drawer, setDrawer] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        setAccount(null, null);
        clearLocal();
        setAnchorEl(null);
        navigate('/login');
    };

    const links = !account
        ? GUEST_LINKS
        : role === 'doctor'
            ? DOCTOR_LINKS
            : role === 'hospital'
                ? HOSPITAL_LINKS
                : PATIENT_LINKS;
    const displayName = account?.name || account?.username || 'User';
    const dashboardPath = role === 'doctor'
        ? '/doctor-dashboard'
        : role === 'hospital'
            ? '/hospital/dashboard'
            : '/patient-dashboard';

    return (
        <Box
            sx={{
                position: 'sticky', top: 0, zIndex: 1100,
                backdropFilter: 'saturate(160%) blur(14px)',
                WebkitBackdropFilter: 'saturate(160%) blur(14px)',
                background: scrolled ? alpha('#ffffff', 0.85) : alpha('#ffffff', 0.6),
                borderBottom: `1px solid ${scrolled ? brand.border : 'transparent'}`,
                transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
                boxShadow: scrolled ? '0 6px 18px rgba(15,23,42,0.05)' : 'none',
            }}
        >
            <Box
                sx={{
                    maxWidth: 1240, mx: 'auto',
                    px: { xs: 2.5, md: 4 }, py: 1.4,
                    display: 'flex', alignItems: 'center', gap: 2,
                }}
            >
                <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
                    <Logomark />
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 3 }}>
                    {links.map(l => <NavLink key={l.path} {...l} />)}
                </Box>

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    {(role !== 'doctor' && role !== 'hospital') && (
                        <Box
                            component={Link}
                            to={account ? '/pharmacy/cart' : '/login'}
                            sx={{
                                position: 'relative',
                                display: 'inline-flex', alignItems: 'center', gap: 0.6,
                                px: itemCount > 0 ? 1.4 : 1,
                                py: 0.8,
                                borderRadius: 999,
                                textDecoration: 'none',
                                background: itemCount > 0 ? brand.primarySoft : '#fff',
                                border: `1px solid ${itemCount > 0 ? alpha(brand.primary, 0.35) : brand.border}`,
                                color: itemCount > 0 ? brand.primary : brand.ink,
                                transition: 'transform 0.15s, box-shadow 0.2s, border-color 0.2s, background 0.2s',
                                '&:hover': {
                                    borderColor: brand.primary,
                                    background: brand.primarySoft,
                                    color: brand.primary,
                                    boxShadow: `0 6px 18px ${alpha(brand.primary, 0.18)}`,
                                    transform: 'translateY(-1px)',
                                    '& .cart-icon': {
                                        transform: 'rotate(-8deg) scale(1.08)',
                                    },
                                },
                            }}
                        >
                            <Badge
                                badgeContent={itemCount}
                                overlap="circular"
                                slotProps={{
                                    badge: {
                                        sx: {
                                            background: `linear-gradient(135deg, ${brand.danger}, #b91c1c)`,
                                            color: '#fff',
                                            fontWeight: 800,
                                            fontSize: 10,
                                            minWidth: 18, height: 18,
                                            border: `2px solid #fff`,
                                            boxShadow: `0 2px 6px ${alpha(brand.danger, 0.4)}`,
                                            animation: itemCount > 0 ? 'cartPop 0.4s ease' : 'none',
                                            '@keyframes cartPop': {
                                                '0%': { transform: 'scale(0.6)' },
                                                '60%': { transform: 'scale(1.15)' },
                                                '100%': { transform: 'scale(1)' },
                                            },
                                        },
                                    },
                                }}
                            >
                                <ShoppingCartOutlinedIcon
                                    className="cart-icon"
                                    sx={{
                                        fontSize: 22,
                                        transition: 'transform 0.2s ease',
                                    }}
                                />
                            </Badge>
                            {itemCount > 0 && (
                                <Typography
                                    variant="caption"
                                    fontWeight={800}
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        color: brand.primary,
                                        fontSize: 12.5,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    {itemCount === 1 ? '1 item' : `${itemCount} items`}
                                </Typography>
                            )}
                        </Box>
                    )}
                    {account ? (
                        <>
                            {(() => {
                                const meta = ROLE_META[role] || ROLE_META.patient;
                                const RoleIcon = meta.icon;
                                return (
                                    <Box
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        sx={{
                                            display: 'flex', alignItems: 'center', gap: 1,
                                            pl: 0.6, pr: { xs: 0.6, sm: 1.2 }, py: 0.6,
                                            borderRadius: 999,
                                            cursor: 'pointer',
                                            background: '#fff',
                                            border: `1px solid ${brand.border}`,
                                            transition: 'transform 0.15s, box-shadow 0.2s, border-color 0.2s',
                                            '&:hover': {
                                                borderColor: meta.color,
                                                boxShadow: `0 6px 18px ${alpha(meta.color, 0.18)}`,
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 34, height: 34,
                                                background: `linear-gradient(135deg, ${meta.color}, ${alpha(meta.color, 0.8)})`,
                                                fontSize: 14, fontWeight: 800,
                                                boxShadow: `0 4px 10px ${alpha(meta.color, 0.35)}`,
                                            }}
                                        >
                                            {displayName[0].toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                color={brand.ink}
                                                sx={{
                                                    fontSize: 13.5, lineHeight: 1.1,
                                                    maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {displayName}
                                            </Typography>
                                            <Box sx={{
                                                display: 'inline-flex', alignItems: 'center', gap: 0.4,
                                                mt: 0.3,
                                            }}>
                                                <RoleIcon sx={{ fontSize: 11, color: meta.color }} />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: meta.color,
                                                        fontWeight: 700, fontSize: 10.5,
                                                        letterSpacing: '0.06em',
                                                        textTransform: 'uppercase', lineHeight: 1,
                                                    }}
                                                >
                                                    {meta.label}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <KeyboardArrowDownIcon
                                            sx={{
                                                display: { xs: 'none', sm: 'inline-flex' },
                                                fontSize: 18, color: brand.inkFaint,
                                            }}
                                        />
                                    </Box>
                                );
                            })()}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            mt: 1.2, borderRadius: 3, minWidth: 260,
                                            border: `1px solid ${brand.border}`,
                                            boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
                                            overflow: 'hidden',
                                        },
                                    },
                                }}
                            >
                                {(() => {
                                    const meta = ROLE_META[role] || ROLE_META.patient;
                                    const RoleIcon = meta.icon;
                                    return (
                                        <Box sx={{ p: 2, background: meta.bg, borderBottom: `1px solid ${brand.border}` }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Avatar sx={{
                                                    width: 42, height: 42, fontWeight: 800, fontSize: 16,
                                                    background: `linear-gradient(135deg, ${meta.color}, ${alpha(meta.color, 0.8)})`,
                                                    boxShadow: `0 4px 12px ${alpha(meta.color, 0.35)}`,
                                                }}>
                                                    {displayName[0].toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                    <Typography fontWeight={800} sx={{
                                                        fontSize: 14.5, lineHeight: 1.2, color: brand.ink,
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {displayName}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        color: brand.inkMuted, display: 'block',
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {account.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                mt: 1.5, display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                px: 1, py: 0.3, borderRadius: 999,
                                                background: '#fff', color: meta.color,
                                                border: `1px solid ${alpha(meta.color, 0.3)}`,
                                            }}>
                                                <RoleIcon sx={{ fontSize: 13 }} />
                                                <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                    {meta.label}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })()}
                                {account?.role === 'admin' && (
                                    <MenuItem
                                        onClick={() => { navigate('/admin'); setAnchorEl(null); }}
                                        sx={{ color: brand.primary, fontWeight: 700 }}
                                    >
                                        Admin Panel
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => { navigate(dashboardPath); setAnchorEl(null); }}>
                                    My Dashboard
                                </MenuItem>
                                {role === 'patient' && (
                                    <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                                        My Profile
                                    </MenuItem>
                                )}
                                {role === 'patient' && (
                                    <MenuItem onClick={() => { navigate('/pharmacy/orders'); setAnchorEl(null); }}>
                                        My Medicine Orders
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout} sx={{ color: brand.danger, fontWeight: 600 }}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link} to="/hospital/login"
                                sx={{
                                    display: { xs: 'none', md: 'inline-flex' },
                                    color: brand.inkMuted, fontWeight: 600, fontSize: 13,
                                    '&:hover': { color: brand.primary, background: brand.surfaceAlt },
                                }}
                            >
                                For Hospitals
                            </Button>
                            <Button
                                component={Link} to="/login"
                                sx={{
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    color: brand.ink, fontWeight: 600,
                                    '&:hover': { background: brand.surfaceAlt },
                                }}
                            >
                                Sign in
                            </Button>
                            <Button
                                variant="contained"
                                component={Link} to="/register"
                                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                            >
                                Get Started
                            </Button>
                        </>
                    )}

                    <IconButton
                        onClick={() => setDrawer(true)}
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: brand.ink }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>

            <Drawer
                anchor="right"
                open={drawer}
                onClose={() => setDrawer(false)}
                slotProps={{ paper: { sx: { width: 280, p: 2.5, background: '#fff' } } }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Logomark />
                    <IconButton onClick={() => setDrawer(false)}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {links.map(l => (
                        <Box
                            key={l.path}
                            component={Link}
                            to={l.path}
                            onClick={() => setDrawer(false)}
                            sx={{
                                p: 1.4, borderRadius: 2,
                                textDecoration: 'none',
                                color: brand.ink, fontWeight: 600,
                                '&:hover': { background: brand.primarySoft, color: brand.primary },
                            }}
                        >
                            {l.label}
                        </Box>
                    ))}
                </Box>
                {!account && (
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        <Button component={Link} to="/login" onClick={() => setDrawer(false)} variant="outlined" fullWidth>
                            Sign in
                        </Button>
                        <Button component={Link} to="/register" onClick={() => setDrawer(false)} variant="contained" fullWidth>
                            Get Started
                        </Button>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
}

export default Navbar;
