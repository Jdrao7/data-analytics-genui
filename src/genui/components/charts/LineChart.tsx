import React from 'react';
import { Box, Typography, Card as MuiCard } from '@mui/material';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { theme } from '../../styles/theme';

interface LineChartProps {
    title?: string;
    description?: string;
    data: any[];
    xAxisKey: string;
    lines?: Array<{ dataKey: string; stroke?: string; name?: string }>;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
    title,
    description,
    data,
    xAxisKey,
    lines
}) => (
    <MuiCard elevation={0} sx={{ ...theme.cardStyle }}>
        {(title || description) && (
            <Box mb={2}>
                {title && (
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.colors.textPrimary }}>
                        {title}
                    </Typography>
                )}
                {description && (
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                        {description}
                    </Typography>
                )}
            </Box>
        )}
        <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.colors.grid} />
                    <XAxis dataKey={xAxisKey} stroke={theme.colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={theme.colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={theme.tooltipStyle}
                        labelStyle={{ color: theme.colors.textSecondary }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px", color: theme.colors.textSecondary }} />
                    {lines?.map((line, i) => (
                        <Line
                            key={i}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={line.stroke || theme.chartColors[i % theme.chartColors.length]}
                            name={line.name || line.dataKey}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: theme.colors.bgSecondary }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: line.stroke || theme.colors.cyan }}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </Box>
    </MuiCard>
);

export default LineChartComponent;
