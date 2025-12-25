import React from 'react';
import { Box, Typography, Card as MuiCard, Stack, LinearProgress } from '@mui/material';
import { AreaChart as RechartsAreaChart, Area, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { ComponentRegistry } from './types';

export const metricComponents: ComponentRegistry = {
    StatCard: (props) => {
        const TrendIcon = props.trend === "up" ? TrendingUpIcon : props.trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
        const trendColor = props.trend === "up" ? "#10b981" : props.trend === "down" ? "#f43f5e" : "#64748b";
        const accentColor = props.trend === "up" ? "rgba(16, 185, 129, 0.15)" : props.trend === "down" ? "rgba(244, 63, 94, 0.15)" : "rgba(6, 182, 212, 0.15)";
        return (
            <MuiCard
                elevation={0}
                sx={{
                    p: 3, height: '100%', background: '#0a0f1c', backgroundImage: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                    color: '#ffffff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                    '&:hover': { border: '1px solid rgba(6, 182, 212, 0.3)', transform: 'translateY(-2px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' },
                    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: props.trend === "up" ? 'linear-gradient(90deg, #10b981, #06b6d4)' : props.trend === "down" ? 'linear-gradient(90deg, #f43f5e, #f59e0b)' : 'linear-gradient(90deg, #06b6d4, #3b82f6)' }
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{props.title}</Typography>
                    {props.icon && <Box sx={{ p: 1, borderRadius: 2, bgcolor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendIcon sx={{ fontSize: 20, color: trendColor }} /></Box>}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5, color: '#ffffff', background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{props.value}</Typography>
                {props.change !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1.5, bgcolor: accentColor }}>
                            <TrendIcon sx={{ fontSize: 16, color: trendColor }} />
                            <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600, fontSize: '0.8rem' }}>{props.trend === "up" ? "+" : ""}{Math.abs(props.change)}%</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(100, 116, 139, 0.8)', fontSize: '0.8rem' }}>{props.changeLabel || "vs last period"}</Typography>
                    </Box>
                )}
            </MuiCard>
        );
    },

    KPICard: (props) => {
        const TrendIcon = props.trend === "up" ? TrendingUpIcon : props.trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
        const trendColor = props.trend === "up" ? "success.main" : props.trend === "down" ? "error.main" : "text.secondary";
        const sparkData = props.sparklineData?.map((value: number, index: number) => ({ value, index })) ?? [];
        return (
            <MuiCard elevation={3} sx={{ p: 2, height: '100%', borderLeft: props.color ? `4px solid ${props.color}` : undefined }}>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">{props.title}</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>{props.value}</Typography>
                {props.subtitle && <Typography variant="body2" color="text.secondary">{props.subtitle}</Typography>}
                {props.change !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                        <TrendIcon sx={{ fontSize: 18, color: trendColor }} />
                        <Typography variant="body2" sx={{ color: trendColor, fontWeight: "medium" }}>{Math.abs(props.change)}%</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{props.changeLabel || "vs last period"}</Typography>
                    </Box>
                )}
                {sparkData.length > 0 && (
                    <Box sx={{ width: "100%", height: 40, mt: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsAreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Area type="monotone" dataKey="value" stroke={props.sparklineColor ?? "#8884d8"} fill={props.sparklineColor ?? "#8884d8"} fillOpacity={0.3} />
                            </RechartsAreaChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </MuiCard>
        );
    },

    MetricTrend: (props) => {
        const TrendIconComponent = ({ trend }: { trend?: string }) => {
            const Icon = trend === "up" ? TrendingUpIcon : trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
            const color = trend === "up" ? "success.main" : trend === "down" ? "error.main" : "text.secondary";
            return <Icon sx={{ fontSize: 18, color }} />;
        };
        return (
            <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>
                <Box sx={{ display: "flex", flexDirection: props.layout === "vertical" ? "column" : "row", gap: 3, flexWrap: "wrap" }}>
                    {props.metrics?.map((metric: any, i: number) => (
                        <Box key={i} sx={{ flex: 1, minWidth: 120 }}>
                            <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
                                {metric.change !== undefined && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <TrendIconComponent trend={metric.trend} />
                                        <Typography variant="body2" sx={{ color: metric.trend === "up" ? "success.main" : metric.trend === "down" ? "error.main" : "text.secondary" }}>{Math.abs(metric.change)}%</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </MuiCard>
        );
    },

    ComparisonBar: (props) => (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
            {props.title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>}
            <Stack spacing={2}>
                {props.items?.map((item: any, i: number) => {
                    const maxVal = item.maxValue ?? Math.max(...props.items.map((it: any) => it.value));
                    const percentage = (item.value / maxVal) * 100;
                    return (
                        <Box key={i}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2">{item.label}</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    {props.showValues && <Typography variant="body2" fontWeight="bold">{item.value}</Typography>}
                                    {props.showPercentage && <Typography variant="body2" color="text.secondary">({percentage.toFixed(0)}%)</Typography>}
                                </Box>
                            </Box>
                            <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: item.color ?? "#8884d8", borderRadius: 5 } }} />
                        </Box>
                    );
                })}
            </Stack>
        </MuiCard>
    ),
};
