'use client';

import { useState } from 'react';

interface SaveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description?: string) => void;
    initialName?: string;
    initialDescription?: string;
    mode?: 'save' | 'edit';
}

export default function SaveDialog({
    isOpen,
    onClose,
    onSave,
    initialName = '',
    initialDescription = '',
    mode = 'save'
}: SaveDialogProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name.trim(), description.trim() || undefined);
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
                <h2 className="text-xl font-bold text-white mb-6">
                    {mode === 'save' ? '💾 Save Dashboard' : '✏️ Edit Dashboard'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Dashboard Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Q4 Sales Report"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this dashboard..."
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {mode === 'save' ? 'Save' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
