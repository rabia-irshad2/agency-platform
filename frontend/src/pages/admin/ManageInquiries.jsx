import { useState, useEffect } from 'react';
import { Mail, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './Dashboard';
import api from '../../api/axios';

const STATUS_OPTS = ['new', 'read', 'closed'];
const STATUS_COLORS = { new: 'badge-new tag', read: 'badge-read tag', closed: 'badge-closed tag' };

export default function ManageInquiries() {
  const [items, setItems]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = (status='') => api.get(`/inquiries${status ? `?status=${status}` : ''}`).then(r => setItems(r.data.data || []));
  useEffect(() => { load(filter); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}`, { status });
      setItems(items.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setItems(items.filter(i => i.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AdminLayout title="Client Inquiries">
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex gap-2">
          {['', 'new', 'read', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === s ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-white/50 hover:border-brand-500/40'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center py-12 text-white/30 text-sm">No inquiries found</p>
              ) : items.map(q => (
                <div key={q.id} onClick={() => setSelected(q)}
                  className={`p-4 cursor-pointer hover:bg-white/3 transition-colors ${selected?.id === q.id ? 'bg-white/5 border-l-2 border-l-brand-500' : ''}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-white text-sm font-medium truncate">{q.name}</p>
                    <span className={`${STATUS_COLORS[q.status]} text-xs shrink-0 ml-2`}>{q.status}</span>
                  </div>
                  <p className="text-white/40 text-xs truncate">{q.email}</p>
                  <p className="text-white/30 text-xs mt-1">{fmt(q.created_at)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-3 card p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/20">
                <Mail size={32} className="mb-3" />
                <p className="text-sm">Select an inquiry to view details</p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-brand-400 text-sm hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                  {[['Phone', selected.phone || '—'], ['Company', selected.company || '—'], ['Service', selected.service || '—'], ['Budget', selected.budget || '—']].map(([k,v]) => (
                    <div key={k}>
                      <p className="text-white/30 text-xs">{k}</p>
                      <p className="text-white/70">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/3 rounded-xl p-4 mb-5">
                  <p className="text-white/30 text-xs mb-2">Message</p>
                  <p className="text-white/70 text-sm leading-relaxed">{selected.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-xs">Status:</span>
                  <div className="flex gap-2">
                    {STATUS_OPTS.map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selected.status === s ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-white/40 hover:border-brand-500/40'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}