import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function MoveHistory() {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [type, setType] = useState('');

  useEffect(() => {
    const params = { limit };
    if (type) params.type = type;
    api.moveHistory.list(params).then(setMoves).catch(() => setMoves([])).finally(() => setLoading(false));
  }, [limit, type]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Move history ledger</h1>
      <div className="flex gap-2 mb-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">All types</option>
          <option value="receipt">Receipt</option>
          <option value="delivery">Delivery</option>
          <option value="transfer">Transfer</option>
          <option value="adjustment">Adjustment</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 text-left text-sm">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Warehouse</th>
                <th className="px-5 py-3">To warehouse</th>
                <th className="px-5 py-3">Qty</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="px-5 py-3 text-sm">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-xs bg-brand-100 text-brand-800">{m.type}</span></td>
                  <td className="px-5 py-3">{m.productId?.name || '-'}</td>
                  <td className="px-5 py-3">{m.warehouseId?.name || '-'}</td>
                  <td className="px-5 py-3">{m.toWarehouseId?.name || '-'}</td>
                  <td className="px-5 py-3 font-mono">{m.quantity > 0 ? '+' : ''}{m.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {moves.length === 0 && <p className="px-5 py-8 text-center text-slate-500">No moves.</p>}
        </div>
      )}
    </div>
  );
}
