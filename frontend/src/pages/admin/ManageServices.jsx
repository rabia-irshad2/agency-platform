import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './Dashboard';
import api from '../../api/axios';

const EMPTY = { title: '', description: '', icon: '⚡', price: 'Custom', features: [], is_active: true };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [featInput, setFeatInput] = useState('');

  const load = () => api.get('/services/all').then(r => setServices(r.data.data || []));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setFeatInput(''); setModal('create'); };
  const openEdit   = (s) => { setForm({ ...s }); setFeatInput(''); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const addFeature = () => {
    if (!featInput.trim()) return;
    setForm(f => ({ ...f, features: [...f.features, featInput.trim()] }));
    setFeatInput('');
  };
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description are required'); return; }
    setLoading(true);
    try {
      if (modal === 'create') { await api.post('/services', form); toast.success('Service created!'); }
      else { await api.put(`/services/${form.id}`, form); toast.success('Service updated!'); }
      closeModal(); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving service'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.value ?? e }));

  return (
    <AdminLayout title="Manage Services">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{services.length} services</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
            <Plus size={16} /> Add Service
          </button>
        </div>

        <div className="card overflow-hidden">
          {services.length === 0 ? (
            <p className="text-center py-16 text-white/30">No services yet. Click "Add Service" to create one.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4 hidden md:table-cell">Price</th>
                  <th className="text-left p-4 hidden lg:table-cell">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <p className="text-white font-medium">{s.title}</p>
                          <p className="text-white/40 text-xs line-clamp-1 max-w-xs">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell"><span className="tag">{s.price}</span></td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-white/40 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-white font-semibold">{modal === 'create' ? 'Create Service' : 'Edit Service'}</h3>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="label">Title *</label>
                  <input className="input" placeholder="Service name" value={form.title} onChange={set('title')} />
                </div>
                <div>
                  <label className="label">Icon</label>
                  <input className="input text-center text-2xl" value={form.icon} onChange={set('icon')} maxLength={4} />
                </div>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input resize-none h-24" value={form.description} onChange={set('description')} placeholder="Service description..." />
              </div>
              <div>
                <label className="label">Price</label>
                <input className="input" placeholder="e.g. $2,000+ or Contact Us" value={form.price} onChange={set('price')} />
              </div>
              <div>
                <label className="label">Features</label>
                <div className="flex gap-2 mb-2">
                  <input className="input flex-1" placeholder="Add a feature..." value={featInput} onChange={e => setFeatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <button onClick={addFeature} className="btn-primary py-2 px-3 text-sm"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs px-3 py-1 rounded-full">
                      {f}
                      <button onClick={() => removeFeature(i)} className="hover:text-white ml-1"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-brand-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-white/60 text-sm">Active (visible on website)</span>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/5">
              <button onClick={closeModal} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 justify-center">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={16} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}