import React from 'react';
import { Box, Stack } from '@mui/material';
import { theme } from '../../styles/theme';

interface PageProps {
    spacing?: number;
    children?: React.ReactNode;
}

export const PageComponent: React.FC<PageProps> = ({ spacing, children }) => (
    <Box sx={{
        p: 4,
        minHeight: '100%',
        background: `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.bgSecondary} 100%)`,
        borderRadius: 3
    }}>
        <Stack spacing={spacing ?? 3}>
            {children}
        </Stack>
    </Box>
);

export default PageComponent;
