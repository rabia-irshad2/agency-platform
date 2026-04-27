import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './Dashboard';
import api from '../../api/axios';

const CATS = ['Web Development', 'Mobile Development', 'Brand Identity', 'Digital Marketing', 'UI/UX Design', 'Other'];
const EMPTY = { title:'', description:'', category:'Web Development', image_url:'', client_name:'', project_url:'', tags:[], is_featured:false };

export default function ManagePortfolio() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const load = () => api.get('/portfolio').then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setTagInput(''); setModal('create'); };
  const openEdit   = (p) => { setForm({ ...p }); setTagInput(''); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const addTag = () => { if (!tagInput.trim()) return; setForm(f => ({ ...f, tags: [...new Set([...f.tags, tagInput.trim()])] })); setTagInput(''); };
  const removeTag = (t) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.category) { toast.error('Required fields missing'); return; }
    setLoading(true);
    try {
      if (modal === 'create') { await api.post('/portfolio', form); toast.success('Project added!'); }
      else { await api.put(`/portfolio/${form.id}`, form); toast.success('Updated!'); }
      closeModal(); load();
    } catch { toast.error('Error saving project'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/portfolio/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.value ?? e }));

  return (
    <AdminLayout title="Manage Portfolio">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{items.length} projects</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> Add Project</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="card p-5 group">
              <div className="h-32 bg-gradient-to-br from-brand-500/15 to-purple-500/10 rounded-xl mb-4 flex items-center justify-center">
                {p.is_featured && <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">Featured</span>}
              </div>
              <span className="tag text-xs mb-2 inline-block">{p.category}</span>
              <h3 className="text-white font-semibold mb-1 truncate">{p.title}</h3>
              <p className="text-white/40 text-xs mb-3">{p.client_name}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {p.tags?.slice(0,3).map((t,i) => <span key={i} className="tag text-xs">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="btn-outline text-xs py-1.5 px-3 flex-1 justify-center"><Pencil size={13} /> Edit</button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && <p className="text-center py-20 text-white/30">No portfolio projects yet.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-white font-semibold">{modal === 'create' ? 'Add Project' : 'Edit Project'}</h3>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label">Title *</label><input className="input" placeholder="Project title" value={form.title} onChange={set('title')} /></div>
              <div><label className="label">Description *</label><textarea className="input resize-none h-24" placeholder="Project description..." value={form.description} onChange={set('description')} /></div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={set('category')}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">Client Name</label><input className="input" placeholder="Client company name" value={form.client_name} onChange={set('client_name')} /></div>
              <div><label className="label">Project URL</label><input className="input" placeholder="https://..." value={form.project_url} onChange={set('project_url')} /></div>
              <div>
                <label className="label">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input className="input flex-1" placeholder="Add tag..." value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <button onClick={addTag} className="btn-primary py-2 px-3"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(t => <span key={t} className="tag text-xs cursor-pointer flex items-center gap-1" onClick={() => removeTag(t)}>{t} <X size={10} /></span>)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_featured ? 'bg-brand-500' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.is_featured ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-white/60 text-sm">Featured project (shown on homepage)</span>
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