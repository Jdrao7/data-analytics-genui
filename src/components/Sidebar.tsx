'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedDashboards, deleteDashboard, formatDate, SavedDashboard } from '@/lib/dashboard/persistence';
import { Plus, Search, Trash2, BarChart3, Clock, Layout } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (schema: any) => void;
    currentDashboardId?: string;
}

export default function Sidebar({ isOpen, onClose, onLoad, currentDashboardId }: SidebarProps) {
    const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setDashboards(getSavedDashboards());
    }, [isOpen]);

    const filtered = dashboards.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete "${name}"?`)) {
            deleteDashboard(id);
            setDashboards(getSavedDashboards());
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0a0f1c] border-r border-white/5 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center p-4 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold">
                            Gen<span className="text-cyan-400">UI</span>
                        </span>
                    </Link>
                </div>

                {/* New Dashboard Button */}
                <div className="p-4">
                    <Link
                        href="/chat"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 btn-primary text-white font-medium rounded-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Dashboard
                    </Link>
                </div>

                {/* Search */}
                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search dashboards..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Saved Dashboards */}
                <div className="px-3 py-2 flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2 px-2 mb-3">
                        <Layout className="w-3.5 h-3.5 text-slate-500" />
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Saved Dashboards</p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                                <Layout className="w-6 h-6 text-slate-600" />
                            </div>
                            <div className="text-slate-500 text-sm">
                                {dashboards.length === 0 ? 'No saved dashboards yet' : 'No matches found'}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map(dash => (
                                <div
                                    key={dash.id}
                                    className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all ${currentDashboardId === dash.id
                                        ? 'bg-cyan-500/10 border border-cyan-500/20'
                                        : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                    onClick={() => {
                                        onLoad(dash.schema);
                                        onClose();
                                    }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${currentDashboardId === dash.id ? 'text-cyan-400' : 'text-white'
                                            }`}>
                                            {dash.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Clock className="w-3 h-3 text-slate-600" />
                                            <p className="text-xs text-slate-600">{formatDate(dash.updatedAt)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(dash.id, dash.name);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
                        {dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''} saved
                    </div>
                </div>
            </aside>
        </>
    );
}
