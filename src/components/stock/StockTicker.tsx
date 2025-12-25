import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StockTickerProps {
    symbol: string;
    name?: string;
    price: string | number;
    change: number;
    changePercent?: number;
    trendData?: number[]; // Simple array of numbers for sparkline
    color?: string;
}

export function StockTicker({
    symbol,
    name,
    price,
    change,
    changePercent,
    trendData = [10, 15, 13, 20, 18, 25, 22, 30], // Default mock data
    color
}: StockTickerProps) {
    const isPositive = change >= 0;
    const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
    const trendColor = color ? color : isPositive ? "#10b981" : "#f43f5e";
    const chartData = trendData.map((val, i) => ({ i, val }));

    return (
        <Card className="p-4 relative overflow-hidden bg-[#0a0f1c] border-white/10 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{symbol}</h3>
                    {name && <p className="text-xs text-slate-400 truncate max-w-[120px]">{name}</p>}
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{change > 0 ? '+' : ''}{change} ({changePercent}%)</span>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">
                    {typeof price === 'number' ? `$${price.toFixed(2)}` : price}
                </div>

                {/* Mini Sparkline */}
                <div className="h-10 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="val"
                                stroke={trendColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
}
