import React from 'react';
import { Box, Typography, Card as MuiCard, useMediaQuery, useTheme } from '@mui/material';
import {
    LineChart, Line, BarChart as RechartsBarChart, Bar, AreaChart as RechartsAreaChart, Area,
    PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ScatterChart as RechartsScatterChart, Scatter, Treemap,
    Funnel, FunnelChart as RechartsFunnelChart, ComposedChart, LabelList, ZAxis
} from 'recharts';
import { ComponentRegistry } from './types';
import { theme as appTheme } from '@/genui/styles/theme';

const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#ec4899", "#14b8a6"];

const chartCardSx = {
    p: { xs: 2, sm: 2.5, md: 3 },
    height: '100%',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: { xs: 2, sm: 2.5, md: 3 },
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }
};

const ChartHeader = ({ title, description }: { title?: string; description?: string }) => (
    (title || description) ? (
        <Box mb={{ xs: 1.5, sm: 2 }}>
            {title && <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>{title}</Typography>}
            {description && <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>{description}</Typography>}
        </Box>
    ) : null
);

// Responsive chart height helper
const getChartHeight = (baseHeight = 300) => ({
    xs: Math.min(baseHeight * 0.7, 220),
    sm: baseHeight * 0.85,
    md: baseHeight
});

export const chartComponents: ComponentRegistry = {
    LineChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={props.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey={props.xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={40} />
                        <Tooltip contentStyle={appTheme.tooltipStyle} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#94a3b8' }} itemSorter={(item) => (item.value as number) * -1} />
                        <Legend wrapperStyle={{ paddingTop: "10px", color: '#94a3b8', fontSize: '12px' }} />
                        {props.lines?.map((line: any, i: number) => (
                            <Line key={i} type="monotone" dataKey={line.dataKey} stroke={line.stroke || COLORS[i % 5]} name={line.name || line.dataKey} strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#111827' }} activeDot={{ r: 5, strokeWidth: 0, fill: line.stroke || '#06b6d4' }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    BarChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={props.data} layout={props.layout ?? "horizontal"} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey={props.xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={40} />
                        <Tooltip contentStyle={appTheme.tooltipStyle} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#94a3b8' }} />
                        <Legend wrapperStyle={{ paddingTop: "10px", color: '#94a3b8', fontSize: '12px' }} />
                        {props.bars?.map((bar: any, i: number) => (
                            <Bar key={i} dataKey={bar.dataKey} fill={bar.fill || COLORS[i % 5]} name={bar.name || bar.dataKey} stackId={bar.stackId} radius={[4, 4, 0, 0]} />
                        ))}
                    </RechartsBarChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    AreaChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={props.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey={props.xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={40} />
                        <Tooltip contentStyle={appTheme.tooltipStyle} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#94a3b8' }} />
                        <Legend wrapperStyle={{ paddingTop: "10px", color: '#94a3b8', fontSize: '12px' }} />
                        {props.areas?.map((area: any, i: number) => {
                            const areaColor = area.fill || COLORS[i % 5];
                            return <Area key={i} type="monotone" dataKey={area.dataKey} fill={areaColor} stroke={area.stroke || areaColor} fillOpacity={0.3} name={area.name || area.dataKey} stackId={area.stackId} />;
                        })}
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    PieChart: (props) => {
        const outerRadius = props.outerRadius ?? 70;
        const innerRadius = props.innerRadius ?? (outerRadius > 50 ? outerRadius * 0.55 : 0);
        const renderCustomLabel = ({ cx, cy, midAngle, outerRadius: or, value }: any) => {
            const RADIAN = Math.PI / 180;
            const radius = or + 20;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return <text x={x} y={y} fill="#94a3b8" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight={500}>{value}</text>;
        };
        return (
            <MuiCard elevation={0} sx={{ ...chartCardSx, overflow: 'hidden' }}>
                <ChartHeader title={props.title} description={props.description} />
                <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 280) }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                            <Pie data={props.data} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={innerRadius} outerRadius={outerRadius} label={props.showLabels !== false ? renderCustomLabel : false} labelLine={false}>
                                {props.data?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={appTheme.tooltipStyle} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#94a3b8' }} />
                            {props.showLegend !== false && <Legend wrapperStyle={{ position: 'absolute', bottom: '0px', width: '100%', left: 0, paddingBottom: '5px', color: '#94a3b8', fontSize: '11px' }} />}
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </Box>
            </MuiCard>
        );
    },

    ScatterChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsScatterChart margin={{ top: 15, right: 15, bottom: 15, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis type="number" dataKey="x" name={props.xAxisLabel ?? "X"} stroke="#64748b" fontSize={11} />
                        <YAxis type="number" dataKey="y" name={props.yAxisLabel ?? "Y"} stroke="#64748b" fontSize={11} width={40} />
                        {props.showZAxis && <ZAxis type="number" dataKey="z" range={[60, 400]} />}
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.95)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#ffffff" }} />
                        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '11px' }} />
                        <Scatter name="Data" data={props.data} fill="#06b6d4">
                            {props.data?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />)}
                        </Scatter>
                    </RechartsScatterChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    FunnelChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsFunnelChart>
                        <Tooltip contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.95)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#ffffff" }} />
                        <Funnel dataKey="value" data={props.data} isAnimationActive>
                            {props.data?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />)}
                            {props.showLabels && <LabelList position="center" fill="#fff" fontSize={11} fontWeight={600} dataKey="name" />}
                            {props.showValues && <LabelList position="right" fill="#94a3b8" fontSize={11} dataKey="value" />}
                        </Funnel>
                    </RechartsFunnelChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    TreemapChart: (props) => {
        const flattenData = (data: any[]) => data.flatMap((item: any) => item.children?.length > 0 ? item.children.map((child: any) => ({ ...child, parent: item.name })) : [item]);
        return (
            <MuiCard elevation={0} sx={chartCardSx}>
                <ChartHeader title={props.title} description={props.description} />
                <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap data={flattenData(props.data)} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8">
                            {flattenData(props.data)?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />)}
                            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                        </Treemap>
                    </ResponsiveContainer>
                </Box>
            </MuiCard>
        );
    },

    ComboChart: (props) => (
        <MuiCard elevation={0} sx={chartCardSx}>
            <ChartHeader title={props.title} description={props.description} />
            <Box sx={{ width: "100%", height: getChartHeight(props.height ?? 300) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={props.data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey={props.xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={40} />
                        <Tooltip contentStyle={appTheme.tooltipStyle} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#94a3b8' }} />
                        <Legend wrapperStyle={{ paddingTop: "10px", fontSize: '11px' }} />
                        {props.bars?.map((bar: any, i: number) => <Bar key={i} dataKey={bar.dataKey} fill={bar.fill} name={bar.name || bar.dataKey} radius={[4, 4, 0, 0]} />)}
                        {props.lines?.map((line: any, i: number) => <Line key={i} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name || line.dataKey} strokeWidth={2} dot={{ r: 3 }} />)}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </MuiCard>
    ),

    SparklineChart: (props) => {
        const data = props.data?.map((value: number, index: number) => ({ value, index })) ?? [];
        return (
            <MuiCard elevation={0} sx={{ ...chartCardSx, p: { xs: 1.5, sm: 2 } }}>
                {props.title && <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>{props.title}</Typography>}
                <Box sx={{ width: "100%", height: props.height ?? 50 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsAreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Area type="monotone" dataKey="value" stroke={props.color ?? "#06b6d4"} fill={props.color ?? "#06b6d4"} fillOpacity={0.3} dot={props.showDots ? { r: 2 } : false} />
                        </RechartsAreaChart>
                    </ResponsiveContainer>
                </Box>
            </MuiCard>
        );
    },

    MiniChart: (props) => {
        const data = props.data?.map((value: number, index: number) => ({ value, index })) ?? [];
        return (
            <Box sx={{ width: props.width ?? "100%", height: props.height ?? 35 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {props.type === "bar" ? (
                        <RechartsBarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            {props.showTooltip && <Tooltip />}
                            <Bar dataKey="value" fill={props.color ?? "#06b6d4"} />
                        </RechartsBarChart>
                    ) : props.type === "line" ? (
                        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            {props.showTooltip && <Tooltip />}
                            <Line type="monotone" dataKey="value" stroke={props.color ?? "#06b6d4"} strokeWidth={2} dot={false} />
                        </LineChart>
                    ) : (
                        <RechartsAreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            {props.showTooltip && <Tooltip />}
                            <Area type="monotone" dataKey="value" stroke={props.color ?? "#06b6d4"} fill={props.color ?? "#06b6d4"} fillOpacity={0.3} />
                        </RechartsAreaChart>
                    )}
                </ResponsiveContainer>
            </Box>
        );
    },
};
