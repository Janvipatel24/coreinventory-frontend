import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function AIPredictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.ai.restockingPrediction().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading AI predictions...</p>;
  if (!data) return <p className="text-red-600">Failed to load predictions.</p>;

  const urgencyColor = (u) => {
    if (u === 'critical') return 'bg-red-100 text-red-800';
    if (u === 'high') return 'bg-amber-100 text-amber-800';
    if (u === 'medium') return 'bg-blue-100 text-blue-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AI restocking prediction</h1>
      <p className="text-slate-500 text-sm mb-6">Based on consumption and current stock. Generated: {new Date(data.generatedAt).toLocaleString()}</p>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-50 text-left text-sm">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Current</th>
              <th className="px-5 py-3">Min</th>
              <th className="px-5 py-3">Daily usage</th>
              <th className="px-5 py-3">Days until empty</th>
              <th className="px-5 py-3">Suggested order</th>
              <th className="px-5 py-3">Urgency</th>
            </tr>
          </thead>
          <tbody>
            {(data.predictions || []).map((p) => (
              <tr key={p.productId} className="border-t">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 font-mono text-sm">{p.sku}</td>
                <td className="px-5 py-3">{p.currentStock}</td>
                <td className="px-5 py-3">{p.minStock}</td>
                <td className="px-5 py-3">{p.dailyUsage}</td>
                <td className="px-5 py-3">{p.daysUntilEmpty}</td>
                <td className="px-5 py-3 font-mono">{p.suggestedOrderQty}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${urgencyColor(p.urgency)}`}>{p.urgency}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data.predictions || data.predictions.length === 0) && <p className="px-5 py-8 text-center text-slate-500">No predictions (add products and deliveries first).</p>}
      </div>
    </div>
  );
}
