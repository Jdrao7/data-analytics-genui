import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MarketSentimentProps {
    value: number; // 0 to 100
    label?: string; // e.g., "Extreme Fear", "Neutral", "Greed"
    title?: string;
}

export function MarketSentiment({ value, label, title = "Market Sentiment" }: MarketSentimentProps) {
    // Gauge data (semi-circle)
    const data = [
        { name: 'val', value: value },
        { name: 'rest', value: 100 - value }
    ];

    // Color interpolation based on value
    const getColor = (val: number) => {
        if (val < 25) return "#f43f5e"; // Extreme Fear (Red)
        if (val < 45) return "#f97316"; // Fear (Orange)
        if (val < 55) return "#eab308"; // Neutral (Yellow)
        if (val < 75) return "#84cc16"; // Greed (Light Green)
        return "#10b981"; // Extreme Greed (Green)
    };

    const color = getColor(value);

    // Initial needle rotation is -90deg (0), max is 90deg (100)
    // Actually, for a semi-circle Pie starting at 180 end at 0:
    // We just fill the pie portion.

    return (
        <Card className="p-6 flex flex-col items-center justify-center bg-[#0a0f1c] border-white/10 text-center">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">{title}</h3>

            <div className="relative w-48 h-24 mb-4">
                <ResponsiveContainer width="100%" height="200%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="val" fill={color} />
                            <Cell key="rest" fill="#1e293b" /> {/* Slate-800 for empty part */}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Value Text Overlay */}
                <div className="absolute inset-x-0 bottom-0 text-center">
                    <div className="text-4xl font-bold text-white leading-none">{value}</div>
                </div>
            </div>

            <div className="mt-2 text-lg font-semibold" style={{ color }}>{label || "Neutral"}</div>
            <div className="text-xs text-slate-500 mt-1">Fear & Greed Index</div>
        </Card>
    );
}
