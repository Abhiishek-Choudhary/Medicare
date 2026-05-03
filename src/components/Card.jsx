import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMG = 'https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg';

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    if (!doctor) return null;

    const goToProfile = () => navigate(`/docprofile/${doctor._id}`);

    return (
        <Card
            onClick={goToProfile}
            sx={{
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 28px rgba(25,118,210,0.15)' },
                display: 'flex', flexDirection: 'column',
            }}
        >
            {/* Image with availability badge */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="190"
                    image={doctor.imageUrl || FALLBACK_IMG}
                    alt={doctor.name}
                    sx={{ objectFit: 'cover' }}
                />
                <Chip
                    label="Available"
                    size="small"
                    sx={{
                        position: 'absolute', top: 10, right: 10,
                        bgcolor: '#2e7d32', color: '#fff', fontWeight: 600, fontSize: 11,
                        '& .MuiChip-label': { px: 1 },
                    }}
                />
                <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                    px: 1.5, pb: 1, pt: 3,
                }}>
                    <Typography fontWeight={700} color="#fff" fontSize={15} noWrap>
                        Dr. {doctor.name}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ pt: 1.5, pb: 1, flexGrow: 1 }}>
                <Chip
                    label={doctor.speciality}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1.5, fontSize: 11 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 15, color: '#1976d2' }} />
                        <Typography fontWeight={700} color="#1976d2" fontSize={15}>
                            {doctor.fee}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" ml={0.3}>/ visit</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <StarIcon sx={{ fontSize: 15, color: '#f59e0b' }} />
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {doctor.averageRating > 0
                                ? `${doctor.averageRating.toFixed(1)} (${doctor.totalRatings})`
                                : 'New'}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={(e) => { e.stopPropagation(); goToProfile(); }}
                    sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', fontSize: 13 }}
                >
                    Book Appointment
                </Button>
            </CardActions>
        </Card>
    );
}
