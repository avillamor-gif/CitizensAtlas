'use client';

import React, { useState } from 'react';
import { reindexAllFromSupabase } from '@/lib/algolia/indexing';

export default function AlgoliaReindexPage() {
  const [isReindexing, setIsReindexing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReindex = async () => {
    setIsReindexing(true);
    setError(null);
    setResult(null);

    try {
      const reindexResult = await reindexAllFromSupabase();
      setResult(reindexResult);
    } catch (err) {
      console.error('Reindex error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during reindexing');
    } finally {
      setIsReindexing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-brand-dark-blue mb-4">
            Algolia Reindex
          </h1>
          <p className="text-gray-600 mb-6">
            Click the button below to sync all your data from Supabase to Algolia search indices.
            This will clear existing indices and rebuild them from scratch.
          </p>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">⚠️ Before you start:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Make sure your Algolia credentials are set in .env.local</li>
              <li>This process may take a few moments depending on data size</li>
              <li>Existing search indices will be cleared and recreated</li>
            </ul>
          </div>

          <button
            onClick={handleReindex}
            disabled={isReindexing}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors ${
              isReindexing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-light-blue hover:bg-blue-600'
            }`}
          >
            {isReindexing ? 'Reindexing...' : 'Reindex All Data to Algolia'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Success!</h3>
              <p className="text-sm text-green-800 mb-3">
                All data has been successfully indexed to Algolia.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <div className="text-gray-600">Projects</div>
                  <div className="text-2xl font-bold text-brand-dark-blue">
                    {result.counts.projects}
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <div className="text-gray-600">News</div>
                  <div className="text-2xl font-bold text-brand-dark-blue">
                    {result.counts.news}
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <div className="text-gray-600">Publications</div>
                  <div className="text-2xl font-bold text-brand-dark-blue">
                    {result.counts.publications}
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <div className="text-gray-600">Videos</div>
                  <div className="text-2xl font-bold text-brand-dark-blue">
                    {result.counts.videos}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
              <p className="text-sm text-red-800">{error}</p>
              <p className="text-xs text-red-700 mt-2">
                Check the console for more details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
