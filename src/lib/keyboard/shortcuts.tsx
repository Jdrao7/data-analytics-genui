'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
    onGenerate?: () => void;
    onSave?: () => void;
    onNew?: () => void;
    onToggleTheme?: () => void;
    onOpenSaved?: () => void;
}

export function useKeyboardShortcuts({
    onGenerate,
    onSave,
    onNew,
    onToggleTheme,
    onOpenSaved,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for modifier key (Ctrl on Windows, Cmd on Mac)
            const isMod = e.ctrlKey || e.metaKey;

            if (!isMod) return;

            switch (e.key.toLowerCase()) {
                case 'enter':
                    e.preventDefault();
                    onGenerate?.();
                    break;
                case 's':
                    e.preventDefault();
                    onSave?.();
                    break;
                case 'n':
                    if (e.shiftKey) {
                        e.preventDefault();
                        onNew?.();
                    }
                    break;
                case 'd':
                    e.preventDefault();
                    onToggleTheme?.();
                    break;
                case 'o':
                    e.preventDefault();
                    onOpenSaved?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onGenerate, onSave, onNew, onToggleTheme, onOpenSaved]);
}

// Keyboard shortcuts help component
export function KeyboardShortcutsHelp() {
    const shortcuts = [
        { keys: ['Ctrl', 'Enter'], description: 'Generate dashboard' },
        { keys: ['Ctrl', 'S'], description: 'Save dashboard' },
        { keys: ['Ctrl', 'Shift', 'N'], description: 'New dashboard' },
        { keys: ['Ctrl', 'O'], description: 'Open saved' },
        { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
    ];

    return (
        <div className="text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium mb-2">Keyboard Shortcuts:</p>
            <div className="space-y-1">
                {shortcuts.map(({ keys, description }) => (
                    <div key={description} className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {keys.map((key, i) => (
                                <span key={i}>
                                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono">
                                        {key}
                                    </kbd>
                                    {i < keys.length - 1 && <span className="mx-0.5">+</span>}
                                </span>
                            ))}
                        </div>
                        <span>{description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
