import { Box, Card, CardContent, Typography, Button, Chip, alpha } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom';
import { brand } from '../../theme';

function MedicineCard({ medicine, onAdd, adding }) {
    const discount = medicine.mrp > medicine.price
        ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)
        : 0;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 30px ${alpha(brand.primary, 0.15)}`,
                    borderColor: brand.primary,
                },
            }}
        >
            <Box
                component={Link}
                to={`/pharmacy/medicine/${medicine._id}`}
                sx={{
                    height: 160,
                    display: 'grid', placeItems: 'center',
                    background: `linear-gradient(135deg, ${brand.primarySoft} 0%, #fff 100%)`,
                    borderBottom: `1px solid ${brand.border}`,
                    textDecoration: 'none',
                }}
            >
                {medicine.images?.[0] ? (
                    <img
                        src={medicine.images[0]}
                        alt={medicine.name}
                        style={{ maxHeight: 140, maxWidth: '80%', objectFit: 'contain' }}
                    />
                ) : (
                    <LocalPharmacyIcon sx={{ fontSize: 64, color: brand.primary, opacity: 0.5 }} />
                )}
            </Box>

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.2 }}>
                <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 0.8 }}>
                    {medicine.prescriptionRequired && (
                        <Chip label="Rx" size="small"
                            sx={{ height: 20, fontSize: 10, background: brand.accentSoft, color: brand.accent }} />
                    )}
                    {discount > 0 && (
                        <Chip label={`${discount}% OFF`} size="small"
                            sx={{ height: 20, fontSize: 10, background: alpha(brand.success, 0.15), color: brand.success }} />
                    )}
                </Box>

                <Typography
                    component={Link}
                    to={`/pharmacy/medicine/${medicine._id}`}
                    fontWeight={700}
                    fontSize={15}
                    sx={{
                        color: brand.ink,
                        textDecoration: 'none',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 0.4,
                        '&:hover': { color: brand.primary },
                    }}
                >
                    {medicine.name}
                </Typography>

                <Typography variant="caption" color={brand.inkFaint} sx={{ mb: 0.8 }}>
                    {medicine.brand} · {medicine.packSize}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography fontWeight={800} fontSize={17} color={brand.ink}>
                        ₹{medicine.price}
                    </Typography>
                    {discount > 0 && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: brand.inkFaint }}>
                            ₹{medicine.mrp}
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    disabled={adding || medicine.stock < 1}
                    onClick={() => onAdd?.(medicine)}
                    sx={{ mt: 1.4, borderRadius: 2 }}
                    fullWidth
                >
                    {medicine.stock < 1 ? 'Out of stock' : adding ? 'Adding...' : 'Add to Cart'}
                </Button>
            </CardContent>
        </Card>
    );
}

export default MedicineCard;
