// Shared theme constants for the dark analytics design system

export const theme = {
    // Colors
    colors: {
        // Backgrounds
        bgPrimary: 'var(--background)',
        bgSecondary: 'var(--secondary)',
        bgSurface: 'var(--card)', // mapping card to surface
        bgSurfaceLight: 'var(--popover)',
        bgGlass: 'rgba(17, 24, 39, 0.7)', // Keep glass effect static for now or use a variable if available

        // Accent Colors
        cyan: 'var(--primary)',
        cyanLight: 'var(--primary)', // Opacity handling might need CSS color-mix or rgba
        cyanBorder: 'var(--border)',
        blue: '#3b82f6', // Keep as fallback/secondary accent
        purple: '#8b5cf6',

        // Semantic Colors
        success: 'var(--chart-4)', // Using chart colors as semantic proxies or strict values
        successLight: 'rgba(16, 185, 129, 0.2)',
        successBorder: 'rgba(16, 185, 129, 0.3)',
        warning: 'var(--chart-5)',
        warningLight: 'rgba(245, 158, 11, 0.2)',
        warningBorder: 'rgba(245, 158, 11, 0.3)',
        error: 'var(--destructive)',
        errorLight: 'rgba(244, 63, 94, 0.2)',
        errorBorder: 'rgba(244, 63, 94, 0.3)',

        // Text
        textPrimary: 'var(--foreground)',
        textSecondary: 'var(--muted-foreground)',
        textMuted: 'var(--muted-foreground)',

        // Borders
        border: 'var(--border)',
        borderHover: 'var(--ring)',

        // Grid/Chart
        grid: 'var(--border)',
    },

    // Chart color palette
    chartColors: [
        'var(--chart-1)',
        'var(--chart-2)',
        'var(--chart-3)',
        'var(--chart-4)',
        'var(--chart-5)',
        '#f43f5e',
        '#ec4899',
        '#14b8a6'
    ],

    // Common styles
    cardStyle: {
        elevation: 0,
        p: 3,
        height: '100%',
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
            border: '1px solid var(--ring)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }
    },

    // Tooltip style
    tooltipStyle: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)', // Hardcoded dark to ensure visibility in Portals
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        color: '#ffffff'
    },
};

export default theme;
