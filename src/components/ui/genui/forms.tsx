import React from 'react';
import { Button as MuiButton, TextField, Chip, List as MuiList, ListItem, FormControlLabel, Switch as MuiSwitch } from '@mui/material';
import { ComponentRegistry } from './types';

export const formComponents: ComponentRegistry = {
    Button: (props) => (
        <MuiButton
            variant={props.variant ?? "contained"}
            sx={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--ring) 100%)',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                border: props.variant === 'outlined' ? '1px solid rgba(6, 182, 212, 0.5)' : 'none',
                boxShadow: props.variant === 'outlined' ? 'none' : '0 4px 15px rgba(6, 182, 212, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    background: props.variant === 'outlined' ? 'rgba(6, 182, 212, 0.1)'
                        : 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
                    boxShadow: props.variant === 'outlined' ? 'none' : '0 6px 20px rgba(6, 182, 212, 0.4)',
                    transform: 'translateY(-1px)'
                }
            }}
        >
            {props.label}
        </MuiButton>
    ),

    Input: (props) => (
        <TextField
            fullWidth
            label={props.label}
            placeholder={props.placeholder}
            type={props.type ?? "text"}
            sx={{
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(6, 182, 212, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                },
                '& .MuiInputLabel-root': { color: '#64748b' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' },
                '& .MuiOutlinedInput-input::placeholder': { color: '#64748b', opacity: 1 },
            }}
        />
    ),

    Chip: (props) => (
        <Chip
            label={props.label}
            sx={{
                bgcolor: props.color === 'success' ? 'rgba(16, 185, 129, 0.2)'
                    : props.color === 'error' ? 'rgba(244, 63, 94, 0.2)'
                        : props.color === 'warning' ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(6, 182, 212, 0.2)',
                color: props.color === 'success' ? '#10b981'
                    : props.color === 'error' ? '#f43f5e'
                        : props.color === 'warning' ? '#f59e0b'
                            : '#06b6d4',
                fontWeight: 500,
                border: '1px solid',
                borderColor: props.color === 'success' ? 'rgba(16, 185, 129, 0.3)'
                    : props.color === 'error' ? 'rgba(244, 63, 94, 0.3)'
                        : props.color === 'warning' ? 'rgba(245, 158, 11, 0.3)'
                            : 'rgba(6, 182, 212, 0.3)',
            }}
        />
    ),

    List: (props) => (
        <MuiList sx={{ color: '#e2e8f0' }}>
            {React.Children.map(props.items, (item, idx) => (
                <ListItem key={idx} sx={{ color: '#e2e8f0' }}>{item}</ListItem>
            ))}
        </MuiList>
    ),

    Switch: (props) => (
        <FormControlLabel
            control={
                <MuiSwitch
                    defaultChecked={props.defaultChecked}
                    disabled={props.disabled}
                    size={props.size ?? "medium"}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#06b6d4' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'rgba(6, 182, 212, 0.5)' },
                        '& .MuiSwitch-track': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                    }}
                />
            }
            label={props.label}
            sx={{ '& .MuiFormControlLabel-label': { color: '#e2e8f0' } }}
        />
    ),
};
