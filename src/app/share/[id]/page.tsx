'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SharedDashboard } from '@/lib/sharing/share';
import { GenUIRenderer } from '@/genui/renderer';

export default function SharePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [dashboard, setDashboard] = useState<SharedDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isEmbed = searchParams.get('embed') === 'true';
    const shareId = params.id as string;

    useEffect(() => {
        async function fetchDashboard() {
            if (!shareId) return;

            try {
                const response = await fetch(`/api/share/${shareId}`);

                if (response.status === 404) {
                    setError('Dashboard not found or link has expired.');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to load dashboard');
                }

                const data = await response.json();
                setDashboard({
                    shareId: data.shareId,
                    name: data.name,
                    schema: data.schema,
                    createdAt: data.createdAt,
                    viewCount: data.viewCount,
                });
            } catch (err) {
                console.error('Error loading shared dashboard:', err);
                setError('Failed to load dashboard. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, [shareId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center max-w-md p-8">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Dashboard Not Found</h1>
                    <p className="text-slate-400 mb-6">
                        {error || 'This shared dashboard could not be loaded.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
                    >
                        Go to GenUI →
                    </a>
                </div>
            </div>
        );
    }

    // Embed mode - minimal UI
    if (isEmbed) {
        return (
            <div className="p-4 bg-slate-900 min-h-screen">
                <GenUIRenderer ui={dashboard.schema} />
            </div>
        );
    }

    // Full page view
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">{dashboard.name}</h1>
                        <p className="text-sm text-slate-400">
                            Shared dashboard • {dashboard.viewCount} view{dashboard.viewCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href="/chat"
                            className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                            Create Your Own →
                        </a>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden">
                    <div className="p-4">
                        <GenUIRenderer ui={dashboard.schema} />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-500 text-sm">
                    Built with <a href="/" className="text-cyan-400 hover:underline">GenUI Dashboard Builder</a>
                </div>
            </div>
        </div>
    );
}
