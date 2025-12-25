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
                    p: { xs: 2, sm: 2.5, md: 3 },
                    height: '100%',
                    background: '#0a0f1c',
                    backgroundImage: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                    color: '#ffffff',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: { xs: 2, sm: 2.5, md: 3 },
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': { border: '1px solid rgba(6, 182, 212, 0.3)', transform: 'translateY(-2px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' },
                    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: props.trend === "up" ? 'linear-gradient(90deg, #10b981, #06b6d4)' : props.trend === "down" ? 'linear-gradient(90deg, #f43f5e, #f59e0b)' : 'linear-gradient(90deg, #06b6d4, #3b82f6)' }
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: { xs: 1, sm: 1.5, md: 2 } }}>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>{props.title}</Typography>
                    {props.icon && <Box sx={{ p: { xs: 0.75, sm: 1 }, borderRadius: 2, bgcolor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: trendColor }} /></Box>}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: { xs: 1, sm: 1.5 }, color: '#ffffff', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }, background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{props.value}</Typography>
                {props.change !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: { xs: 0.75, sm: 1 }, py: 0.5, borderRadius: 1.5, bgcolor: accentColor }}>
                            <TrendIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: trendColor }} />
                            <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{props.trend === "up" ? "+" : ""}{Math.abs(props.change)}%</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(100, 116, 139, 0.8)', fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>{props.changeLabel || "vs last period"}</Typography>
                    </Box>
                )}
            </MuiCard>
        );
    },

    KPICard: (props) => {
        const TrendIcon = props.trend === "up" ? TrendingUpIcon : props.trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
        const trendColor = props.trend === "up" ? "#10b981" : props.trend === "down" ? "#f43f5e" : "#64748b";
        const sparkData = props.sparklineData?.map((value: number, index: number) => ({ value, index })) ?? [];
        return (
            <MuiCard elevation={0} sx={{
                p: { xs: 2, sm: 2.5 },
                height: '100%',
                borderLeft: props.color ? `4px solid ${props.color}` : undefined,
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: { xs: 2, sm: 2.5, md: 3 }
            }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{props.title}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#ffffff', fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2rem' } }}>{props.value}</Typography>
                {props.subtitle && <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{props.subtitle}</Typography>}
                {props.change !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                        <TrendIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: trendColor }} />
                        <Typography variant="body2" sx={{ color: trendColor, fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{Math.abs(props.change)}%</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', ml: 0.5, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>{props.changeLabel || "vs last period"}</Typography>
                    </Box>
                )}
                {sparkData.length > 0 && (
                    <Box sx={{ width: "100%", height: { xs: 30, sm: 35, md: 40 }, mt: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsAreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Area type="monotone" dataKey="value" stroke={props.sparklineColor ?? "#06b6d4"} fill={props.sparklineColor ?? "#06b6d4"} fillOpacity={0.3} />
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
            const color = trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#64748b";
            return <Icon sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color }} />;
        };
        return (
            <MuiCard elevation={0} sx={{
                p: { xs: 2, sm: 2.5 },
                height: '100%',
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: { xs: 2, sm: 2.5, md: 3 }
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>{props.title}</Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: props.layout === "vertical" ? "column" : "row" }, gap: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
                    {props.metrics?.map((metric: any, i: number) => (
                        <Box key={i} sx={{ flex: 1, minWidth: { xs: '100%', sm: 100, md: 120 } }}>
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{metric.label}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>{metric.value}</Typography>
                                {metric.change !== undefined && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <TrendIconComponent trend={metric.trend} />
                                        <Typography variant="body2" sx={{ color: metric.trend === "up" ? "#10b981" : metric.trend === "down" ? "#f43f5e" : "#64748b", fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{Math.abs(metric.change)}%</Typography>
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
        <MuiCard elevation={0} sx={{
            p: { xs: 2, sm: 2.5 },
            height: '100%',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: { xs: 2, sm: 2.5, md: 3 }
        }}>
            {props.title && <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>{props.title}</Typography>}
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
                {props.items?.map((item: any, i: number) => {
                    const maxVal = item.maxValue ?? Math.max(...props.items.map((it: any) => it.value));
                    const percentage = (item.value / maxVal) * 100;
                    return (
                        <Box key={i}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{item.label}</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    {props.showValues && <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{item.value}</Typography>}
                                    {props.showPercentage && <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>({percentage.toFixed(0)}%)</Typography>}
                                </Box>
                            </Box>
                            <LinearProgress variant="determinate" value={percentage} sx={{ height: { xs: 6, sm: 8, md: 10 }, borderRadius: 5, bgcolor: "rgba(255, 255, 255, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: item.color ?? "#06b6d4", borderRadius: 5 } }} />
                        </Box>
                    );
                })}
            </Stack>
        </MuiCard>
    ),
};
