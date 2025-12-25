'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = () => {
            const gridSize = 60;
            const dotSize = 1;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw animated dots at grid intersections
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    // Calculate distance from center for wave effect
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                    // Wave animation
                    const wave = Math.sin(dist * 0.01 - time * 0.02) * 0.5 + 0.5;
                    const opacity = 0.05 + wave * 0.1;

                    // Draw dot
                    ctx.beginPath();
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.fill();
                }
            }

            // Draw subtle connecting lines
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.02)';
            ctx.lineWidth = 0.5;

            // Horizontal lines
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Vertical lines
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        };

        const animate = () => {
            time++;
            drawGrid();
            animationId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
