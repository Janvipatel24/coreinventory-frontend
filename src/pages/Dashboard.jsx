import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics
      .dashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (!data) return <p className="text-red-600">Failed to load dashboard.</p>;

  const cards = [
    { label: 'Products', value: data.productCount, to: '/products' },
    { label: 'Total units', value: data.totalStockValue, to: '/products' },
    { label: 'Receipts', value: data.receiptsCount, to: '/receipts' },
    { label: 'Deliveries', value: data.deliveriesCount, to: '/deliveries' },
    { label: 'Low stock', value: data.lowStockCount, to: '/alerts' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all"
          >
            <p className="text-sm text-slate-500 font-medium">{c.label}</p>
            <p className="text-2xl font-bold text-surface-900 mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <h2 className="px-5 py-4 border-b border-surface-200 font-semibold">Quick links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 text-sm">
          <Link to="/products" className="text-brand-600 hover:underline">
            Manage products
          </Link>
          <Link to="/warehouses" className="text-brand-600 hover:underline">
            Manage warehouses
          </Link>
          <Link to="/ai-predictions" className="text-brand-600 hover:underline">
            View AI restocking suggestions
          </Link>
        </div>
      </div>
    </div>
  );
}

