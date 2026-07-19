import { useState, useMemo } from 'react';
import { Box, alpha } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { brand } from '../theme';

const isBlankPath = (u) => !u || (typeof u === 'string' && u.trim() === '');

// Deterministic hue per name so different doctors get subtly different fallback tiles
const hueFor = (name) => {
    if (!name) return 0;
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return h % 360;
};

/**
 * <DoctorAvatar
 *    src={doctor.imageUrl}
 *    name={doctor.name}
 *    variant="tile" | "square" | "circle"
 *    size={190}            // circle/square in px OR height for tile
 *    aspectRatio="16/10"   // for tile only
 *    sx={{}}
 * />
 */
function DoctorAvatar({ src, name = 'Doctor', variant = 'tile', size, aspectRatio, sx = {} }) {
    const [errored, setErrored] = useState(false);

    const useImage = !isBlankPath(src) && !errored;

    const initials = useMemo(() => {
        const parts = String(name).trim().split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || 'D';
        const second = parts[1]?.[0] || '';
        return (first + second).toUpperCase();
    }, [name]);

    const hue = hueFor(name);
    const gradient = `linear-gradient(135deg, hsl(${hue}, 60%, 55%) 0%, hsl(${(hue + 30) % 360}, 55%, 40%) 100%)`;

    // Size resolution
    const isTile = variant === 'tile';
    const containerSx = isTile
        ? {
            width: '100%',
            height: size ?? 190,
            ...(aspectRatio ? { aspectRatio, height: 'auto' } : null),
        }
        : {
            width: size ?? 96,
            height: size ?? 96,
            borderRadius: variant === 'circle' ? '50%' : 2,
        };

    if (useImage) {
        return (
            <Box
                component="img"
                src={src}
                alt={name}
                onError={() => setErrored(true)}
                sx={{
                    display: 'block',
                    objectFit: 'cover',
                    ...containerSx,
                    ...sx,
                }}
            />
        );
    }

    // Fallback tile — gradient with initials
    return (
        <Box
            aria-label={`${name} avatar`}
            sx={{
                position: 'relative',
                display: 'grid',
                placeItems: 'center',
                background: gradient,
                color: '#fff',
                overflow: 'hidden',
                ...containerSx,
                ...sx,
            }}
        >
            {/* Decorative watermark icon */}
            <MedicalServicesIcon
                sx={{
                    position: 'absolute',
                    right: -12, bottom: -18,
                    fontSize: isTile ? 150 : Math.max(48, (size ?? 96) * 0.9),
                    color: alpha('#fff', 0.14),
                    transform: 'rotate(-10deg)',
                }}
            />
            {/* Soft light spot */}
            <Box aria-hidden sx={{
                position: 'absolute',
                width: '160%', height: '160%',
                top: '-70%', left: '-40%',
                background: `radial-gradient(circle at center, ${alpha('#fff', 0.15)} 0%, transparent 55%)`,
                pointerEvents: 'none',
            }} />
            {/* Initials */}
            <Box sx={{
                position: 'relative',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: isTile ? Math.min(64, (size ?? 190) * 0.35) : Math.max(18, (size ?? 96) * 0.4),
                textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                lineHeight: 1,
                fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
            }}>
                {initials}
            </Box>
        </Box>
    );
}

export default DoctorAvatar;
