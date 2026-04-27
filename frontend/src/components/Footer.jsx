import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Agency</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              We craft digital experiences that drive growth and leave lasting impressions. Your vision, our expertise.
            </p>
            <div className="flex gap-3 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-brand-500/20 border border-white/10 hover:border-brand-500/40 rounded-lg flex items-center justify-center text-white/50 hover:text-brand-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[['Home','/'],['About','/about'],['Services','/services'],['Portfolio','/portfolio'],['Blog','/blog'],['Contact','/contact']].map(([l,h]) => (
                <li key={h}>
                  <Link to={h} className="text-white/50 hover:text-white text-sm transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <Mail size={14} className="text-brand-400" />
                hello@agency.com
              </li>
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <Phone size={14} className="text-brand-400" />
                +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin size={14} className="text-brand-400" />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© {year} Agency. All rights reserved.</p>
          <Link to="/admin/login" className="text-white/20 hover:text-white/40 text-xs transition-colors">Admin Panel</Link>
        </div>
      </div>
    </footer>
  );
}