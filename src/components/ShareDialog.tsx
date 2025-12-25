'use client';

import { useState } from 'react';
import { createShareLink, generateEmbedCode } from '@/lib/sharing/share';

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    dashboardName: string;
    dashboardSchema: any;
}

export default function ShareDialog({ isOpen, onClose, dashboardName, dashboardSchema }: ShareDialogProps) {
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState<'link' | 'embed' | null>(null);
    const [embedSize, setEmbedSize] = useState({ width: 800, height: 600 });
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCreateLink = async () => {
        setIsCreating(true);
        setError(null);
        try {
            const url = await createShareLink(dashboardName, dashboardSchema);
            setShareUrl(url);
        } catch (err) {
            console.error('Error creating share link:', err);
            setError('Failed to create share link. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = (text: string, type: 'link' | 'embed') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const embedCode = shareUrl ? generateEmbedCode(shareUrl, embedSize.width, embedSize.height) : '';

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">🔗 Share Dashboard</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition-colors"
                    >
                        ×
                    </button>
                </div>

                {!shareUrl ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-6">
                            Create a public link that anyone can use to view this dashboard.
                        </p>
                        {error && (
                            <p className="text-red-400 text-sm mb-4">{error}</p>
                        )}
                        <button
                            onClick={handleCreateLink}
                            disabled={isCreating}
                            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Creating...
                                </span>
                            ) : (
                                '🔗 Create Share Link'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Share Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Share Link
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                />
                                <button
                                    onClick={() => copyToClipboard(shareUrl, 'link')}
                                    className={`px-4 py-2 rounded-lg transition-all ${copied === 'link'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                                        }`}
                                >
                                    {copied === 'link' ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                            <a
                                href={shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-violet-400 hover:text-violet-300 mt-2 inline-block"
                            >
                                Open in new tab →
                            </a>
                        </div>

                        {/* Embed Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Embed Code
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="number"
                                    value={embedSize.width}
                                    onChange={(e) => setEmbedSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                                    className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                    placeholder="Width"
                                />
                                <span className="text-gray-500 self-center">×</span>
                                <input
                                    type="number"
                                    value={embedSize.height}
                                    onChange={(e) => setEmbedSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                                    className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                    placeholder="Height"
                                />
                            </div>
                            <div className="relative">
                                <textarea
                                    value={embedCode}
                                    readOnly
                                    rows={4}
                                    className="w-full px-3 py-2 bg-black/50 text-emerald-400 rounded-lg text-xs font-mono border border-white/10"
                                />
                                <button
                                    onClick={() => copyToClipboard(embedCode, 'embed')}
                                    className={`absolute top-2 right-2 px-3 py-1 rounded text-xs transition-all ${copied === 'embed'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    {copied === 'embed' ? '✓' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 text-sm text-violet-300">
                            <strong>Note:</strong> Anyone with this link can view the dashboard.
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
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
