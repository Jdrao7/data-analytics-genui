import React from 'react';
import { Box, Stack, Divider, Card as MuiCard, CardContent, Grid } from '@mui/material';
import { ComponentRegistry } from './types';
import { UIComponentSchemaType } from '@/genui/schema';

export const layoutComponents: ComponentRegistry = {
    Page: (props, { renderChildren }) => (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: '100%',
            background: '#0a0f1c',
            borderRadius: { xs: 0, sm: 2, md: 3 },
            overflow: 'hidden'
        }}>
            <Stack spacing={props.spacing ?? { xs: 2, sm: 2.5, md: 3 }}>
                {renderChildren()}
            </Stack>
        </Box>
    ),

    Stack: (props, { renderChildren }) => (
        <Stack
            spacing={props.spacing ?? 2}
            direction={{ xs: 'column', sm: props.direction ?? 'column' }}
            sx={{ width: '100%' }}
        >
            {renderChildren()}
        </Stack>
    ),

    Grid: (props, { renderNode }, node) => {
        if (!node) return null;
        const childCount = node.children?.length ?? 0;

        return (
            <Grid container spacing={{ xs: 1.5, sm: 2, md: props.spacing ?? 2 }} sx={{ flexWrap: 'wrap' }}>
                {node.children?.map((c: UIComponentSchemaType, i: number) => {
                    // Responsive grid sizing - always full width on mobile (xs)
                    const childSize = c.props?.size ?? c.props?.xs ?? props.xs ?? {
                        xs: 12,
                        sm: childCount <= 2 ? 6 : 6,
                        md: childCount <= 3 ? Math.floor(12 / childCount) : 4,
                        lg: childCount <= 4 ? Math.floor(12 / childCount) : 3
                    };
                    return (
                        <Grid size={childSize} key={i}>
                            {renderNode(c)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    },

    Card: (props, { renderChildren }) => (
        <MuiCard
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: { xs: 2, sm: 2.5, md: 3 },
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                '&:hover': {
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)'
                }
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } } }}>
                {renderChildren()}
            </CardContent>
        </MuiCard>
    ),

    Divider: () => <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />,
};
