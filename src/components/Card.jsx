import * as React from 'react';
import { Box, Typography, Chip, Button, alpha } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import DoctorAvatar from './DoctorAvatar';
import { brand } from '../theme';

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    if (!doctor) return null;

    const goToProfile = () => navigate(`/docprofile/${doctor._id}`);
    const hasRating = doctor.averageRating > 0;

    return (
        <Box
            onClick={goToProfile}
            sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                background: '#fff',
                border: `1px solid ${brand.border}`,
                boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                display: 'flex', flexDirection: 'column', height: '100%',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 20px 40px ${alpha(brand.primary, 0.18)}`,
                    borderColor: alpha(brand.primary, 0.35),
                },
                '&:hover .doctor-cta': {
                    background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryDark})`,
                    color: '#fff',
                },
                '&:hover .doctor-img': { transform: 'scale(1.06)' },
            }}
        >
            {/* Image */}
            <Box sx={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                <Box className="doctor-img" sx={{
                    width: '100%', height: '100%',
                    transition: 'transform 0.4s ease',
                }}>
                    <DoctorAvatar
                        src={doctor.imageUrl}
                        name={doctor.name}
                        variant="tile"
                        size={190}
                    />
                </Box>
                {/* Availability badge */}
                <Box sx={{
                    position: 'absolute', top: 12, right: 12,
                    background: alpha('#fff', 0.95),
                    backdropFilter: 'blur(8px)',
                    color: brand.success,
                    borderRadius: 999,
                    px: 1.1, py: 0.4,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    fontSize: 11, fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(15,23,42,0.10)',
                }}>
                    <Box sx={{
                        width: 7, height: 7, borderRadius: '50%',
                        bgcolor: brand.success,
                        boxShadow: `0 0 0 3px ${alpha(brand.success, 0.2)}`,
                    }} />
                    Available
                </Box>

                {/* Rating badge (only if rated) */}
                {hasRating && (
                    <Box sx={{
                        position: 'absolute', top: 12, left: 12,
                        background: brand.ink,
                        color: '#fff',
                        borderRadius: 999,
                        px: 1.1, py: 0.4,
                        display: 'flex', alignItems: 'center', gap: 0.4,
                        fontSize: 11.5, fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(15,23,42,0.30)',
                    }}>
                        <StarIcon sx={{ fontSize: 12, color: brand.accent }} />
                        {doctor.averageRating.toFixed(1)}
                    </Box>
                )}

                {/* Gradient overlay */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to top, ${alpha(brand.ink, 0.55)} 0%, transparent 55%)`,
                    pointerEvents: 'none',
                }} />

                {/* Name overlay */}
                <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 10 }}>
                    <Typography fontWeight={800} color="#fff" fontSize={17} noWrap sx={{ letterSpacing: '-0.01em' }}>
                        Dr. {doctor.name}
                    </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Chip
                    label={doctor.speciality}
                    size="small"
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 1.5,
                        fontSize: 11, fontWeight: 700,
                        background: brand.primarySoft,
                        color: brand.primaryDark,
                        borderRadius: 999,
                        height: 24,
                    }}
                />

                <Typography variant="body2" sx={{ color: brand.inkMuted, fontSize: 13, mb: 1.5 }}>
                    {hasRating
                        ? `${doctor.totalRatings} patient review${doctor.totalRatings === 1 ? '' : 's'}`
                        : 'New on Medicare'}
                </Typography>

                <Box sx={{
                    mt: 'auto',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    pt: 1.5, borderTop: `1px dashed ${brand.border}`,
                }}>
                    <Box>
                        <Typography fontSize={11} color={brand.inkFaint} lineHeight={1}>Consultation</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1, mt: 0.4 }}>
                            <CurrencyRupeeIcon sx={{ fontSize: 16, color: brand.ink }} />
                            <Typography fontWeight={800} color={brand.ink} fontSize={18} lineHeight={1}>
                                {doctor.fee}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        className="doctor-cta"
                        size="small"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                        onClick={(e) => { e.stopPropagation(); goToProfile(); }}
                        sx={{
                            borderRadius: 999,
                            borderColor: brand.border,
                            color: brand.ink,
                            fontSize: 12.5,
                            fontWeight: 700,
                            px: 1.6, py: 0.6,
                            transition: 'all 0.25s ease',
                            '&:hover': { borderColor: 'transparent' },
                        }}
                    >
                        Book
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
