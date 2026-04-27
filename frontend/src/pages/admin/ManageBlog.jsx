import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './Dashboard';
import api from '../../api/axios';

const EMPTY = { title: '', excerpt: '', content: '', category: 'General', tags: [], is_published: false, author: 'Admin' };
const CATS  = ['General', 'Technology', 'Design', 'Marketing', 'Business', 'Development'];

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const load = () => api.get('/blog/all').then(r => setPosts(r.data.data || []));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setTagInput(''); setModal('create'); };
  const openEdit   = (p) => { setForm({ ...p }); setTagInput(''); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm(f => ({ ...f, tags: [...new Set([...f.tags, tagInput.trim()])] }));
    setTagInput('');
  };
  const removeTag = (t) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.excerpt.trim()) {
      toast.error('Title, excerpt and content are required'); return;
    }
    setLoading(true);
    try {
      if (modal === 'create') { await api.post('/blog', form); toast.success('Post created!'); }
      else { await api.put(`/blog/${form.id}`, form); toast.success('Post updated!'); }
      closeModal(); load();
    } catch (e) { toast.error('Error saving post'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await api.delete(`/blog/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.value ?? e }));
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AdminLayout title="Manage Blog">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{posts.length} posts</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> New Post</button>
        </div>

        <div className="card overflow-hidden">
          {posts.length === 0 ? (
            <p className="text-center py-16 text-white/30">No blog posts yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left p-4">Post</th>
                  <th className="text-left p-4 hidden md:table-cell">Category</th>
                  <th className="text-left p-4 hidden lg:table-cell">Status</th>
                  <th className="text-left p-4 hidden lg:table-cell">Views</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium line-clamp-1">{p.title}</p>
                      <p className="text-white/30 text-xs">{fmt(p.created_at)}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell"><span className="tag text-xs">{p.category}</span></td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-white/50">{p.views}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-white/40 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
          <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-white font-semibold">{modal === 'create' ? 'New Blog Post' : 'Edit Post'}</h3>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" placeholder="Post title..." value={form.title} onChange={set('title')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category} onChange={set('category')}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Author</label>
                  <input className="input" value={form.author} onChange={set('author')} />
                </div>
              </div>
              <div>
                <label className="label">Excerpt *</label>
                <textarea className="input resize-none h-20" placeholder="Brief summary..." value={form.excerpt} onChange={set('excerpt')} />
              </div>
              <div>
                <label className="label">Content *</label>
                <textarea className="input resize-none h-48" placeholder="Write your post content here..." value={form.content} onChange={set('content')} />
              </div>
              <div>
                <label className="label">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input className="input flex-1" placeholder="Add tag..." value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <button onClick={addTag} className="btn-primary py-2 px-3 text-sm"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 tag text-xs cursor-pointer" onClick={() => removeTag(t)}>
                      {t} <X size={10} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_published ? 'bg-brand-500' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.is_published ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-white/60 text-sm">{form.is_published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/5">
              <button onClick={closeModal} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 justify-center">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={16} /> Save Post</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}