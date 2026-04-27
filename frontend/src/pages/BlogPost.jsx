import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, User } from 'lucide-react';
import api from '../api/axios';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(r => setPost(r.data.data))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !post) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-white/50">{error}</p><Link to="/blog" className="btn-primary">Back to Blog</Link></div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <div className="mb-8">
          <span className="tag mb-4 inline-block">{post.category}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />{fmt(post.created_at)}</span>
            <span className="flex items-center gap-1.5"><Eye size={14} />{post.views} views</span>
          </div>
        </div>

        <div className="h-64 bg-gradient-to-br from-brand-500/20 to-purple-500/10 rounded-2xl mb-10" />

        <div className="prose prose-invert max-w-none">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-white/70 leading-relaxed mb-5 text-[1.05rem]">{para}</p>
          ))}
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/5">
            {post.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}