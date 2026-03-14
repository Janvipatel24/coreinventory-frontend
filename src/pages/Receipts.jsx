import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Receipts() {
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ reference: '', warehouseId: '', note: '', lines: [{ productId: '', quantity: 1 }] });

  const load = () => {
    api.receipts.list().then(setList).catch(() => setList([]));
    api.products.list().then(setProducts).catch(() => setProducts([]));
    api.warehouses.list().then(setWarehouses).catch(() => setWarehouses([]));
  };
  useEffect(() => { load(); setLoading(false); }, []);

  const openCreate = () => {
    setForm({
      reference: 'RCP-' + Date.now(),
      warehouseId: warehouses[0]?._id || '',
      note: '',
      lines: [{ productId: products[0]?._id || '', quantity: 1 }],
    });
    setModal(true);
  };

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { productId: '', quantity: 1 }] }));
  const updateLine = (i, field, value) => {
    setForm((f) => ({
      ...f,
      lines: f.lines.map((l, j) => (j === i ? { ...l, [field]: field === 'quantity' ? Number(value) : value } : l)),
    }));
  };
  const removeLine = (i) => setForm((f) => ({ ...f, lines: f.lines.filter((_, j) => j !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.warehouseId || form.lines.some((l) => !l.productId || l.quantity < 1)) {
      toast.error('Fill warehouse and lines.');
      return;
    }
    try {
      await api.receipts.create(form);
      toast.success('Receipt created');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-brand-600 text-white">New receipt</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 text-left text-sm">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Warehouse</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-5 py-3">{r.reference}</td>
                  <td className="px-5 py-3">{r.warehouseId?.name || '-'}</td>
                  <td className="px-5 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="px-5 py-8 text-center text-slate-500">No receipts.</p>}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">New receipt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reference</label>
                <input value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Warehouse</label>
                <select value={form.warehouseId} onChange={(e) => setForm((f) => ({ ...f, warehouseId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select</option>
                  {warehouses.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lines</label>
                {form.lines.map((line, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select value={line.productId} onChange={(e) => updateLine(i, 'productId', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" required>
                      <option value="">Product</option>
                      {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)} className="w-24 px-3 py-2 border rounded-lg" />
                    <button type="button" onClick={() => removeLine(i)} className="text-red-600">×</button>
                  </div>
                ))}
                <button type="button" onClick={addLine} className="text-sm text-brand-600">+ Add line</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
