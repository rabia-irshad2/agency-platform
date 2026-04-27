import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Users, ArrowRight, Sparkles, Code, Palette, Zap } from 'lucide-react';
import api from '../api/axios';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Brand Identity', 'Digital Marketing'];

// Modern placeholder SVG generator
const getPlaceholderImage = (title, category) => {
  const colorMap = {
    'Web Development': { gradient: 'from-blue-600 to-cyan-400', hex1: '1e40af', hex2: '22d3ee' },
    'Mobile Development': { gradient: 'from-purple-600 to-pink-400', hex1: '7c3aed', hex2: 'ec4899' },
    'Brand Identity': { gradient: 'from-orange-600 to-yellow-400', hex1: 'ea580c', hex2: 'facc15' },
    'Digital Marketing': { gradient: 'from-green-600 to-emerald-400', hex1: '16a34a', hex2: '10b981' },
  };
  
  const colors = colorMap[category] || colorMap['Web Development'];
  const initial = title.charAt(0).toUpperCase();
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${colors.hex1};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${colors.hex2};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='500' fill='url(%23grad)'/%3E%3Ccircle cx='400' cy='250' r='80' fill='rgba(255,255,255,0.1)'/%3E%3Ctext x='400' y='280' font-size='120' font-family='Arial, sans-serif' font-weight='bold' fill='white' text-anchor='middle'%3E${initial}%3C/text%3E%3Ctext x='400' y='420' font-size='32' font-family='Arial, sans-serif' fill='rgba(255,255,255,0.7)' text-anchor='middle'%3E${title.substring(0, 30)}%3C/text%3E%3C/svg%3E`;
};

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolio').then(r => {
      setProjects(r.data.data || []);
      setFiltered(r.data.data || []);
    }).catch(err => {
      console.error('Failed to load portfolio:', err);
      setProjects([]);
      setFiltered([]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter(p => p.category === category));
    }
  }, [category, projects]);

  return (
    <div className="pt-20 pb-20">
      {/* Header Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-400 mb-4">
              <TrendingUp size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Our Portfolio</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Projects That
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Delivered Impact
              </span>
            </h1>
            
            <p className="text-white/60 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              Explore our latest work. Real projects. Real results. Real growth. Each project showcases our commitment to digital excellence and client success.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12 px-4">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  category === c 
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/50 scale-105' 
                    : 'bg-white/5 border-2 border-white/10 text-white/70 hover:border-brand-500/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm animate-pulse">
                <div className="h-80 bg-gradient-to-br from-white/5 to-white/2" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-40">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-500/10 rounded-2xl mb-6">
              <Sparkles size={40} className="text-brand-400" />
            </div>
            <h3 className="font-display text-3xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-white/50 max-w-lg mx-auto">Our portfolio is being built. Check back soon for our latest projects and case studies.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm hover:border-brand-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10">
                
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-brand-500/20 to-purple-500/10">
                  <img 
                    src={p.image_url || getPlaceholderImage(p.title, p.category)} 
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(p.title, p.category);
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  {/* Featured Badge */}
                  {p.is_featured && (
                    <div className="absolute top-4 right-4">
                      <div className="relative px-4 py-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-bold shadow-lg shadow-brand-500/50">
                        ⭐ Featured
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.tags?.slice(0, 3).map((t, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 hover:bg-brand-500/30 transition-colors">
                        {t}
                      </span>
                    ))}
                    {p.tags?.length > 3 && (
                      <span className="px-3 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-medium border border-white/10">
                        +{p.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-brand-400 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2 h-10">
                    {p.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-brand-400" />
                      <span className="text-white/70 text-sm font-medium">{p.client_name}</span>
                    </div>
                    {p.project_url && (
                      <a 
                        href={p.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/40 hover:scale-110 transition-all"
                        title="View Project"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results for filter */}
        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6">
              <Code size={40} className="text-white/30" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-white/50">Try selecting a different category to explore more work.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {projects.length > 0 && (
        <section className="relative mt-32 px-6 max-w-6xl mx-auto">
          <div className="relative border border-brand-500/30 backdrop-blur-lg rounded-4xl p-16 bg-gradient-to-br from-brand-500/10 to-purple-500/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="text-center">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
                Inspired by Our Work?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg mb-10">
                Let's discuss your project and create something remarkable together.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <a href="/contact" className="group px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-brand-500/50">
                  Start a Project
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/booking" className="px-8 py-4 border-2 border-white/20 hover:border-brand-400/50 text-white hover:bg-brand-500/10 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm">
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}