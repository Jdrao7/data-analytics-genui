'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getSharedDashboard, SharedDashboard } from '@/lib/sharing/share';
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
        if (shareId) {
            const shared = getSharedDashboard(shareId);
            if (shared) {
                setDashboard(shared);
            } else {
                setError('Dashboard not found or link has expired.');
            }
            setLoading(false);
        }
    }, [shareId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md p-8">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Not Found</h1>
                    <p className="text-slate-600 mb-6">
                        {error || 'This shared dashboard could not be loaded.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
            <div className="p-4 bg-white min-h-screen">
                <GenUIRenderer ui={dashboard.schema} />
            </div>
        );
    }

    // Full page view
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{dashboard.name}</h1>
                        <p className="text-sm text-slate-500">
                            Shared dashboard • {dashboard.viewCount} view{dashboard.viewCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href="/chat"
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your Own →
                        </a>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4">
                        <GenUIRenderer ui={dashboard.schema} />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-400 text-sm">
                    Built with <a href="/" className="text-blue-500 hover:underline">GenUI Dashboard Builder</a>
                </div>
            </div>
        </div>
    );
}
