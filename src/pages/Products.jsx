import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import BarcodeScanner from '../components/BarcodeScanner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [barcodeScan, setBarcodeScan] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', barcode: '', description: '', unit: 'pcs', minStock: 0 });

  const load = () => api.products.list().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', sku: '', barcode: '', description: '', unit: 'pcs', minStock: 0 });
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, barcode: p.barcode || '', description: p.description || '', unit: p.unit || 'pcs', minStock: p.minStock ?? 0 });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.products.update(editing._id, form);
        toast.success('Product updated');
      } else {
        await api.products.create(form);
        toast.success('Product created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.products.delete(id);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onBarcodeScanned = (barcode) => {
    setForm((f) => ({ ...f, barcode }));
    setBarcodeScan(false);
  };

  const lookupBarcode = async () => {
    const b = form.barcode?.trim();
    if (!b) return;
    try {
      const p = await api.products.byBarcode(b);
      setForm((f) => ({ ...f, name: p.name, sku: p.sku }));
      toast.success('Found: ' + p.name);
    } catch {
      toast('No product with this barcode');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Products</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => setBarcodeScan(true)} className="px-4 py-2 rounded-lg border border-surface-200 bg-white text-sm font-medium hover:bg-surface-50">
            Scan barcode
          </button>
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
            Add product
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 text-left text-sm text-slate-600">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Barcode</th>
                <th className="px-5 py-3">Unit</th>
                <th className="px-5 py-3">Min stock</th>
                <th className="px-5 py-3 w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-surface-100">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-sm">{p.sku}</td>
                  <td className="px-5 py-3 font-mono text-sm">{p.barcode || '-'}</td>
                  <td className="px-5 py-3">{p.unit || 'pcs'}</td>
                  <td className="px-5 py-3">{p.minStock ?? 0}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openEdit(p)} className="text-brand-600 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="px-5 py-8 text-slate-500 text-center">No products yet.</p>}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit product' : 'New product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Barcode</label>
                <div className="flex gap-2">
                  <input value={form.barcode} onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))} className="flex-1 px-3 py-2 border border-surface-200 rounded-lg" />
                  <button type="button" onClick={lookupBarcode} className="px-3 py-2 border rounded-lg text-sm">Lookup</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min stock</label>
                  <input type="number" min={0} value={form.minStock} onChange={(e) => setForm((f) => ({ ...f, minStock: Number(e.target.value) }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-brand-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {barcodeScan && <BarcodeScanner onClose={() => setBarcodeScan(false)} onScan={onBarcodeScanned} />}
    </div>
  );
}
