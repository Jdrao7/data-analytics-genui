import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface WatchlistItem {
    symbol: string;
    name: string;
    price: number | string;
    change: number;
    changePercent: number;
    volume?: string;
    chartData?: number[]; // For mini area chart
}

interface StockWatchlistProps {
    title?: string;
    items: WatchlistItem[];
}

export function StockWatchlist({ title = "Watchlist", items }: StockWatchlistProps) {
    return (
        <Card className="bg-[#0a0f1c] border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            <div className="divide-y divide-white/5">
                {items.map((item, idx) => {
                    const isPositive = item.change >= 0;
                    const chartColor = isPositive ? "#10b981" : "#f43f5e"; // Emerald / Rose chart
                    const mockData = (item.chartData || [40, 35, 50, 45, 60, 55, 70]).map((v, i) => ({ i, v }));

                    return (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                            {/* Symbol & Name */}
                            <div className="w-1/4">
                                <div className="font-bold text-white">{item.symbol}</div>
                                <div className="text-xs text-slate-500 truncate">{item.name}</div>
                            </div>

                            {/* Mini Chart */}
                            <div className="w-1/4 h-8 opacity-70 group-hover:opacity-100 transition-all">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockData}>
                                        <defs>
                                            <linearGradient id={`grad${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="v"
                                            stroke={chartColor}
                                            fillOpacity={1}
                                            fill={`url(#grad${idx})`}
                                            strokeWidth={1.5}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Price */}
                            <div className="text-right w-1/4">
                                <div className="font-medium text-white">
                                    {typeof item.price === 'string' ? item.price : `$${item.price.toFixed(2)}`}
                                </div>
                            </div>

                            {/* Change */}
                            <div className={`text-right w-1/4 font-medium text-sm flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                <span>{isPositive ? '+' : ''}{item.changePercent}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
