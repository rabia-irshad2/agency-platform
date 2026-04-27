import { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './Dashboard';
import api from '../../api/axios';

const STATUS_COLORS = { pending: 'badge-pending tag', confirmed: 'badge-confirmed tag', cancelled: 'badge-cancelled tag' };

export default function ManageMeetings() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  const load = () => api.get('/appointments').then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status, meeting_link: meetingLink });
      load();
      if (selected?.id === id) setSelected(s => ({ ...s, status, meeting_link: meetingLink }));
      toast.success('Updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); load(); setSelected(null); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const fmt = (d) => new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AdminLayout title="Scheduled Meetings">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-center py-12 text-white/30 text-sm">No appointments yet</p>
            ) : items.map(a => (
              <div key={a.id} onClick={() => { setSelected(a); setMeetingLink(a.meeting_link || ''); }}
                className={`p-4 cursor-pointer hover:bg-white/3 transition-colors ${selected?.id === a.id ? 'bg-white/5 border-l-2 border-l-brand-500' : ''}`}>
                <div className="flex items-start justify-between mb-1.5">
                  <p className="text-white text-sm font-medium">{a.name}</p>
                  <span className={`${STATUS_COLORS[a.status]} text-xs shrink-0 ml-2`}>{a.status}</span>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  <span className="flex items-center gap-1"><Calendar size={11} />{fmt(a.date)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                </div>
                <p className="text-white/30 text-xs mt-1">{a.service}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 card p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/20">
              <Calendar size={32} className="mb-3" />
              <p className="text-sm">Select a meeting to manage</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{selected.name}</h3>
                  <p className="text-brand-400 text-sm">{selected.email}</p>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Service', selected.service], ['Date', fmt(selected.date)], ['Time', selected.time], ['Phone', selected.phone || '—']].map(([k,v]) => (
                  <div key={k} className="bg-white/3 rounded-xl p-3">
                    <p className="text-white/30 text-xs mb-1">{k}</p>
                    <p className="text-white/80">{v}</p>
                  </div>
                ))}
              </div>

              {selected.message && (
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-white/30 text-xs mb-2">Notes from client</p>
                  <p className="text-white/70 text-sm">{selected.message}</p>
                </div>
              )}

              <div>
                <label className="label flex items-center gap-1.5"><LinkIcon size={12} /> Meeting Link (Zoom/Google Meet)</label>
                <input className="input" placeholder="https://zoom.us/j/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} />
              </div>

              <div>
                <label className="label">Update Status</label>
                <div className="flex gap-2">
                  {['pending','confirmed','cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex-1 ${selected.status === s ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-white/40 hover:border-brand-500/40'}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}