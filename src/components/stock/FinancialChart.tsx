import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import {
    createChart,
    ColorType,
    IChartApi,
    Time,
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
    AreaSeries,
    BarSeries,
    BaselineSeries
} from 'lightweight-charts';

interface ChartDataPoint {
    time: string | number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    value?: number;
    volume?: number;
    color?: string;
}

interface FinancialChartProps {
    title?: string;
    chartType?: "candlestick" | "line" | "area" | "bar" | "baseline" | "histogram";
    data: ChartDataPoint[];
    height?: number;
    colors?: {
        upColor?: string;
        downColor?: string;
        lineColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export function FinancialChart({
    title = "Financial Chart",
    chartType = "candlestick",
    data,
    height = 300,
    colors
}: FinancialChartProps) {
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

        // Prepare Data (Ensure Time is valid)
        const formattedData = data.map(d => {
            let timeVal = d.time;
            if (typeof d.time === 'string' && /^\d{1,2}:\d{2}$/.test(d.time)) {
                // simple HH:MM
                const [h, m] = d.time.split(':');
                const date = new Date();
                date.setHours(parseInt(h), parseInt(m), 0, 0);
                timeVal = (date.getTime() / 1000) as Time;
            } else {
                timeVal = d.time as Time;
            }

            return {
                ...d,
                time: timeVal
            };
        });

        formattedData.sort((a: any, b: any) => (a.time as number) - (b.time as number));

        // Add Main Series based on Type
        let mainSeries: any;

        switch (chartType) {
            case 'candlestick':
                mainSeries = chart.addSeries(CandlestickSeries, {
                    upColor: colors?.upColor || '#10b981',
                    downColor: colors?.downColor || '#f43f5e',
                    borderVisible: false,
                    wickUpColor: colors?.upColor || '#10b981',
                    wickDownColor: colors?.downColor || '#f43f5e',
                });
                break;
            case 'bar':
                mainSeries = chart.addSeries(BarSeries, {
                    upColor: colors?.upColor || '#10b981',
                    downColor: colors?.downColor || '#f43f5e',
                });
                break;
            case 'line':
                mainSeries = chart.addSeries(LineSeries, {
                    color: colors?.lineColor || '#06b6d4',
                    lineWidth: 2,
                });
                break;
            case 'area':
                mainSeries = chart.addSeries(AreaSeries, {
                    topColor: colors?.areaTopColor || 'rgba(6, 182, 212, 0.4)',
                    bottomColor: colors?.areaBottomColor || 'rgba(6, 182, 212, 0.0)',
                    lineColor: colors?.lineColor || '#06b6d4',
                    lineWidth: 2,
                });
                break;
            case 'baseline':
                // Calculate average for baseline or use middle? defaulting to first value
                const baseValue = formattedData[0]?.value || formattedData[0]?.close || 0;
                mainSeries = chart.addSeries(BaselineSeries, {
                    baseValue: { type: 'price', price: baseValue },
                    topLineColor: '#10b981',
                    bottomLineColor: '#f43f5e',
                });
                break;
            case 'histogram':
                mainSeries = chart.addSeries(HistogramSeries, {
                    color: colors?.lineColor || '#06b6d4',
                });
                break;
        }

        // Set Data
        if (mainSeries) {
            // Filter data props relevant to the series type
            // Candlestick/Bar need open, high, low, close
            // Line/Area/Baseline/Histogram need value

            const seriesData = formattedData.map(d => {
                if (chartType === 'candlestick' || chartType === 'bar') {
                    return {
                        time: d.time,
                        open: d.open,
                        high: d.high,
                        low: d.low,
                        close: d.close,
                    };
                } else {
                    return {
                        time: d.time,
                        value: d.value ?? d.close ?? 0, // Fallback to close if value missing
                        color: d.color,
                    };
                }
            });
            mainSeries.setData(seriesData);
        }

        // Add Volume Overlay if 'volume' exists in data AND it's a price chart (not pure histogram)
        // Check if any data point has volume
        const hasVolume = formattedData.some(d => d.volume !== undefined);

        if (hasVolume && chartType !== 'histogram') {
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: '#1e293b',
                priceFormat: { type: 'volume' },
                priceScaleId: '',
            });

            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            const volumeData = formattedData.map((d: any) => ({
                time: d.time,
                value: d.volume || 0,
                color: (d.close && d.open) ? (d.close > d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)') : 'rgba(148, 163, 184, 0.3)',
            }));

            volumeSeries.setData(volumeData);
        }


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
    }, [data, height, chartType, colors]);

    return (
        <Card className="p-4 bg-[#0a0f1c] border-white/10 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">{title}</h3>
                {(chartType === 'candlestick' || chartType === 'bar') && <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Bullish</span>
                    <span className="flex items-center gap-1 text-xs text-rose-400"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Bearish</span>
                </div>}
            </div>
            <div ref={chartContainerRef} className="w-full relative" style={{ height: height }} />
        </Card>
    );
}
