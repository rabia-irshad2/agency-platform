import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home',      to: '/'          },
  { label: 'About',     to: '/about'     },
  { label: 'Services',  to: '/services'  },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog',      to: '/blog'      },
  { label: 'Contact',   to: '/contact'   },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30 shadow-glow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">Agency</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/admin/login" className="text-white/60 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Admin
          </Link>
          <Link to="/booking" className="btn-primary text-sm py-2 px-5">
            Book a Call
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2 rounded-lg hover:bg-white/10">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-dark-900/98 backdrop-blur-xl border-b border-white/5">
          <ul className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10">
              <Link to="/admin/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                Admin Login
              </Link>
            </li>
            <li>
              <Link to="/booking" className="btn-primary w-full justify-center text-sm">
                Book a Call
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}