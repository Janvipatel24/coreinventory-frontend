import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Alerts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.alerts.lowStock().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading alerts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Low stock alerts</h1>
      <p className="text-slate-500 text-sm mb-6">Products at or below minimum stock level.</p>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-50 text-left text-sm">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Barcode</th>
              <th className="px-5 py-3">Current stock</th>
              <th className="px-5 py-3">Min stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 font-mono text-sm">{p.sku}</td>
                <td className="px-5 py-3 font-mono text-sm">{p.barcode || '-'}</td>
                <td className="px-5 py-3 text-amber-600 font-medium">{p.currentStock}</td>
                <td className="px-5 py-3">{p.minStock ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-slate-500">
            <p>No low stock alerts.</p>
            <Link to="/products" className="text-brand-600 hover:underline mt-2 inline-block">Manage products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
