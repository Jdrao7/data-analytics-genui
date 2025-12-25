import React from 'react';
import { Box, Typography, Card as MuiCard, LinearProgress, CircularProgress as MuiCircularProgress } from '@mui/material';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ComponentRegistry } from './types';

export const progressComponents: ComponentRegistry = {
    LinearProgress: (props) => <LinearProgress variant="determinate" value={props.value ?? 0} color={props.color ?? "primary"} />,

    CircularProgress: (props) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <MuiCircularProgress variant={props.variant ?? "indeterminate"} value={props.value} size={props.size ?? 40} thickness={props.thickness ?? 3.6} color={props.color ?? "primary"} />
                {props.variant === "determinate" && props.value !== undefined && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="caption" fontWeight="bold">{`${Math.round(props.value)}%`}</Typography>
                    </Box>
                )}
            </Box>
            {props.label && <Typography variant="body2" color="text.secondary">{props.label}</Typography>}
        </Box>
    ),

    RadialGauge: (props) => {
        const maxValue = props.maxValue ?? 100;
        const percentage = (props.value / maxValue) * 100;
        const gaugeColor = props.color ?? "#06b6d4";
        const chartData = [{ name: props.title, value: percentage, fill: gaugeColor }];
        return (
            <MuiCard
                elevation={0}
                sx={{
                    p: 3, height: '100%',
                    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                    backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3,
                    transition: 'all 0.3s ease', '&:hover': { border: '1px solid rgba(6, 182, 212, 0.3)' }
                }}
            >
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 500, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{props.title}</Typography>
                <Box sx={{ width: "100%", height: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart data={chartData} startAngle={90} endAngle={90 - (percentage * 360) / 100} innerRadius={60} outerRadius={90} cx="50%" cy="50%">
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar background={{ fill: "rgba(255, 255, 255, 0.1)" }} dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <Box sx={{ textAlign: "center", mt: -8 }}>
                        <Typography variant="h4" style={{ color: '#ffffff', fontWeight: 700 }}>{props.value}%</Typography>
                        {props.label && <Typography variant="body2" style={{ color: '#94a3b8' }}>{props.label}</Typography>}
                    </Box>
                </Box>
            </MuiCard>
        );
    },

    ProgressRing: (props) => {
        const maxValue = props.maxValue ?? 100;
        const percentage = (props.value / maxValue) * 100;
        const sizeMap = { small: 80, medium: 120, large: 160 };
        const size = sizeMap[props.size as keyof typeof sizeMap] ?? 120;
        const thickness = props.thickness ?? 8;
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <MuiCircularProgress variant="determinate" value={100} size={size} thickness={thickness} sx={{ color: "grey.200" }} />
                    <MuiCircularProgress variant="determinate" value={percentage} size={size} thickness={thickness} sx={{ color: props.color ?? "primary.main", position: "absolute", left: 0 }} />
                    {props.showValue !== false && (
                        <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant={size > 100 ? "h4" : "h6"} fontWeight="bold">{`${Math.round(percentage)}%`}</Typography>
                        </Box>
                    )}
                </Box>
                {props.label && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{props.label}</Typography>}
            </Box>
        );
    },
};
