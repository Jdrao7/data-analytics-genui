'use client';

import { useState } from 'react';
import { GenUIRenderer } from "@/genui/renderer";

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [uiData, setUiData] = useState<any>(null); // Use your specific UI schema type if available
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt) return;

    setIsLoading(true);
    setUiData(null); // Clear previous result

    try {
      const res = await fetch("/api/genui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate UI');
      }

      const uires = await res.json();
      setUiData(uires);

    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating the UI.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">GenUI Planner</h1>

      {/* Input Section */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the UI (e.g., A login page with email...)"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate UI'}
        </button>
      </div>

      {/* Output Section */}
      <div className="border border-gray-200 rounded-xl p-6 min-h-[400px] bg-gray-50 shadow-sm">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Scanning components...
          </div>
        )}

        {!isLoading && !uiData && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Enter a prompt to see the magic happen.
          </div>
        )}

        {/* The Renderer Component */}
        {!isLoading && uiData && (
          <div className="bg-white p-4 border rounded shadow-sm">
            {/* We pass the fetched data as a prop here */}
            <GenUIRenderer ui={uiData} />
          </div>
        )}
      </div>
    </div>
  );
}