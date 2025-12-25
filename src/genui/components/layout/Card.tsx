import React from 'react';
import { Card as MuiCard, CardContent } from '@mui/material';
import { theme } from '../../styles/theme';

interface CardProps {
    children?: React.ReactNode;
}

export const CardComponent: React.FC<CardProps> = ({ children }) => (
    <MuiCard
        elevation={0}
        sx={{
            ...theme.cardStyle
        }}
    >
        <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </MuiCard>
);

export default CardComponent;
