import React, { useState, useEffect } from 'react';
import { Box, Typography, Card as MuiCard, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { theme } from '../../styles/theme';

interface TimerProps {
    initialSeconds?: number;
    autoStart?: boolean;
    showHours?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

export const TimerComponent: React.FC<TimerProps> = ({
    initialSeconds = 0,
    autoStart = false,
    showHours = false,
    size = 'medium',
    color
}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => Math.max(0, prev - 1));
            }, 1000);
        } else if (seconds === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        if (showHours || hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const sizeMap = { small: 'h5', medium: 'h4', large: 'h3' } as const;
    const variant = sizeMap[size];

    return (
        <MuiCard elevation={0} sx={{ ...theme.cardStyle, textAlign: 'center' }}>
            <Typography
                variant={variant}
                sx={{
                    fontWeight: 700,
                    color: color ?? theme.colors.textPrimary,
                    fontFamily: 'monospace',
                    textShadow: `0 0 30px ${theme.colors.cyanLight}`
                }}
            >
                {formatTime(seconds)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                <IconButton
                    onClick={() => setIsRunning(!isRunning)}
                    sx={{
                        bgcolor: theme.colors.cyanLight,
                        color: theme.colors.cyan,
                        '&:hover': { bgcolor: theme.colors.cyanBorder }
                    }}
                >
                    {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton
                    onClick={() => { setSeconds(initialSeconds); setIsRunning(false); }}
                    sx={{
                        bgcolor: 'rgba(139, 92, 246, 0.2)',
                        color: theme.colors.purple,
                        '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' }
                    }}
                >
                    <RestartAltIcon />
                </IconButton>
            </Box>
        </MuiCard>
    );
};

export default TimerComponent;
