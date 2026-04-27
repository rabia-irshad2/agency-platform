import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, BookOpen } from 'lucide-react';
import api from '../api/axios';

// Generate placeholder image for blog posts
const getPlaceholderImage = (title, category) => {
  const colors = {
    'Technology': 'from-blue-600 to-cyan-500',
    'Design': 'from-pink-600 to-rose-500',
    'Marketing': 'from-green-600 to-emerald-500',
    'General': 'from-brand-600 to-purple-500',
    'default': 'from-brand-600 to-purple-500'
  };
  const bgColor = colors[category] || colors['default'];
  const titleText = title.substring(0, 25).replace(/\s+/g, ' ');
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${bgColor.includes('blue') ? '3b82f6' : bgColor.includes('pink') ? 'ec4899' : bgColor.includes('green') ? '10b981' : '6366f1'};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${bgColor.includes('cyan') ? '06b6d4' : bgColor.includes('rose') ? 'f43f5e' : bgColor.includes('emerald') ? '059669' : 'a855f7'};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='500' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='40%25' font-size='56' font-weight='bold' font-family='Arial' fill='white' text-anchor='middle' dy='.3em'%3E📰%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='32' font-family='Arial' fill='white' text-anchor='middle' dy='.3em' font-weight='bold'%3E${titleText}%3C/text%3E%3C/svg%3E`;
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="pt-24">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative container-custom px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-400 mb-4">
              <BookOpen size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Blog</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-6">
              Insights &
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">Thoughts on design, technology, and building exceptional digital products that matter.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm">
                  <div className="h-56 bg-gradient-to-br from-white/5 to-white/2 animate-pulse" />
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm hover:border-brand-500/50 transition-all duration-300 flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-500/20 to-purple-500/10">
                    <img 
                      src={post.cover_image || getPlaceholderImage(post.title, post.category)} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 rounded-full bg-brand-500/80 backdrop-blur-sm text-white text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-8">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-white/40 text-xs font-medium mb-4 pb-4 border-b border-white/10">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-400" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} className="text-brand-400" />
                        {post.views || 0} views
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-brand-400 transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-brand-400 font-semibold text-sm group-hover:gap-3 transition-all">
                      Continue Reading
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-32">
              <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
              <div className="text-white/30 text-lg mb-2">No blog posts published yet.</div>
              <p className="text-white/20 text-sm">Check back soon for insights and ideas</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}