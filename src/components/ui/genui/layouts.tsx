import React from 'react';
import { Box, Stack, Divider, Card as MuiCard, CardContent, Grid } from '@mui/material';
import { ComponentRegistry, RenderContext } from './types';
import { UIComponentSchemaType } from '@/genui/schema';

export const layoutComponents: ComponentRegistry = {
    Page: (props, { renderChildren }) => (
        <Box sx={{
            p: 4,
            minHeight: '100%',
            background: '#0a0f1c',
            borderRadius: 3
        }}>
            <Stack spacing={props.spacing ?? 3}>
                {renderChildren()}
            </Stack>
        </Box>
    ),

    Stack: (props, { renderChildren }) => (
        <Stack spacing={props.spacing ?? 2} direction={props.direction ?? "column"}>
            {renderChildren()}
        </Stack>
    ),

    Grid: (props, { renderNode }, node: UIComponentSchemaType) => (
        <Grid container spacing={props.spacing ?? 2} sx={{ flexWrap: 'wrap' }}>
            {node.children?.map((c: UIComponentSchemaType, i: number) => {
                const childSize = c.props?.size ?? c.props?.xs ?? props.xs ??
                    (node.children!.length <= 3 ? { xs: 12, sm: 6, md: 12 / Math.min(node.children!.length, 4) } : { xs: 12, sm: 6, md: 4 });
                return (
                    <Grid size={childSize} key={i}>
                        {renderNode(c)}
                    </Grid>
                );
            })}
        </Grid>
    ),

    Card: (props, { renderChildren }) => (
        <MuiCard
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>{renderChildren()}</CardContent>
        </MuiCard>
    ),

    Divider: () => <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />,
};
