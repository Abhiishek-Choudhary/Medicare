import { Box, Typography, Divider, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const LOGO_URL = 'https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg';

const FooterLink = ({ to, children }) => (
    <Box
        component={Link}
        to={to}
        sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            color: '#bbb', textDecoration: 'none', fontSize: 14, py: 0.6,
            '&:hover': { color: '#fff' }, transition: '0.2s',
        }}
    >
        <ChevronRightIcon sx={{ fontSize: 16 }} />
        {children}
    </Box>
);

const ContactRow = ({ icon: Icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#bbb', fontSize: 14, py: 0.6 }}>
        <Icon sx={{ fontSize: 18, color: '#90caf9' }} />
        <Typography variant="body2" color="#bbb">{text}</Typography>
    </Box>
);

function Footer() {
    return (
        <Box sx={{ bgcolor: '#1a1a2e', mt: 8 }}>
            <Box sx={{
                maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, py: 7,
                display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
                {/* Brand */}
                <Box sx={{ flex: 2, minWidth: 220 }}>
                    <img src={LOGO_URL} alt="Medicare" width={90} style={{ borderRadius: 8, marginBottom: 12 }} />
                    <Typography variant="body2" color="#999" lineHeight={1.8} maxWidth={280}>
                        Medicare connects patients with trusted healthcare professionals.
                        Book appointments, manage health records, and stay on top of your wellness.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
                            <IconButton key={i} size="small" sx={{ color: '#90caf9', '&:hover': { color: '#fff' } }}>
                                <Icon fontSize="small" />
                            </IconButton>
                        ))}
                    </Box>
                </Box>

                {/* Quick Links */}
                <Box sx={{ flex: 1, minWidth: 140 }}>
                    <Typography fontWeight={700} color="#fff" mb={2} fontSize={15}>Quick Links</Typography>
                    <FooterLink to="/">Home</FooterLink>
                    <FooterLink to="/doctors">Doctors</FooterLink>
                    <FooterLink to="/meetings">Meetings</FooterLink>
                    <FooterLink to="/login">Login</FooterLink>
                    <FooterLink to="/register">Register</FooterLink>
                </Box>

                {/* Services */}
                <Box sx={{ flex: 1, minWidth: 160 }}>
                    <Typography fontWeight={700} color="#fff" mb={2} fontSize={15}>Our Services</Typography>
                    <FooterLink to="/doctors">Cardiology</FooterLink>
                    <FooterLink to="/doctors">Dermatology</FooterLink>
                    <FooterLink to="/doctors">Neurology</FooterLink>
                    <FooterLink to="/doctors">Pediatrics</FooterLink>
                    <FooterLink to="/doctors">Psychiatry</FooterLink>
                </Box>

                {/* Contact */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography fontWeight={700} color="#fff" mb={2} fontSize={15}>Contact Us</Typography>
                    <ContactRow icon={PhoneIcon} text="+91 78945 76321" />
                    <ContactRow icon={PhoneIcon} text="+91 89767 88643" />
                    <ContactRow icon={EmailIcon} text="support@medicare.health" />
                    <ContactRow icon={LocationOnIcon} text="Mumbai, Maharashtra, India" />
                </Box>
            </Box>

            <Divider sx={{ borderColor: '#333' }} />

            <Box sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography variant="body2" color="#666">
                    © {new Date().getFullYear()} Medicare. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default Footer;
