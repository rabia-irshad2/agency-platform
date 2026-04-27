import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24">
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="tag mb-4 block w-fit mx-auto">Services</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
              What We <span className="gradient-text">Offer</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              From strategy to launch, we provide end-to-end digital services that drive measurable results.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-7 animate-pulse">
                  <div className="w-12 h-12 bg-white/10 rounded-xl mb-5" />
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded" />
                    <div className="h-3 bg-white/5 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="card p-7 flex flex-col group hover:glow">
                  <div className="text-5xl mb-5">{s.icon}</div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-brand-400 transition-colors">{s.title}</h3>
                    <span className="tag text-xs shrink-0 ml-2">{s.price}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">{s.description}</p>
                  {s.features?.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                          <CheckCircle size={14} className="text-brand-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/contact" className="btn-outline w-full justify-center text-sm mt-auto">
                    Get a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}