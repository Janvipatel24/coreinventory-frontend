import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Warehouses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', address: '' });

  const load = () => api.warehouses.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', code: '', address: '' }); setModal(true); };
  const openEdit = (w) => { setEditing(w); setForm({ name: w.name, code: w.code, address: w.address || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.warehouses.update(editing._id, form);
        toast.success('Warehouse updated');
      } else {
        await api.warehouses.create(form);
        toast.success('Warehouse created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this warehouse?')) return;
    try {
      await api.warehouses.delete(id);
      toast.success('Warehouse deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Warehouses</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium">Add warehouse</button>
      </div>
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 text-left text-sm text-slate-600">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3 w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((w) => (
                <tr key={w._id} className="border-t border-surface-100">
                  <td className="px-5 py-3 font-medium">{w.name}</td>
                  <td className="px-5 py-3 font-mono">{w.code}</td>
                  <td className="px-5 py-3 text-slate-500">{w.address || '-'}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openEdit(w)} className="text-brand-600 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete(w._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="px-5 py-8 text-slate-500 text-center">No warehouses yet.</p>}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit warehouse' : 'New warehouse'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 border border-surface-200 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-brand-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
