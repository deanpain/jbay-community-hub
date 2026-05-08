'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface BatchHistoryEntry {
  batchId: string;
  timestamp: string;
  submitted: number;
  accepted: number;
  rejected: number;
  retry: number;
  model: 'R1' | 'R10';
  estimatedCostCents: number;
}

interface WorkerMetrics {
  queueDepth: number;
  flushCount: number;
  lastSubmitted: number;
  accepted: number;
  rejected: number;
  retry: number;
  lastFlushAt?: string;
  batchHistory: BatchHistoryEntry[];
  totalCostCents: number;
}

export default function IdentityWorkerOps() {
  const [metrics, setMetrics] = useState<WorkerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flushing, setFlushing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/worker/metrics');
      const data = await res.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load worker metrics');
    } finally {
      setLoading(false);
    }
  };

  const triggerFlush = async () => {
    setFlushing(true);
    try {
      const res = await fetch('/api/worker/flush', { method: 'POST' });
      const data = await res.json();
      console.log('Flush result:', data);
      // Refresh metrics after flush
      await fetchMetrics();
    } catch (err) {
      setError('Failed to trigger batch flush');
    } finally {
      setFlushing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6">Loading identity worker metrics...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!metrics) return <div className="p-6">No metrics available</div>;

  // Prepare chart data: group by date and sum costs per model
  const chartData = metrics.batchHistory.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (entry.model === 'R1') {
        existing.R1Cost += entry.estimatedCostCents;
      } else {
        existing.R10Cost += entry.estimatedCostCents;
      }
      existing.totalBatches += 1;
    } else {
      acc.push({
        date,
        R1Cost: entry.model === 'R1' ? entry.estimatedCostCents : 0,
        R10Cost: entry.model === 'R10' ? entry.estimatedCostCents : 0,
        totalBatches: 1,
      });
    }
    return acc;
  }, [] as Array<{ date: string; R1Cost: number; R10Cost: number; totalBatches: number }>);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Identity Worker Ops Dashboard</h2>
        <button
          onClick={triggerFlush}
          disabled={flushing || metrics.queueDepth === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {flushing ? 'Flushing...' : 'Trigger Manual Batch'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Queue Depth</p>
          <p className="text-2xl font-bold text-blue-600">{metrics.queueDepth}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Batches</p>
          <p className="text-2xl font-bold text-green-600">{metrics.flushCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Cost ($)</p>
          <p className="text-2xl font-bold text-purple-600">${(metrics.totalCostCents / 100).toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Last Flush</p>
          <p className="text-sm font-medium text-yellow-600">
            {metrics.lastFlushAt ? new Date(metrics.lastFlushAt).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>

      {/* Cost Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Model (R1 vs R10)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Cost (cents)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="R1Cost" name="R1 Cost (cents)" fill="#3b82f6" />
              <Bar dataKey="R10Cost" name="R10 Cost (cents)" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Batch History Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Batch History (Last 100)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.batchHistory.slice().reverse().map((batch) => (
                <tr key={batch.batchId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{batch.batchId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(batch.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      batch.model === 'R1' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {batch.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.submitted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{batch.accepted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{batch.rejected}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{batch.retry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(batch.estimatedCostCents / 100).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
