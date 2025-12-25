'use client';

import { useState, useCallback } from 'react';
import { parseCSV, parseJSONData, createDataSource, SAMPLE_DATASETS, DataSource, DataColumn } from '@/lib/data/types';
import { FileText, Upload, Database, FileSpreadsheet } from 'lucide-react';

interface DataPanelProps {
    onDataLoaded: (source: DataSource, prompt: string) => void;
}

// PDF parsing via API (server-side)
async function parsePDF(file: File): Promise<{ text: string; pages: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse PDF');
    }

    const data = await response.json();
    return { text: data.text, pages: data.pages };
}

export default function DataPanel({ onDataLoaded }: DataPanelProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('sample');
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewData, setPreviewData] = useState<{ columns: DataColumn[], data: any[], type: string, pdfInfo?: { pages: number, textPreview: string } } | null>(null);

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setIsLoading(true);

        try {
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            let parsed: { columns: DataColumn[], data: Record<string, any>[] };
            let sourceType: DataSource['type'];
            let rawText: string | undefined;
            let pdfInfo: { pages: number, textPreview: string } | undefined;

            if (file.name.endsWith('.csv')) {
                const text = await file.text();
                parsed = parseCSV(text);
                sourceType = 'csv';
            } else if (file.name.endsWith('.json')) {
                const text = await file.text();
                parsed = parseJSONData(text);
                sourceType = 'json';
            } else if (file.name.endsWith('.pdf')) {
                const { text, pages } = await parsePDF(file);
                rawText = text;

                // For PDFs, we create a simple structure that tells the AI about the file
                parsed = {
                    columns: [
                        { name: 'file_name', type: 'string' as const, sampleValues: [fileName] },
                        { name: 'page_count', type: 'number' as const, sampleValues: [pages] }
                    ],
                    data: [{ file_name: fileName, page_count: pages }]
                };

                sourceType = 'pdf';
                pdfInfo = { pages, textPreview: `PDF file: ${fileName} (${pages} pages)` };
            } else {
                throw new Error('Unsupported file type. Please use CSV, JSON, or PDF.');
            }

            setPreviewData({ ...parsed, type: sourceType, pdfInfo });

            const source: DataSource = {
                id: Math.random().toString(36).substring(2, 9),
                name: fileName,
                type: sourceType,
                columns: parsed.columns,
                data: parsed.data,
                createdAt: new Date(),
                rowCount: parsed.data.length,
                rawText
            };

            // Generate appropriate prompt based on file type
            let prompt: string;
            if (sourceType === 'pdf') {
                if (parsed.data.length > 1) {
                    const columnNames = parsed.columns.map(c => c.name).join(', ');
                    prompt = `Create a dashboard for this ${fileName} PDF data with columns: ${columnNames}. Visualize the data with appropriate charts.`;
                } else {
                    prompt = `Analyze this PDF document "${fileName}" and create a dashboard summarizing its key information. The document has ${pdfInfo?.pages} pages. Here's a preview of the content: ${pdfInfo?.textPreview?.slice(0, 300)}...`;
                }
            } else {
                const columnNames = parsed.columns.map(c => c.name).join(', ');
                const numericColumns = parsed.columns.filter(c => c.type === 'number').map(c => c.name);
                prompt = `Create a dashboard for this ${fileName} data with columns: ${columnNames}. ${numericColumns.length > 0 ? `Focus on visualizing ${numericColumns.join(' and ')} with appropriate charts.` : ''}`;
            }

            onDataLoaded(source, prompt);
        } catch (err: any) {
            setError(err.message || 'Failed to parse file');
        } finally {
            setIsLoading(false);
        }
    }, [onDataLoaded]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleSampleData = useCallback((sampleKey: keyof typeof SAMPLE_DATASETS) => {
        const sample = SAMPLE_DATASETS[sampleKey];
        const data = sample.data as Record<string, any>[];
        const columns: DataColumn[] = Object.keys(data[0]).map(name => ({
            name,
            type: typeof data[0][name] === 'number' ? 'number' : 'string',
            sampleValues: data.slice(0, 3).map(row => row[name])
        }));

        const source = createDataSource(sample.name, 'json', columns, data);
        const numericCols = columns.filter(c => c.type === 'number').map(c => c.name);
        const prompt = `Create a dashboard for ${sample.name.toLowerCase()} showing ${numericCols.join(', ')} across ${columns[0].name}`;

        onDataLoaded(source, prompt);
    }, [onDataLoaded]);

    return (
        <div className="space-y-3">
            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('sample')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'sample'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Database className="w-3.5 h-3.5" />
                    Sample
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'upload'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                </button>
            </div>

            {/* Sample Data Tab */}
            {activeTab === 'sample' && (
                <div className="space-y-2">
                    {Object.entries(SAMPLE_DATASETS).map(([key, sample]) => (
                        <button
                            key={key}
                            onClick={() => handleSampleData(key as keyof typeof SAMPLE_DATASETS)}
                            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all"
                        >
                            <div className="font-medium text-white text-sm">{sample.name}</div>
                            <div className="text-xs text-gray-500">
                                {sample.data.length} rows • {Object.keys(sample.data[0]).length} columns
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <div>
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-white/20 hover:border-white/30'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Processing file...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center gap-2 mb-3">
                                    <FileSpreadsheet className="w-8 h-8 text-cyan-400" />
                                    <FileText className="w-8 h-8 text-purple-400" />
                                </div>
                                <p className="text-gray-400 text-sm mb-2">Drag & drop your file</p>
                                <p className="text-xs text-gray-500 mb-3">or</p>
                                <label className="px-4 py-2 btn-primary text-white text-sm rounded-lg cursor-pointer transition-all">
                                    Browse Files
                                    <input
                                        type="file"
                                        accept=".csv,.json,.pdf"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-600 mt-3">CSV, JSON, and PDF supported</p>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Data Preview */}
            {previewData && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        {previewData.type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-purple-400" />
                        ) : (
                            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                        )}
                        <h4 className="text-sm font-medium text-gray-300">
                            {previewData.type === 'pdf' ? 'PDF Analysis' : 'Data Preview'}
                        </h4>
                    </div>

                    {previewData.type === 'pdf' && previewData.pdfInfo ? (
                        <div className="text-xs text-gray-500 space-y-2">
                            <div>
                                <span className="font-medium text-white">{previewData.pdfInfo.pages}</span> page{previewData.pdfInfo.pages !== 1 ? 's' : ''} detected
                            </div>
                            <div className="p-2 bg-white/5 rounded text-gray-400 max-h-20 overflow-y-auto">
                                {previewData.pdfInfo.textPreview}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-xs text-gray-500">
                                <span className="font-medium text-white">{previewData.data.length}</span> rows •
                                <span className="font-medium text-white ml-1">{previewData.columns.length}</span> columns
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {previewData.columns.map(col => (
                                    <span
                                        key={col.name}
                                        className={`px-2 py-0.5 text-xs rounded ${col.type === 'number' ? 'bg-cyan-500/20 text-cyan-400' :
                                            col.type === 'date' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-white/10 text-gray-400'
                                            }`}
                                    >
                                        {col.name}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
