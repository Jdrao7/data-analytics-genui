import React from 'react';
import {
    Box, Typography, Badge as MuiBadge, Skeleton as MuiSkeleton, Avatar as MuiAvatar, AvatarGroup as MuiAvatarGroup,
    Tooltip as MuiTooltip, Accordion as MuiAccordion, AccordionSummary, AccordionDetails,
    Stepper as MuiStepper, Step, StepLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ComponentRegistry } from './types';

export const utilityComponents: ComponentRegistry = {
    Badge: (props, { renderChildren }) => (
        <MuiBadge
            badgeContent={props.content}
            variant={props.variant ?? "standard"}
            max={props.max ?? 99}
            sx={{
                '& .MuiBadge-badge': {
                    bgcolor: props.color === 'success' ? '#10b981' : props.color === 'error' ? '#f43f5e' : props.color === 'warning' ? '#f59e0b' : '#06b6d4',
                    color: '#ffffff', fontWeight: 600
                }
            }}
        >
            {renderChildren()}
        </MuiBadge>
    ),

    Skeleton: (props) => (
        <MuiSkeleton
            variant={props.variant ?? "rectangular"}
            width={props.width}
            height={props.height}
            animation={props.animation === "false" ? false : props.animation ?? "pulse"}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
        />
    ),

    Avatar: (props) => {
        const getInitials = (name?: string) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "";
        const sizeMap = { small: 32, medium: 40, large: 56 };
        const size = sizeMap[props.size as keyof typeof sizeMap] ?? 40;
        return (
            <MuiAvatar
                src={props.src}
                alt={props.alt ?? props.name}
                variant={props.variant ?? "circular"}
                sx={{ width: size, height: size, bgcolor: props.bgcolor ?? 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '2px solid rgba(6, 182, 212, 0.3)', fontWeight: 600 }}
            >
                {!props.src && getInitials(props.name)}
            </MuiAvatar>
        );
    },

    AvatarGroup: (props) => (
        <MuiAvatarGroup
            max={props.max ?? 4}
            sx={{ '& .MuiAvatar-root': { bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '2px solid rgba(17, 24, 39, 0.9)', fontWeight: 600 } }}
        >
            {props.avatars?.map((avatar: any, i: number) => {
                const getInitials = (name?: string) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "";
                return <MuiAvatar key={i} src={avatar.src} alt={avatar.alt ?? avatar.name}>{!avatar.src && getInitials(avatar.name)}</MuiAvatar>;
            })}
        </MuiAvatarGroup>
    ),

    Tooltip: (props, { renderChildren }) => (
        <MuiTooltip
            title={props.title}
            placement={props.placement ?? "top"}
            arrow={props.arrow ?? false}
            componentsProps={{
                tooltip: { sx: { bgcolor: 'rgba(17, 24, 39, 0.95)', color: '#ffffff', fontSize: '0.8rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2 } },
                arrow: { sx: { color: 'rgba(17, 24, 39, 0.95)' } }
            }}
        >
            <span>{renderChildren()}</span>
        </MuiTooltip>
    ),

    Accordion: (props) => (
        <Box>
            {props.items?.map((item: any, i: number) => (
                <MuiAccordion
                    key={i}
                    defaultExpanded={item.defaultExpanded}
                    sx={{
                        bgcolor: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px !important', mb: 1,
                        '&:before': { display: 'none' }, '&.Mui-expanded': { margin: '0 0 8px 0' }
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#06b6d4' }} />} sx={{ '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' } }}>
                        <Typography sx={{ fontWeight: 500, color: '#ffffff' }}>{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#94a3b8' }}>{item.content}</Typography>
                    </AccordionDetails>
                </MuiAccordion>
            ))}
        </Box>
    ),

    Stepper: (props) => (
        <MuiStepper
            activeStep={props.activeStep}
            orientation={props.orientation ?? "horizontal"}
            alternativeLabel={props.alternativeLabel}
            sx={{
                '& .MuiStepLabel-label': { color: '#94a3b8' },
                '& .MuiStepLabel-label.Mui-active': { color: '#06b6d4', fontWeight: 600 },
                '& .MuiStepLabel-label.Mui-completed': { color: '#10b981' },
                '& .MuiStepIcon-root': { color: 'rgba(255, 255, 255, 0.1)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#06b6d4' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
                '& .MuiStepConnector-line': { borderColor: 'rgba(255, 255, 255, 0.1)' }
            }}
        >
            {props.steps?.map((step: any, i: number) => (
                <Step key={i}>
                    <StepLabel optional={step.description ? <Typography variant="caption">{step.description}</Typography> : undefined}>{step.label}</StepLabel>
                </Step>
            ))}
        </MuiStepper>
    ),
};
