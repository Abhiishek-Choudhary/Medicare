import { createTheme, alpha } from '@mui/material/styles';

export const brand = {
    primary: '#0EA5A4',
    primaryDark: '#0B8886',
    primaryLight: '#5EEAD4',
    primarySoft: '#ECFDF9',
    accent: '#F59E0B',
    accentSoft: '#FEF3C7',
    success: '#10B981',
    danger: '#EF4444',
    ink: '#0F172A',
    inkMuted: '#475569',
    inkFaint: '#94A3B8',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    surfaceAlt: '#F1F5F9',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
};

const theme = createTheme({
    palette: {
        primary: {
            main: brand.primary,
            dark: brand.primaryDark,
            light: brand.primaryLight,
            contrastText: '#fff',
        },
        secondary: {
            main: brand.accent,
            contrastText: '#fff',
        },
        success: { main: brand.success },
        error: { main: brand.danger },
        background: {
            default: brand.surfaceMuted,
            paper: brand.surface,
        },
        text: {
            primary: brand.ink,
            secondary: brand.inkMuted,
            disabled: brand.inkFaint,
        },
        divider: brand.border,
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
        h1: { fontWeight: 800, letterSpacing: '-0.03em' },
        h2: { fontWeight: 800, letterSpacing: '-0.025em' },
        h3: { fontWeight: 800, letterSpacing: '-0.02em' },
        h4: { fontWeight: 800, letterSpacing: '-0.015em' },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
        h6: { fontWeight: 700 },
        button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
        body1: { lineHeight: 1.65 },
        body2: { lineHeight: 1.6 },
    },
    shadows: [
        'none',
        '0 1px 2px rgba(15,23,42,0.04)',
        '0 2px 8px rgba(15,23,42,0.06)',
        '0 4px 14px rgba(15,23,42,0.08)',
        '0 6px 20px rgba(15,23,42,0.08)',
        '0 8px 24px rgba(14,165,164,0.10)',
        '0 10px 30px rgba(14,165,164,0.12)',
        '0 12px 36px rgba(14,165,164,0.14)',
        '0 14px 40px rgba(15,23,42,0.10)',
        '0 16px 44px rgba(15,23,42,0.12)',
        '0 18px 48px rgba(15,23,42,0.14)',
        '0 20px 52px rgba(15,23,42,0.16)',
        '0 22px 56px rgba(15,23,42,0.18)',
        '0 24px 60px rgba(15,23,42,0.20)',
        '0 26px 64px rgba(15,23,42,0.22)',
        '0 28px 68px rgba(15,23,42,0.24)',
        '0 30px 72px rgba(15,23,42,0.26)',
        '0 32px 76px rgba(15,23,42,0.28)',
        '0 34px 80px rgba(15,23,42,0.30)',
        '0 36px 84px rgba(15,23,42,0.32)',
        '0 38px 88px rgba(15,23,42,0.34)',
        '0 40px 92px rgba(15,23,42,0.36)',
        '0 42px 96px rgba(15,23,42,0.38)',
        '0 44px 100px rgba(15,23,42,0.40)',
        '0 46px 104px rgba(15,23,42,0.42)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: brand.surfaceMuted,
                    color: brand.ink,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
                '::selection': {
                    background: alpha(brand.primary, 0.25),
                },
                '*::-webkit-scrollbar': { width: 10, height: 10 },
                '*::-webkit-scrollbar-track': { background: 'transparent' },
                '*::-webkit-scrollbar-thumb': {
                    background: brand.border,
                    borderRadius: 8,
                },
                '*::-webkit-scrollbar-thumb:hover': { background: brand.borderStrong },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 18,
                    paddingRight: 18,
                    transition: 'transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                },
                sizeLarge: {
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 26,
                    paddingRight: 26,
                    fontSize: 15,
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
                    boxShadow: `0 6px 18px ${alpha(brand.primary, 0.28)}`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${brand.primaryDark} 0%, ${brand.primary} 100%)`,
                        boxShadow: `0 10px 24px ${alpha(brand.primary, 0.38)}`,
                        transform: 'translateY(-1px)',
                    },
                },
                outlinedPrimary: {
                    borderWidth: 1.5,
                    '&:hover': { borderWidth: 1.5, background: brand.primarySoft },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, borderRadius: 999 },
                outlined: { borderWidth: 1.5 },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: { borderRadius: 16 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: `1px solid ${brand.border}`,
                    boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    background: '#fff',
                    '& fieldset': { borderColor: brand.border },
                    '&:hover fieldset': { borderColor: brand.borderStrong },
                    '&.Mui-focused fieldset': {
                        borderColor: brand.primary,
                        borderWidth: 1.5,
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 20 },
            },
        },
        MuiAppBar: {
            defaultProps: { color: 'transparent', elevation: 0 },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    background: brand.ink,
                    borderRadius: 8,
                    fontSize: 12,
                    padding: '6px 10px',
                },
            },
        },
    },
});

export default theme;
