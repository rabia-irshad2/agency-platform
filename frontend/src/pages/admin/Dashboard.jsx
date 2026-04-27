import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Image, FileText, MessageSquare, Calendar, LogOut, Menu, X, ChevronRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard, to: '/admin/dashboard'  },
  { label: 'Services',   icon: Briefcase,        to: '/admin/services'   },
  { label: 'Portfolio',  icon: Image,            to: '/admin/portfolio'  },
  { label: 'Blog',       icon: FileText,         to: '/admin/blog'       },
  { label: 'Inquiries',  icon: MessageSquare,    to: '/admin/inquiries'  },
  { label: 'Meetings',   icon: Calendar,         to: '/admin/meetings'   },
];

export function AdminLayout({ children, title }) {
  const { admin, logout }   = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Agency Admin</p>
              <p className="text-white/30 text-xs">{admin?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              key={to} to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-brand-500 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
              {location.pathname === to && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 bg-dark-800/80 border-b border-white/5 backdrop-blur flex items-center px-4 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/50 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-white font-semibold text-sm">{title}</h1>
          <Link to="/" target="_blank" className="ml-auto text-white/30 hover:text-white/60 text-xs transition-colors">
            View Site ↗
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data.data)).catch(() => {});
    api.get('/inquiries?status=new').then(r => setInquiries(r.data.data?.slice(0, 5) || [])).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: 'Total Services',    value: stats.services,      color: 'text-brand-400',   bg: 'bg-brand-500/10' },
    { label: 'Portfolio Items',   value: stats.portfolio,     color: 'text-purple-400',  bg: 'bg-purple-500/10' },
    { label: 'Blog Posts',        value: stats.blog_posts,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'New Inquiries',     value: stats.new_inquiries, color: 'text-accent-400',  bg: 'bg-accent-500/10' },
    { label: 'Total Inquiries',   value: stats.inquiries,     color: 'text-sky-400',     bg: 'bg-sky-500/10' },
    { label: 'Pending Meetings',  value: stats.pending_appts, color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {!stats ? [...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-8 bg-white/10 rounded mb-2 w-1/2" />
              <div className="h-3 bg-white/5 rounded" />
            </div>
          )) : cards.map(({ label, value, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`inline-flex items-center justify-center w-10 h-10 ${bg} rounded-xl mb-3`}>
                <span className={`${color} font-bold text-lg font-mono`}>{value}</span>
              </div>
              <p className="text-white/50 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Inquiries */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="text-white font-semibold text-sm">New Inquiries</h2>
            <Link to="/admin/inquiries" className="text-brand-400 text-xs hover:text-brand-300 transition-colors">View All →</Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-10">No new inquiries</p>
          ) : (
            <div className="divide-y divide-white/5">
              {inquiries.map(q => (
                <div key={q.id} className="flex items-start gap-4 p-4 hover:bg-white/2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 text-brand-400 font-semibold text-xs">
                    {q.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white text-sm font-medium truncate">{q.name}</p>
                      <span className="badge-new tag text-xs">{q.status}</span>
                    </div>
                    <p className="text-white/40 text-xs truncate">{q.email} — {q.service || 'General'}</p>
                  </div>
                  <p className="text-white/20 text-xs shrink-0">{new Date(q.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {navItems.slice(1).map(({ label, icon: Icon, to }) => (
            <Link key={to} to={to} className="card p-5 flex items-center gap-3 group hover:border-brand-500/40">
              <div className="w-9 h-9 bg-brand-500/10 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-brand-400" />
              </div>
              <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors">Manage {label}</span>
              <ChevronRight size={14} className="text-white/20 ml-auto group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}