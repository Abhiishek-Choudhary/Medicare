import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, FormControl, FormControlLabel,
    RadioGroup, Radio, Grid, Alert, Avatar, AvatarGroup, alpha
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Link } from 'react-router-dom';
import { userDetails } from '../services/api';
import { brand } from '../theme';

const HERO_IMG = 'https://img.freepik.com/premium-photo/four-people-wearing-lab-coats-are-posing-photo_198067-951158.jpg?w=740';

const STATS = [
    { icon: GroupsIcon, value: '500+', label: 'Verified doctors' },
    { icon: CalendarMonthIcon, value: '10k+', label: 'Appointments booked' },
    { icon: VerifiedIcon, value: '98%', label: 'Patient satisfaction' },
    { icon: SupportAgentIcon, value: '24/7', label: 'Care support' },
];

const AVATARS = [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/85.jpg',
];

const initialForm = { firstname: '', lastname: '', age: '', gender: '', issues: '', radio: '', precription: '' };

function Hero() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const onValueChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        const response = await userDetails(form);
        setLoading(false);
        if (response) {
            setSubmitted(true);
            setTimeout(() => { setOpen(false); setSubmitted(false); setForm(initialForm); }, 2000);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    px: { xs: 3, md: 8 },
                    pt: { xs: 5, md: 8 },
                    pb: { xs: 8, md: 12 },
                    background: `
                        radial-gradient(circle at 12% 20%, ${alpha(brand.primary, 0.14)} 0%, transparent 45%),
                        radial-gradient(circle at 88% 90%, ${alpha(brand.accent, 0.09)} 0%, transparent 40%),
                        linear-gradient(180deg, ${brand.surfaceMuted} 0%, #ffffff 100%)
                    `,
                }}
            >
                {/* Dot pattern */}
                <Box
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.35,
                        backgroundImage: `radial-gradient(${alpha(brand.primary, 0.18)} 1px, transparent 1px)`,
                        backgroundSize: '22px 22px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
                        pointerEvents: 'none',
                    }}
                />

                <Box sx={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
                    alignItems: 'center',
                    gap: { xs: 6, md: 8 },
                    maxWidth: 1240,
                    mx: 'auto',
                }}>
                    {/* Text Side */}
                    <Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: '#fff',
                                border: `1px solid ${brand.border}`,
                                boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
                                color: brand.primary,
                                px: 1.6, py: 0.7,
                                borderRadius: 999,
                                fontSize: 13, fontWeight: 600,
                                mb: 3,
                            }}
                        >
                            <Box sx={{
                                width: 8, height: 8, borderRadius: '50%',
                                bgcolor: brand.success,
                                boxShadow: `0 0 0 4px ${alpha(brand.success, 0.15)}`,
                            }} />
                            Trusted by 10,000+ patients across India
                        </Box>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3.4rem' },
                                fontWeight: 800,
                                lineHeight: 1.08,
                                letterSpacing: '-0.03em',
                                mb: 2.5,
                                color: brand.ink,
                            }}
                        >
                            Book expert{' '}
                            <Box component="span" sx={{
                                position: 'relative', display: 'inline-block',
                                background: `linear-gradient(120deg, ${brand.primary}, ${brand.primaryDark})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                healthcare
                                <Box component="svg"
                                    viewBox="0 0 200 12" preserveAspectRatio="none"
                                    sx={{
                                        position: 'absolute', left: 0, right: 0, bottom: -6,
                                        width: '100%', height: 10, color: brand.primaryLight, opacity: 0.7,
                                    }}
                                >
                                    <path d="M2 8 C 50 2, 150 2, 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                                </Box>
                            </Box>
                            <br />
                            in under a minute.
                        </Typography>

                        <Typography sx={{
                            color: brand.inkMuted,
                            fontSize: { xs: 15, md: 17 },
                            lineHeight: 1.7,
                            mb: 4,
                            maxWidth: 520,
                        }}>
                            Connect with verified doctors, book appointments instantly, and
                            manage your health records — all from one calm, secure place.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/doctors"
                                endIcon={<ArrowForwardIcon />}
                            >
                                Find a Doctor
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<PlayCircleOutlineIcon />}
                                onClick={() => setOpen(true)}
                                sx={{
                                    borderColor: brand.border,
                                    color: brand.ink,
                                    '&:hover': { borderColor: brand.primary, background: brand.primarySoft },
                                }}
                            >
                                Quick Intake
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AvatarGroup
                                max={4}
                                sx={{
                                    '& .MuiAvatar-root': { width: 36, height: 36, border: `2px solid #fff` },
                                }}
                            >
                                {AVATARS.map((src, i) => <Avatar key={i} src={src} />)}
                            </AvatarGroup>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} sx={{ fontSize: 14, color: brand.accent }} />
                                    ))}
                                    <Typography fontWeight={700} fontSize={13.5} color={brand.ink} ml={0.5}>
                                        4.9
                                    </Typography>
                                </Box>
                                <Typography fontSize={12.5} color={brand.inkMuted}>
                                    from 2,300+ patient reviews
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Image Side with floating cards */}
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: { xs: 380, md: 460 },
                    }}>
                        {/* Blob backdrop */}
                        <Box aria-hidden sx={{
                            position: 'absolute',
                            inset: '-4% -8% -4% -8%',
                            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                            opacity: 0.9,
                            borderRadius: '38% 62% 55% 45% / 45% 42% 58% 55%',
                            filter: 'blur(2px)',
                            transform: 'rotate(-3deg)',
                            zIndex: 0,
                        }} />

                        {/* Image frame */}
                        <Box sx={{
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            maxWidth: 460,
                            borderRadius: 5,
                            overflow: 'hidden',
                            boxShadow: '0 30px 80px rgba(15,23,42,0.25)',
                            border: '6px solid #fff',
                        }}>
                            <Box
                                component="img"
                                src={HERO_IMG}
                                alt="Verified doctors ready to help"
                                sx={{ width: '100%', display: 'block', objectFit: 'cover', height: { xs: 320, md: 460 } }}
                            />
                        </Box>

                        {/* Floating card — rating */}
                        <Box sx={{
                            position: 'absolute',
                            top: { xs: 16, md: 40 },
                            left: { xs: 0, md: -10 },
                            background: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(15,23,42,0.15)',
                            border: `1px solid ${brand.border}`,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                            zIndex: 2,
                            animation: 'float 6s ease-in-out infinite',
                            '@keyframes float': {
                                '0%,100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-6px)' },
                            },
                        }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: 2,
                                display: 'grid', placeItems: 'center',
                                background: alpha(brand.accent, 0.15),
                                color: brand.accent,
                            }}>
                                <StarIcon />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={16} lineHeight={1.1} color={brand.ink}>4.9 / 5</Typography>
                                <Typography fontSize={11.5} color={brand.inkMuted}>Doctor rating</Typography>
                            </Box>
                        </Box>

                        {/* Floating card — verified */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: { xs: 16, md: 44 },
                            right: { xs: 0, md: -18 },
                            background: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(15,23,42,0.15)',
                            border: `1px solid ${brand.border}`,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                            zIndex: 2,
                            animation: 'float2 7s ease-in-out infinite',
                            '@keyframes float2': {
                                '0%,100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-8px)' },
                            },
                        }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: 2,
                                display: 'grid', placeItems: 'center',
                                background: alpha(brand.success, 0.15),
                                color: brand.success,
                            }}>
                                <ShieldOutlinedIcon />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={13.5} lineHeight={1.15} color={brand.ink}>Verified & Secure</Typography>
                                <Typography fontSize={11.5} color={brand.inkMuted}>HIPAA-grade privacy</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Stats Bar — glass card */}
            <Box sx={{ position: 'relative', px: { xs: 2, md: 4 }, mt: { xs: -4, md: -6 } }}>
                <Box sx={{
                    maxWidth: 1180, mx: 'auto',
                    background: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
                    border: `1px solid ${brand.border}`,
                    px: { xs: 2.5, md: 4 }, py: 2.5,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 2,
                }}>
                    {STATS.map(({ icon: Icon, value, label }, i) => (
                        <Box
                            key={label}
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1.5,
                                borderLeft: { sm: i > 0 ? `1px solid ${brand.border}` : 'none' },
                                pl: { sm: i > 0 ? 3 : 0 },
                            }}
                        >
                            <Box sx={{
                                width: 40, height: 40, borderRadius: 2,
                                background: alpha(brand.primary, 0.10),
                                color: brand.primaryDark,
                                display: 'grid', placeItems: 'center',
                            }}>
                                <Icon sx={{ fontSize: 22 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={20} lineHeight={1} color={brand.ink}>
                                    {value}
                                </Typography>
                                <Typography fontSize={12.5} color={brand.inkMuted}>{label}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Patient Form Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, fontSize: 20, pb: 0, letterSpacing: '-0.01em' }}>
                    Patient Health Intake
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {submitted ? (
                        <Alert severity="success" sx={{ my: 2, borderRadius: 2 }}>
                            Details saved successfully! We'll be in touch soon.
                        </Alert>
                    ) : (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={6}>
                                <TextField fullWidth label="First Name" name="firstname" onChange={onValueChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Last Name" name="lastname" onChange={onValueChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Age" name="age" type="number" onChange={onValueChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Gender" name="gender" onChange={onValueChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Medical Issues" name="issues" multiline rows={2} onChange={onValueChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" fontWeight={600} mb={0.5}>
                                    Have you consulted a doctor before?
                                </Typography>
                                <FormControl>
                                    <RadioGroup row name="radio" onChange={onValueChange}>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" name="radio" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" name="radio" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Current Prescription / Medicines"
                                    name="precription" multiline rows={2} onChange={onValueChange}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                {!submitted && (
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
}

export default Hero;
