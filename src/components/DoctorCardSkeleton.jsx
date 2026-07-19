import { Box, Skeleton } from '@mui/material';
import { brand } from '../theme';

export default function DoctorCardSkeleton() {
    return (
        <Box
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${brand.border}`,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
        >
            <Skeleton variant="rectangular" height={180} animation="wave" sx={{ bgcolor: brand.surfaceAlt }} />
            <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" width={90} height={20} animation="wave" sx={{ mb: 1.2, bgcolor: brand.surfaceAlt }} />
                <Skeleton variant="text" width="75%" height={22} animation="wave" sx={{ bgcolor: brand.surfaceAlt }} />
                <Skeleton variant="text" width="50%" height={18} animation="wave" sx={{ bgcolor: brand.surfaceAlt }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                    <Skeleton variant="text" width={60} height={22} animation="wave" sx={{ bgcolor: brand.surfaceAlt }} />
                    <Skeleton variant="rounded" width={80} height={30} animation="wave" sx={{ bgcolor: brand.surfaceAlt }} />
                </Box>
            </Box>
        </Box>
    );
}
