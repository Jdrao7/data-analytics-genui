'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card as MuiCard, Table as MuiTable, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button as MuiButton, Slider as MuiSlider, Rating as MuiRating,
    Alert as MuiAlert, AlertTitle, LinearProgress, Chip, Avatar as MuiAvatar, IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ComponentRegistry } from './types';

// Timer Component
function TimerComponent({ initialSeconds, autoStart, showHours, size }: any) {
    const [seconds, setSeconds] = useState(initialSeconds ?? 0);
    const [isRunning, setIsRunning] = useState(autoStart ?? false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && seconds > 0) {
            interval = setInterval(() => setSeconds((prev: number) => Math.max(0, prev - 1)), 1000);
        } else if (seconds === 0) setIsRunning(false);
        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return (showHours || hrs > 0) ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const sizeMap = { small: "h5", medium: "h4", large: "h3" } as const;
    const variant = sizeMap[size as keyof typeof sizeMap] ?? "h4";

    return (
        <MuiCard elevation={0} sx={{ p: 3, textAlign: "center", background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
            <Typography variant={variant} sx={{ fontWeight: 700, color: '#cbd5e1', fontFamily: "monospace", textShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}>{formatTime(seconds)}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                <IconButton onClick={() => setIsRunning(!isRunning)} sx={{ bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.3)' } }}>
                    {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={() => { setSeconds(initialSeconds ?? 0); setIsRunning(false); }} sx={{ bgcolor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' } }}>
                    <RestartAltIcon />
                </IconButton>
            </Box>
        </MuiCard>
    );
}

// Countdown Component
function CountdownComponent({ targetDate, title, showDays, showHours, showMinutes, showSeconds }: any) {
    const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 1000)));

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 1000))), 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <Box sx={{ textAlign: "center", mx: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: "monospace", bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#ffffff', px: 2, py: 1, borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.3)', minWidth: 80 }}>{value.toString().padStart(2, '0')}</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>{label}</Typography>
        </Box>
    );

    return (
        <MuiCard elevation={0} sx={{ p: 3, textAlign: "center", background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
            {title && <Typography variant="h6" sx={{ mb: 2, color: '#ffffff', fontWeight: 600 }}>{title}</Typography>}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {showDays !== false && <TimeUnit value={days} label="Days" />}
                {showHours !== false && <TimeUnit value={hours} label="Hours" />}
                {showMinutes !== false && <TimeUnit value={minutes} label="Minutes" />}
                {showSeconds !== false && <TimeUnit value={secs} label="Seconds" />}
            </Box>
        </MuiCard>
    );
}

// Alert Component
function AlertComponent({ severity, title, message, dismissible }: any) {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981' },
        info: { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.3)', color: '#06b6d4' },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' },
        error: { bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.3)', color: '#f43f5e' },
    };
    const c = colors[severity as keyof typeof colors] || colors.info;
    return (
        <MuiAlert severity={severity} onClose={dismissible ? () => setVisible(false) : undefined} sx={{ mb: 2, bgcolor: c.bg, border: `1px solid ${c.border}`, color: '#e2e8f0', '& .MuiAlert-icon': { color: c.color }, '& .MuiAlertTitle-root': { color: c.color, fontWeight: 600 }, '& .MuiAlert-action .MuiIconButton-root': { color: '#94a3b8' }, borderRadius: 2 }}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </MuiAlert>
    );
}

// Slider Component
function SliderComponent({ label, min, max, defaultValue, step, marks, showValue }: any) {
    const [value, setValue] = useState(defaultValue ?? ((min + max) / 2));
    return (
        <Box sx={{ width: "100%", px: 2 }}>
            {label && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{label}</Typography>
                    {showValue && <Typography variant="body2" sx={{ fontWeight: 600, color: '#06b6d4' }}>{value}</Typography>}
                </Box>
            )}
            <MuiSlider value={value} onChange={(_, v) => setValue(v as number)} min={min} max={max} step={step ?? 1} marks={marks} valueLabelDisplay="auto" sx={{ color: '#06b6d4', '& .MuiSlider-track': { bgcolor: '#06b6d4' }, '& .MuiSlider-rail': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiSlider-thumb': { bgcolor: '#06b6d4', '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(6, 182, 212, 0.2)' } }, '& .MuiSlider-mark': { bgcolor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiSlider-valueLabel': { bgcolor: 'rgba(17, 24, 39, 0.95)', color: '#ffffff' } }} />
        </Box>
    );
}

// Rating Component
function RatingComponent({ value: initialValue, max, precision, size, readOnly, label }: any) {
    const [value, setValue] = useState(initialValue);
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {label && <Typography variant="body2" sx={{ color: '#94a3b8' }}>{label}</Typography>}
            <MuiRating value={value} onChange={(_, v) => !readOnly && setValue(v ?? 0)} max={max ?? 5} precision={precision ?? 1} size={size ?? "medium"} readOnly={readOnly} />
        </Box>
    );
}

// DataGrid Component
function DataGridComponent({ title, columns, rows, pageSize = 10, showPagination, striped }: any) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil((rows?.length ?? 0) / pageSize);
    const displayRows = rows?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

    const renderCellContent = (col: any, val: any) => {
        switch (col.type) {
            case "badge": return <Chip label={val} size="small" sx={{ bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }} />;
            case "progress": return <LinearProgress variant="determinate" value={Number(val)} sx={{ width: 80, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#06b6d4' } }} />;
            case "avatar": return <MuiAvatar sx={{ width: 32, height: 32, bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }} src={val}>{String(val).charAt(0)}</MuiAvatar>;
            default: return val;
        }
    };

    return (
        <MuiCard elevation={0} sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3, '&:hover': { border: '1px solid rgba(6, 182, 212, 0.3)' } }}>
            {title && <Typography variant="h6" style={{ fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>{title}</Typography>}
            <TableContainer sx={{ bgcolor: 'transparent' }}>
                <MuiTable size="small">
                    <TableHead>
                        <TableRow>
                            {columns?.map((col: any, i: number) => (
                                <TableCell key={i} align={col.align ?? "left"} sx={{ fontWeight: 600, bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', width: col.width }}>{col.header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayRows.map((row: any, rowIdx: number) => (
                            <TableRow key={rowIdx} sx={{ bgcolor: striped && rowIdx % 2 === 1 ? 'rgba(255, 255, 255, 0.02)' : 'transparent', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' } }}>
                                {columns?.map((col: any, colIdx: number) => <TableCell key={colIdx} align={col.align ?? "left"} sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{renderCellContent(col, row[col.key])}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            {showPagination && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <MuiButton size="small" disabled={page === 0} onClick={() => setPage(page - 1)} variant="outlined" sx={{ color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>Previous</MuiButton>
                    <Typography variant="body2" style={{ display: "flex", alignItems: "center", color: '#94a3b8' }}>Page {page + 1} of {totalPages}</Typography>
                    <MuiButton size="small" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} variant="outlined" sx={{ color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>Next</MuiButton>
                </Box>
            )}
        </MuiCard>
    );
}

export const interactiveComponents: ComponentRegistry = {
    Timer: (props) => <TimerComponent {...props} />,
    Countdown: (props) => <CountdownComponent {...props} />,
    Alert: (props) => <AlertComponent {...props} />,
    Slider: (props) => <SliderComponent {...props} />,
    Rating: (props) => <RatingComponent {...props} />,
    DataGrid: (props) => <DataGridComponent {...props} />,
};
