'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart } from 'lucide-react';

export default function Hero3DScene() {
    const [mounted, setMounted] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMouseX(x);
            setMouseY(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto perspective-2000">
            {/* Glow Effect Behind Dashboard */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-[100px] rounded-full animate-pulse-glow" />

            {/* 3D Dashboard Container */}
            <div
                className="relative preserve-3d transition-transform duration-300 ease-out"
                style={{
                    transform: mounted
                        ? `rotateX(${12 - mouseY * 0.5}deg) rotateY(${-6 + mouseX * 0.5}deg)`
                        : 'rotateX(12deg) rotateY(-6deg)'
                }}
            >
                {/* Main Dashboard */}
                <div className={`
                    relative glass rounded-2xl p-6 shadow-2xl
                    transition-all duration-700
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    {/* Window Controls */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-3 text-xs text-slate-500">analytics-dashboard.app</span>
                    </div>

                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-semibold text-lg">Sales Analytics</h3>
                            <p className="text-slate-400 text-sm">Real-time performance metrics</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-xs">Live</span>
                        </div>
                    </div>

                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <KPICard
                            icon={<DollarSign className="w-4 h-4" />}
                            label="Revenue"
                            value="$142.5K"
                            change="+12.5%"
                            positive
                            delay={100}
                            mounted={mounted}
                        />
                        <KPICard
                            icon={<Users className="w-4 h-4" />}
                            label="Users"
                            value="2,845"
                            change="+8.2%"
                            positive
                            delay={200}
                            mounted={mounted}
                        />
                        <KPICard
                            icon={<Activity className="w-4 h-4" />}
                            label="Sessions"
                            value="18.2K"
                            change="+24.1%"
                            positive
                            delay={300}
                            mounted={mounted}
                        />
                        <KPICard
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Conversion"
                            value="3.24%"
                            change="-2.1%"
                            positive={false}
                            delay={400}
                            mounted={mounted}
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Line Chart Mock */}
                        <div
                            className={`col-span-2 bg-slate-800/50 rounded-xl p-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                            style={{ transitionDelay: '500ms' }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm text-white font-medium">Revenue Trend</span>
                                </div>
                                <span className="text-xs text-slate-500">Last 7 days</span>
                            </div>
                            {/* Animated Chart Bars */}
                            <div className="flex items-end gap-2 h-24">
                                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t transition-all duration-700 ease-out"
                                        style={{
                                            height: mounted ? `${height}%` : '0%',
                                            background: 'linear-gradient(to top, #06b6d4, #3b82f6)',
                                            transitionDelay: `${600 + i * 100}ms`
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <span key={day} className="text-[10px] text-slate-500">{day}</span>
                                ))}
                            </div>
                        </div>

                        {/* Pie Chart Mock */}
                        <div
                            className={`bg-slate-800/50 rounded-xl p-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                            style={{ transitionDelay: '700ms' }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <PieChart className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-white font-medium">Traffic</span>
                            </div>
                            {/* Donut Chart */}
                            <div className="relative w-20 h-20 mx-auto">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    <circle
                                        cx="18" cy="18" r="14"
                                        fill="none"
                                        stroke="#1e293b"
                                        strokeWidth="4"
                                    />
                                    <circle
                                        cx="18" cy="18" r="14"
                                        fill="none"
                                        stroke="#06b6d4"
                                        strokeWidth="4"
                                        strokeDasharray={mounted ? "45 100" : "0 100"}
                                        className="transition-all duration-1000"
                                        style={{ transitionDelay: '800ms' }}
                                    />
                                    <circle
                                        cx="18" cy="18" r="14"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="4"
                                        strokeDasharray={mounted ? "30 100" : "0 100"}
                                        strokeDashoffset="-45"
                                        className="transition-all duration-1000"
                                        style={{ transitionDelay: '900ms' }}
                                    />
                                    <circle
                                        cx="18" cy="18" r="14"
                                        fill="none"
                                        stroke="#8b5cf6"
                                        strokeWidth="4"
                                        strokeDasharray={mounted ? "25 100" : "0 100"}
                                        strokeDashoffset="-75"
                                        className="transition-all duration-1000"
                                        style={{ transitionDelay: '1000ms' }}
                                    />
                                </svg>
                            </div>
                            {/* Legend */}
                            <div className="flex flex-col gap-1 mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                    <span className="text-[10px] text-slate-400">Direct 45%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] text-slate-400">Organic 30%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-[10px] text-slate-400">Referral 25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div
                    className={`absolute -right-8 top-12 glass-cyan rounded-xl p-3 shadow-lg transition-all duration-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                        }`}
                    style={{
                        transitionDelay: '1100ms',
                        transform: 'translateZ(40px)'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400">Growth</p>
                            <p className="text-sm font-semibold text-emerald-400">+28.4%</p>
                        </div>
                    </div>
                </div>

                <div
                    className={`absolute -left-6 bottom-16 glass-cyan rounded-xl p-3 shadow-lg transition-all duration-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                        }`}
                    style={{
                        transitionDelay: '1200ms',
                        transform: 'translateZ(30px)'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400">Active Now</p>
                            <p className="text-sm font-semibold text-white">1,247</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({
    icon,
    label,
    value,
    change,
    positive,
    delay,
    mounted
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
    positive: boolean;
    delay: number;
    mounted: boolean;
}) {
    return (
        <div
            className={`bg-slate-800/50 rounded-lg p-3 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="text-cyan-400">{icon}</div>
                <span className="text-[10px] text-slate-400">{label}</span>
            </div>
            <p className="text-white font-semibold text-sm mb-1">{value}</p>
            <span className={`text-[10px] ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {change}
            </span>
        </div>
    );
}
