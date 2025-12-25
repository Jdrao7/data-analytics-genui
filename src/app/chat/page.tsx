'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GenUIRenderer } from "@/genui/renderer";
import { DASHBOARD_TEMPLATES } from "@/genui/prompts";
import DataPanel from "@/components/DataPanel/DataPanel";
import SaveDialog from "@/components/SaveDialog";
import ShareDialog from "@/components/ShareDialog";
import { ChatMessage, TypingIndicator } from "@/components/ChatComponents";
import { DataSource } from "@/lib/data/types";
import { saveDashboard, getSavedDashboards, deleteDashboard, SavedDashboard } from "@/lib/dashboard/persistence";
import {
  FolderOpen,
  Plus,
  BarChart3,
  Save,
  Share2,
  Download,
  Send,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Search,
  Trash2,
  Clock
} from "lucide-react";

type Message = {
  role: 'user' | 'assistant';
  content: string;
  ui?: any;
  timestamp?: Date;
};

export default function DashboardBuilder() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUI, setCurrentUI] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDataSource, setActiveDataSource] = useState<DataSource | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [dashboardName] = useState('My Dashboard');
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved dashboards
  useEffect(() => {
    setSavedDashboards(getSavedDashboards());
  }, [showSaveDialog]); // Refresh when save dialog closes

  const filteredDashboards = savedDashboards.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleGenerate(customPrompt?: string) {
    const inputPrompt = customPrompt || prompt;
    if (!inputPrompt) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: inputPrompt, timestamp: new Date() }]);

    try {
      const isRefine = currentUI && !customPrompt;
      const res = await fetch("/api/genui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputPrompt,
          currentSchema: isRefine ? currentUI : undefined,
          action: isRefine ? "refine" : "generate"
        }),
      });

      if (!res.ok) throw new Error('Failed to generate');
      const ui = await res.json();
      setCurrentUI(ui);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Dashboard updated!', ui, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  }

  function handleSave(name: string, description?: string) {
    if (!currentUI) return;
    saveDashboard(name, currentUI, description);
    setShowSaveDialog(false);
    setSavedDashboards(getSavedDashboards());
  }

  function handleLoadDashboard(schema: any) {
    setCurrentUI(schema);
    setMessages([{ role: 'assistant', content: 'Loaded your saved dashboard.', ui: schema, timestamp: new Date() }]);
  }

  function handleDeleteDashboard(id: string, name: string) {
    if (confirm(`Delete "${name}"?`)) {
      deleteDashboard(id);
      setSavedDashboards(getSavedDashboards());
    }
  }

  function handleReset() {
    setMessages([]);
    setCurrentUI(null);
    setActiveDataSource(null);
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0f1c] overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-xl shrink-0">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                Gen<span className="text-cyan-400">UI</span>
              </span>
            </Link>
            {activeDataSource && (
              <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {activeDataSource.name}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentUI && (
              <button onClick={handleReset} className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Three Pane Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">

        {/* Left Pane - Chat */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-r border-white/5 bg-[#0a0f1c]/50 backdrop-blur-sm shrink-0">

          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Chat</span>
            <span className="text-xs text-slate-500 ml-auto">{messages.length} messages</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              // Empty State - Template Suggestions
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">AI Dashboard Builder</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">Start Building</h2>
                  <p className="text-sm text-slate-500">Choose a template or describe your dashboard</p>
                </div>

                {/* Templates as Chips */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Quick Start</span>
                  <div className="flex flex-wrap gap-2">
                    {DASHBOARD_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleGenerate(template.prompt)}
                        disabled={isLoading}
                        className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all disabled:opacity-50"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Upload */}
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                    Upload Data
                  </h3>
                  <DataPanel onDataLoaded={(source, dataPrompt) => {
                    setActiveDataSource(source);
                    handleGenerate(dataPrompt);
                  }} />
                </div>
              </div>
            ) : (
              // Messages
              <>
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
          </div>

          {/* Input Area - Fixed at bottom of chat pane */}
          <div className="p-4 border-t border-white/5 bg-[#0a0f1c]/80 backdrop-blur-sm">
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentUI ? "Describe changes..." : "Describe your dashboard..."}
                className="flex-1 px-4 py-2.5 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                disabled={isLoading}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Pane - Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Preview Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-[#0a0f1c]/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">Preview</span>
              {currentUI && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live</span>
              )}
            </div>
            {currentUI && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const json = JSON.stringify(currentUI, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'dashboard.json';
                    a.click();
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-3 py-1.5 text-xs text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="px-3 py-1.5 text-xs text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>
            )}
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-[#080c16]">
            {currentUI ? (
              <div className="min-h-full">
                <GenUIRenderer ui={currentUI} />
              </div>
            ) : (
              // Empty State
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5">
                    <LayoutDashboard className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No Dashboard Yet</h3>
                  <p className="text-slate-600 text-sm">
                    Use the chat panel to describe your dashboard or choose a template to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Saved Dashboards */}
        <div className="hidden xl:flex w-[260px] 2xl:w-[280px] flex-col border-l border-white/5 bg-[#0a0f1c]/50 backdrop-blur-sm shrink-0">

          {/* Saved Header */}
          <div className="p-4 border-b border-white/5">
            <Link href="/chat" onClick={handleReset} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-500/20">
              <Plus className="w-4 h-4" />
              New Dashboard
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
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

          {/* Dashboards List */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="flex items-center gap-2 px-2 mb-3">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Saved Dashboards</p>
            </div>

            {filteredDashboards.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <LayoutDashboard className="w-6 h-6 text-slate-600" />
                </div>
                <div className="text-slate-500 text-sm">
                  {savedDashboards.length === 0 ? 'No saved dashboards yet' : 'No matches found'}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredDashboards.map(dash => (
                  <div
                    key={dash.id}
                    className="group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-white/5 border border-transparent hover:border-cyan-500/20"
                    onClick={() => handleLoadDashboard(dash.schema)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                        {dash.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <p className="text-xs text-slate-600">{new Date(dash.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dash.id, dash.name);
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
              {savedDashboards.length} dashboard{savedDashboards.length !== 1 ? 's' : ''} saved
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SaveDialog isOpen={showSaveDialog} onClose={() => setShowSaveDialog(false)} onSave={handleSave} />
      <ShareDialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} dashboardName={dashboardName} dashboardSchema={currentUI} />
    </div>
  );
}