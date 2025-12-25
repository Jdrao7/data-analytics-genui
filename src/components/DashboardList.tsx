'use client';

import { useState, useEffect } from 'react';
import {
    getSavedDashboards,
    deleteDashboard,
    duplicateDashboard,
    exportDashboard,
    formatDate,
    SavedDashboard
} from '@/lib/dashboard/persistence';

interface DashboardListProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (schema: any) => void;
}

export default function DashboardList({ isOpen, onClose, onLoad }: DashboardListProps) {
    const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDashboards(getSavedDashboards());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredDashboards = dashboards.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteDashboard(id);
            setDashboards(getSavedDashboards());
        }
    };

    const handleDuplicate = (id: string) => {
        duplicateDashboard(id);
        setDashboards(getSavedDashboards());
    };

    const handleExport = (id: string, name: string) => {
        const json = exportDashboard(id);
        if (!json) return;
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoad = (schema: any) => {
        onLoad(schema);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] p-6 m-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">📂 Saved Dashboards</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dashboards..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-violet-500/50 transition-all"
                />

                {/* Dashboard List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredDashboards.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {dashboards.length === 0
                                ? 'No saved dashboards yet. Create one and click Save!'
                                : 'No dashboards match your search.'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredDashboards.map(dashboard => (
                                <div
                                    key={dashboard.id}
                                    className="p-4 border border-white/10 rounded-xl hover:border-violet-500/50 hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => handleLoad(dashboard.schema)}
                                        >
                                            <h3 className="font-medium text-white">{dashboard.name}</h3>
                                            {dashboard.description && (
                                                <p className="text-sm text-gray-400 mt-0.5">{dashboard.description}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Updated {formatDate(dashboard.updatedAt)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleLoad(dashboard.schema)}
                                                className="px-2 py-1 text-xs bg-violet-500/20 text-violet-400 rounded hover:bg-violet-500/30 transition-all"
                                                title="Load"
                                            >
                                                Open
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate(dashboard.id)}
                                                className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-all"
                                                title="Duplicate"
                                            >
                                                Copy
                                            </button>
                                            <button
                                                onClick={() => handleExport(dashboard.id, dashboard.name)}
                                                className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-all"
                                                title="Export"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dashboard.id, dashboard.name)}
                                                className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''} saved
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
