import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [inventoryValue, setInventoryValue] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.dashboard().catch(() => null),
      api.analytics.inventoryValue().catch(() => ({})),
    ]).then(([d, v]) => {
      setDashboard(d);
      setInventoryValue(v);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Products</p>
          <p className="text-2xl font-bold">{dashboard?.productCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Total units in stock</p>
          <p className="text-2xl font-bold">{dashboard?.totalStockValue ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Low stock items</p>
          <p className="text-2xl font-bold text-amber-600">{dashboard?.lowStockCount ?? 0}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Stock by warehouse</h2>
        {Object.entries(inventoryValue).map(([name, data]) => (
          <div key={name} className="flex justify-between py-1">
            <span>{name}</span>
            <span className="font-mono">{data?.quantity ?? 0} units ({data?.items ?? 0} items)</span>
          </div>
        ))}
        {Object.keys(inventoryValue).length === 0 && <p className="text-slate-500">No data.</p>}
      </div>
    </div>
  );
}
