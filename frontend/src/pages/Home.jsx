import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, TrendingUp, CheckCircle, ChevronRight, Sparkles, Rocket } from 'lucide-react';
import api from '../api/axios';

const stats = [
  { icon: Users,    value: '150+', label: 'Clients Served'    },
  { icon: Award,    value: '8+',   label: 'Years Experience'  },
  { icon: Star,     value: '4.9',  label: 'Average Rating'    },
  { icon: TrendingUp, value: '98%', label: 'Client Retention' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.data?.slice(0, 3) || []));
    api.get('/portfolio?featured=true').then(r => setPortfolio(r.data.data?.slice(0, 3) || []));
  }, []);

  return (
    <div>
      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 noise opacity-20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">✨ Now accepting new projects</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            Your Digital
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Transformation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            We craft cutting-edge digital solutions that drive growth, engage audiences, and transform your vision into market-leading experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <Link to="/booking" className="group relative px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-brand-500/50">
              Start a Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="px-8 py-4 border-2 border-white/20 hover:border-brand-400/50 text-white hover:bg-brand-500/10 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm">
              View Our Work
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 border-t border-white/10">
            {[
              { icon: Rocket, text: '8+ years crafting digital excellence' },
              { icon: Users, text: '150+ brands transformed' },
              { icon: Award, text: '4.9⭐ client satisfaction' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <item.icon size={18} className="text-brand-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ────────────────────────────────────────────────── */}
      <section className="relative py-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div key={i} className="group text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500/20 to-purple-500/10 rounded-2xl mb-4 group-hover:from-brand-500/30 group-hover:to-purple-500/20 transition-all duration-300 border border-brand-500/10 group-hover:border-brand-500/30">
                  <Icon size={28} className="text-brand-400" />
                </div>
                <div className="font-display font-bold text-4xl md:text-5xl text-white mb-2">{value}</div>
                <div className="text-white/50 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="section relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-brand-400 mb-4">
                <Sparkles size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">What We Do</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">Services Crafted for Growth</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">Full-spectrum digital solutions engineered to amplify your impact.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((s) => (
                <div key={s.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/5 rounded-3xl blur group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/2 border border-white/10 group-hover:border-brand-500/30 rounded-3xl p-8 transition-all duration-300 backdrop-blur-sm">
                    <div className="text-6xl mb-6">{s.icon}</div>
                    <h3 className="font-display font-bold text-2xl text-white mb-4 group-hover:text-brand-400 transition-colors">{s.title}</h3>
                    <p className="text-white/60 leading-relaxed mb-6">{s.description.substring(0, 120)}...</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-brand-400 font-semibold">{s.price}</span>
                      <ChevronRight size={20} className="text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-brand-400/50 text-white hover:bg-brand-500/10 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm">
                Explore All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── PORTFOLIO SECTION ────────────────────────────────────────────── */}
      {portfolio.length > 0 && (
        <section className="section relative border-y border-white/10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-brand-400 mb-4">
                <Star size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">Our Work</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">Featured Projects</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">Proven results. Measurable impact. Transformative digital experiences.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio.map((p) => (
                <div key={p.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/5 rounded-3xl blur group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/2 border border-white/10 group-hover:border-brand-500/30 rounded-3xl p-8 transition-all duration-300 backdrop-blur-sm">
                    <div className="h-48 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/10 mb-6 flex items-center justify-center text-brand-400/40 text-sm font-bold group-hover:from-brand-500/30 group-hover:to-purple-500/20 transition-all">
                      {p.category}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-brand-400 transition-colors">{p.title}</h3>
                    <p className="text-white/60 text-sm font-medium">{p.client_name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link to="/portfolio" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-brand-400/50 text-white hover:bg-brand-500/10 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm">
                See All Projects <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA SECTION ────────────────────────────────────────────── */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-cyan-500/15 rounded-3xl blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="bg-white/2 border border-brand-500/30 backdrop-blur-lg rounded-4xl p-12 md:p-20 text-center">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Let's Create
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Something Extraordinary
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Ready to transform your digital vision into reality? Let's talk about your goals and how we can help you achieve them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/contact" className="group relative px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-brand-500/50">
                Start a Conversation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/booking" className="px-8 py-4 border-2 border-white/20 hover:border-brand-400/50 text-white hover:bg-white/5 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm">
                Schedule a Meeting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}