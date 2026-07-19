import { useContext, useState } from 'react';
import {
    Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    IconButton, AppBar, Toolbar, Avatar, Menu, MenuItem, Divider, alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import DescriptionIcon from '@mui/icons-material/Description';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';
import { CartContext } from '../../context/CartProvider';
import { brand } from '../../theme';

const NAV = [
    { label: 'Dashboard',       path: '/admin',                  icon: <DashboardIcon /> },
    { label: 'Customers',       path: '/admin/customers',        icon: <PeopleIcon /> },
    { label: 'Doctors',         path: '/admin/doctors',          icon: <MedicalServicesIcon /> },
    { label: 'Appointments',    path: '/admin/appointments',     icon: <EventNoteIcon /> },
    { label: 'Orders',          path: '/admin/orders',           icon: <ReceiptLongIcon /> },
    { label: 'Medicines',       path: '/admin/medicines',        icon: <LocalPharmacyIcon /> },
    { label: 'Prescriptions',   path: '/admin/prescriptions',    icon: <DescriptionIcon /> },
    { label: 'Blood Donors',    path: '/admin/blood/donors',     icon: <BloodtypeIcon /> },
    { label: 'Blood Hospitals', path: '/admin/blood/hospitals',  icon: <LocalHospitalIcon /> },
];

const DRAWER_WIDTH = 240;

function SidebarContent({ onNavigate }) {
    const location = useLocation();
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1, py: 2 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                    display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800,
                }}>M</Box>
                <Box>
                    <Typography fontWeight={800} lineHeight={1}>Medicare</Typography>
                    <Typography variant="caption" color={brand.inkFaint}>Admin Panel</Typography>
                </Box>
            </Box>

            <List sx={{ mt: 1 }}>
                {NAV.map((n) => {
                    const active = location.pathname === n.path
                        || (n.path !== '/admin' && location.pathname.startsWith(n.path));
                    return (
                        <ListItem key={n.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                to={n.path}
                                onClick={onNavigate}
                                selected={active}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        background: alpha(brand.primary, 0.12),
                                        color: brand.primary,
                                        '& .MuiListItemIcon-root': { color: brand.primary },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>{n.icon}</ListItemIcon>
                                <ListItemText primary={n.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ my: 2 }} />

            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/" onClick={onNavigate} sx={{ borderRadius: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Back to site" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}

function AdminLayout({ title, children }) {
    const { account, setAccount } = useContext(DataContext);
    const { clearLocal } = useContext(CartContext);
    const navigate = useNavigate();
    const [drawer, setDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        setAccount(null, null);
        clearLocal();
        setAnchorEl(null);
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: brand.surfaceMuted }}>
            {/* Permanent desktop sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH, borderRight: `1px solid ${brand.border}`,
                        background: '#fff', boxSizing: 'border-box',
                    },
                }}
                open
            >
                <SidebarContent />
            </Drawer>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={drawer}
                onClose={() => setDrawer(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                }}
            >
                <SidebarContent onNavigate={() => setDrawer(false)} />
            </Drawer>

            {/* Main area */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <AppBar
                    position="sticky"
                    sx={{
                        background: '#fff', color: brand.ink,
                        borderBottom: `1px solid ${brand.border}`,
                        boxShadow: 'none',
                    }}
                >
                    <Toolbar sx={{ gap: 2 }}>
                        <IconButton
                            edge="start"
                            onClick={() => setDrawer(true)}
                            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: brand.ink }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight={800} sx={{ flex: 1 }}>{title}</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                                    {account?.name || account?.username}
                                </Typography>
                                <Typography variant="caption" color={brand.inkFaint}>Administrator</Typography>
                            </Box>
                            <Avatar
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                sx={{
                                    width: 36, height: 36, cursor: 'pointer',
                                    background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                                    fontWeight: 800,
                                }}
                            >
                                {(account?.name || account?.username || 'A')[0].toUpperCase()}
                            </Avatar>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={handleLogout} sx={{ color: brand.danger }}>
                                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default AdminLayout;
