import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { createChart, ColorType, IChartApi, ISeriesApi, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

interface OHLCData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface CandlestickChartProps {
    title?: string;
    data: OHLCData[];
    height?: number;
}

export function CandlestickChart({ title = "Market Chart", data, height = 300 }: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#cbd5e1', // Slate-300
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });
        chartRef.current = chart;

        // Add Candlestick Series
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981', // Emerald-500
            downColor: '#f43f5e', // Rose-500
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#f43f5e',
        });

        // Add Volume Series (Histogram) - Overlay at bottom
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#1e293b', // Slate-800
            priceFormat: { type: 'volume' },
            priceScaleId: '', // Overlay on same scale? No, better use scaleMargins
        });

        // Configure Volume to sit at the bottom 20%
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8, // Highest volume bar reaches 80% down (so takes bottom 20%)
                bottom: 0,
            },
        });

        // Set Data
        // Lightweight charts expects time as string 'yyyy-mm-dd' or unix timestamp.
        // Our API prompt generates times like "10:00". We might need to handle this.
        // If the generated data is simple time strings without date, lightweight charts might complain if not configured as seconds.
        // However, for simplicity let's map the incoming data.

        // AUTO-FIX: Prompt generates "10:00", "11:00". Lightweight charts needs full dates or timestamps.
        // Let's generate a fake date prefix if missing, or use index based? 
        // Index based is cleaner but requires custom localization.
        // Let's stick to simple mapping: assume data is roughly correct or mapped.
        // If data.time is just HH:MM, append today's date.

        const today = new Date().toISOString().split('T')[0];

        const formattedData = data.map(d => {
            // Check if time is just HH:MM
            let timeVal = d.time;
            if (/^\d{1,2}:\d{2}$/.test(d.time)) {
                // It's a time string, prepend date to make it a timestamp?
                // Actually, for intraday, chart needs full timestamp (seconds).
                const [h, m] = d.time.split(':');
                const date = new Date();
                date.setHours(parseInt(h), parseInt(m), 0, 0);
                // Convert to UNIX timestamp for intraday
                return {
                    ...d,
                    time: (date.getTime() / 1000) as Time // Cast to Time type
                };
            }
            return {
                ...d,
                time: d.time as Time
            };
        });

        // Sort data by time just in case, required by library
        formattedData.sort((a: any, b: any) => (a.time as number) - (b.time as number));

        candlestickSeries.setData(formattedData);

        const volumeData = formattedData.map((d: any) => ({
            time: d.time,
            value: d.volume || 0,
            color: d.close > d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
        }));
        volumeSeries.setData(volumeData);

        // Resize Observer
        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(chartContainerRef.current);

        chart.timeScale().fitContent();

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, [data, height]);

    return (
        <Card className="p-4 bg-[#0a0f1c] border-white/10 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">{title}</h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Bullish</span>
                    <span className="flex items-center gap-1 text-xs text-rose-400"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Bearish</span>
                </div>
            </div>
            <div ref={chartContainerRef} className="w-full relative" style={{ height: height }} />
        </Card>
    );
}
