import React from 'react';
import { Box, Typography, Card as MuiCard, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ComponentRegistry } from './types';

export const tableComponents: ComponentRegistry = {
    Table: (props) => (
        <MuiCard
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { border: '1px solid rgba(6, 182, 212, 0.3)' }
            }}
        >
            {props.title && <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>{props.title}</Typography>}
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent', borderRadius: 2, overflow: 'hidden' }}>
                <MuiTable size="small">
                    <TableHead>
                        <TableRow>
                            {props.columns?.map((col: any, i: number) => (
                                <TableCell key={i} align={col.align ?? "left"} sx={{ fontWeight: 600, bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                    {col.header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows?.map((row: any, rowIdx: number) => (
                            <TableRow key={rowIdx} sx={{ bgcolor: props.striped && rowIdx % 2 === 1 ? 'rgba(255, 255, 255, 0.02)' : 'transparent', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' }, transition: 'background-color 0.2s ease' }}>
                                {props.columns?.map((col: any, colIdx: number) => (
                                    <TableCell key={colIdx} align={col.align ?? "left"} sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        {row[col.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>
        </MuiCard>
    ),

    HeatmapTable: (props) => {
        const getColor = (value: number, min: number, max: number, minColor: string, maxColor: string) => {
            const ratio = (value - min) / (max - min || 1);
            return `color-mix(in srgb, ${maxColor} ${ratio * 100}%, ${minColor})`;
        };
        const allValues = props.data.flat();
        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);
        const minColor = props.minColor ?? "#f0f9ff";
        const maxColor = props.maxColor ?? "#1e40af";

        return (
            <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
                {props.title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>}
                <TableContainer>
                    <MuiTable size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {props.xLabels.map((label: string, i: number) => <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>{label}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.yLabels.map((yLabel: string, rowIdx: number) => (
                                <TableRow key={rowIdx}>
                                    <TableCell sx={{ fontWeight: "bold" }}>{yLabel}</TableCell>
                                    {props.data[rowIdx]?.map((value: number, colIdx: number) => (
                                        <TableCell key={colIdx} align="center" sx={{ backgroundColor: getColor(value, minVal, maxVal, minColor, maxColor), color: value > (maxVal + minVal) / 2 ? "#fff" : "#000" }}>
                                            {props.showValues !== false && value}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            </MuiCard>
        );
    },
};
