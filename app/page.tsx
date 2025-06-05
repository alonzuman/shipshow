'use client';

import { useState } from 'react';
import type { MarketingPackage } from './lib/workflow';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketingPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate marketing package');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">ShipShow AI Marketing Agency</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter product URL"
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            >
              {loading ? 'Generating...' : 'Generate Marketing Package'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-8 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p>{result.productInfo.name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Target Audience</h3>
                  <p>{result.productInfo.targetAudience}</p>
                </div>
                <div>
                  <h3 className="font-medium">Tone</h3>
                  <p>{result.productInfo.tone}</p>
                </div>
                <div>
                  <h3 className="font-medium">Summary</h3>
                  <p>{result.productInfo.summary}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Platform Content</h2>
              <div className="space-y-6">
                {Object.entries(result.scripts).map(([platform, script]) => (
                  <div key={platform} className="border rounded p-4">
                    <h3 className="text-xl font-medium mb-2 capitalize">{platform}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Script</h4>
                        <p className="whitespace-pre-wrap">{script}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Audio</h4>
                        <audio controls src={result.audio[platform]} className="w-full" />
                      </div>
                      <div>
                        <h4 className="font-medium">Video</h4>
                        <video controls src={result.videos[platform]} className="w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
