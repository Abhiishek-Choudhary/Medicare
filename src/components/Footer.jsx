import { Box, Typography, IconButton, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { brand } from '../theme';

const FooterLink = ({ to, children }) => (
    <Box
        component={Link}
        to={to}
        sx={{
            color: alpha('#fff', 0.66),
            textDecoration: 'none',
            fontSize: 14,
            py: 0.7,
            display: 'block',
            transition: 'color 0.2s, transform 0.2s',
            '&:hover': { color: '#fff', transform: 'translateX(3px)' },
        }}
    >
        {children}
    </Box>
);

const ContactRow = ({ icon: Icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, py: 0.7 }}>
        <Box sx={{
            width: 30, height: 30, borderRadius: 1.5,
            display: 'grid', placeItems: 'center',
            background: alpha(brand.primary, 0.16),
            color: brand.primaryLight,
        }}>
            <Icon sx={{ fontSize: 15 }} />
        </Box>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.75), fontSize: 13.5 }}>{text}</Typography>
    </Box>
);

function BrandMark() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
            <Box sx={{
                width: 42, height: 42, borderRadius: 2.2,
                background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                display: 'grid', placeItems: 'center',
                boxShadow: `0 6px 22px ${alpha(brand.primary, 0.5)}`,
            }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                    <path d="M14 3H10V10H3V14H10V21H14V14H21V10H14V3Z" fill="white" />
                </svg>
            </Box>
            <Box sx={{ lineHeight: 1 }}>
                <Typography fontWeight={800} fontSize={20} color="#fff" letterSpacing="-0.02em">Medicare</Typography>
                <Typography fontSize={10} fontWeight={700} letterSpacing="0.2em" sx={{ color: brand.primaryLight }}>
                    HEALTHCARE
                </Typography>
            </Box>
        </Box>
    );
}

function Footer() {
    return (
        <Box
            sx={{
                mt: 10,
                position: 'relative',
                background: `radial-gradient(circle at 15% 0%, ${alpha(brand.primary, 0.18)} 0%, transparent 45%),
                             radial-gradient(circle at 90% 100%, ${alpha(brand.accent, 0.10)} 0%, transparent 40%),
                             #0B1220`,
                color: '#fff',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, pt: 8, pb: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr 1fr 1.2fr' }, gap: { xs: 4, md: 6 } }}>
                    <Box>
                        <BrandMark />
                        <Typography sx={{ color: alpha('#fff', 0.66), lineHeight: 1.75, fontSize: 14, maxWidth: 320 }}>
                            Medicare connects patients with verified healthcare professionals — book, consult, and manage your health from one place.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 2.5 }}>
                            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
                                <IconButton
                                    key={i}
                                    size="small"
                                    sx={{
                                        color: alpha('#fff', 0.7),
                                        border: `1px solid ${alpha('#fff', 0.12)}`,
                                        '&:hover': {
                                            color: '#fff',
                                            borderColor: brand.primary,
                                            background: alpha(brand.primary, 0.15),
                                        },
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <Typography fontWeight={700} color="#fff" mb={1.5} fontSize={14} letterSpacing="0.05em"
                            sx={{ textTransform: 'uppercase' }}>
                            Explore
                        </Typography>
                        <FooterLink to="/">Home</FooterLink>
                        <FooterLink to="/doctors">Doctors</FooterLink>
                        <FooterLink to="/meetings">Meetings</FooterLink>
                        <FooterLink to="/login">Sign in</FooterLink>
                        <FooterLink to="/register">Register</FooterLink>
                    </Box>

                    <Box>
                        <Typography fontWeight={700} color="#fff" mb={1.5} fontSize={14} letterSpacing="0.05em"
                            sx={{ textTransform: 'uppercase' }}>
                            Services
                        </Typography>
                        <FooterLink to="/doctors">Cardiology</FooterLink>
                        <FooterLink to="/doctors">Dermatology</FooterLink>
                        <FooterLink to="/doctors">Neurology</FooterLink>
                        <FooterLink to="/doctors">Pediatrics</FooterLink>
                        <FooterLink to="/doctors">Psychiatry</FooterLink>
                    </Box>

                    <Box>
                        <Typography fontWeight={700} color="#fff" mb={1.5} fontSize={14} letterSpacing="0.05em"
                            sx={{ textTransform: 'uppercase' }}>
                            Get in touch
                        </Typography>
                        <ContactRow icon={PhoneIcon} text="+91 78945 76321" />
                        <ContactRow icon={EmailIcon} text="support@medicare.health" />
                        <ContactRow icon={LocationOnIcon} text="Mumbai, Maharashtra, India" />
                    </Box>
                </Box>

                <Box sx={{
                    mt: 6, pt: 3,
                    borderTop: `1px solid ${alpha('#fff', 0.08)}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
                }}>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), fontSize: 13 }}>
                        © {new Date().getFullYear()} Medicare. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), fontSize: 13 }}>
                        Crafted with care for better healthcare.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;
