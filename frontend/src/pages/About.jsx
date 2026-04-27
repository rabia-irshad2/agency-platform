import { Link } from 'react-router-dom';
import { Award, Users, Globe, Heart, ArrowRight } from 'lucide-react';

const team = [
  { name: 'Sarah Mitchell', role: 'Creative Director',     emoji: '👩‍🎨' },
  { name: 'James Chen',     role: 'Lead Developer',        emoji: '👨‍💻' },
  { name: 'Priya Sharma',   role: 'Strategy & Growth',     emoji: '👩‍💼' },
  { name: 'Marcus Torres',  role: 'UX Research Lead',      emoji: '👨‍🔬' },
];

const values = [
  { icon: Award,  title: 'Excellence First',     desc: 'We refuse to ship mediocre work. Every detail matters, every pixel is intentional.' },
  { icon: Users,  title: 'Client Partnership',   desc: 'We treat your business as our own. Your success is our most important metric.' },
  { icon: Globe,  title: 'Think Globally',       desc: 'We build digital products for a world that is mobile, multilingual, and always connected.' },
  { icon: Heart,  title: 'Passion-Driven',       desc: 'We genuinely love what we do. That passion shows in everything we create.' },
];

export default function About() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section">
        <div className="container-custom text-center">
          <span className="tag mb-6 block w-fit mx-auto">About Us</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
            We Are a <span className="gradient-text">Creative Studio</span>
            <br />That Ships Results
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Founded in 2016, we've been at the intersection of design, technology, and business strategy — helping brands navigate and win in the digital world.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white/2 border-y border-white/5">
        <div className="container-custom">
          <h2 className="font-display text-4xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7 text-center">
                <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-400" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Meet the Team</h2>
            <p className="text-white/50">The brilliant minds behind every project.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="card p-6 text-center group">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{name}</h3>
                <p className="text-white/40 text-xs">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Work Together?</h2>
          <p className="text-white/50 mb-8">Let's build something amazing. We're always open to new projects.</p>
          <Link to="/contact" className="btn-primary px-8 py-4">
            Start a Conversation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}