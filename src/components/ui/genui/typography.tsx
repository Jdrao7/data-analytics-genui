import React from 'react';
import { Typography, Box } from '@mui/material';
import { ComponentRegistry } from './types';

export const typographyComponents: ComponentRegistry = {
    Header: (props) => (
        <Typography
            variant="h4"
            sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}
        >
            {props.text}
        </Typography>
    ),

    Text: (props) => (
        <Typography variant="body1" sx={{ color: 'rgba(148, 163, 184, 0.9)' }}>
            {props.content}
        </Typography>
    ),

    Image: (props) => (
        <Box
            component="img"
            src={props.src}
            alt={props.alt ?? ""}
            sx={{ width: "100%", borderRadius: 2 }}
        />
    ),
};
