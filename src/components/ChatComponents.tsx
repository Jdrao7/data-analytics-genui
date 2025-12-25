'use client';

import { BarChart3, Table2, FileText, Bot, User, Copy, Check, Sparkles, PieChart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function TypingIndicator() {
    return (
        <div className="flex items-start gap-4 animate-fade-in-up">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg glow-cyan-sm">
                <Bot className="w-5 h-5 text-white" />
            </div>

            {/* Message Bubble */}
            <div className="max-w-[85%]">
                <div className="glass border border-white/10 rounded-2xl rounded-tl-md px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                        </div>
                        <span className="text-sm text-slate-400">Generating your dashboard...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const [copied, setCopied] = useState(false);
    const isUser = role === 'user';

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "flex items-start gap-4 animate-fade-in-up",
            isUser && "flex-row-reverse"
        )}>
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                isUser
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                    : "bg-gradient-to-br from-cyan-400 to-blue-500 glow-cyan-sm"
            )}>
                {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            {/* Message Content */}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {/* Sender & Time */}
                <div className={cn("flex items-center gap-2 mb-1.5", isUser && "flex-row-reverse")}>
                    <span className="text-sm font-medium text-slate-300">
                        {isUser ? 'You' : 'GenUI'}
                    </span>
                    {timestamp && (
                        <span className="text-xs text-slate-600">
                            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                    "group relative rounded-2xl px-5 py-3.5 shadow-lg w-fit",
                    isUser
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-tr-md"
                        : "glass border border-white/10 text-slate-100 rounded-tl-md"
                )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "absolute -bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-all",
                            "px-2 py-1 rounded-md text-xs flex items-center gap-1",
                            isUser
                                ? "bg-white/20 hover:bg-white/30 text-white"
                                : "bg-white/5 hover:bg-white/10 text-slate-400"
                        )}
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ComponentPalette({ onAdd }: { onAdd: (type: string) => void }) {
    const components = [
        { type: 'chart', icon: <BarChart3 className="w-4 h-4" />, label: 'Chart', description: 'Add visualization' },
        { type: 'kpi', icon: <TrendingUp className="w-4 h-4" />, label: 'KPI Card', description: 'Show metrics' },
        { type: 'table', icon: <Table2 className="w-4 h-4" />, label: 'Table', description: 'Display data' },
        { type: 'text', icon: <FileText className="w-4 h-4" />, label: 'Text', description: 'Add description' },
    ];

    return (
        <div className="glass border border-white/5 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-3 font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Quick Add Components
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {components.map(comp => (
                    <button
                        key={comp.type}
                        onClick={() => onAdd(comp.type)}
                        className="group flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 rounded-xl transition-all hover:scale-[1.02]"
                    >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 transition-colors">
                            {comp.icon}
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                            {comp.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
