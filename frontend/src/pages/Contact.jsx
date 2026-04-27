import { useState } from 'react';
import { Send, CheckCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const SERVICES = ['Web Development', 'UI/UX Design', 'Digital Marketing', 'Mobile Development', 'Brand Identity', 'Cloud & DevOps', 'Other'];
const BUDGETS  = ['< $1,000', '$1,000 – $5,000', '$5,000 – $20,000', '$20,000 – $50,000', '$50,000+'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/inquiries', form);
      setSubmitted(true);
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(v => ({ ...v, [k]: '' })); };

  if (submitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Message Sent!</h2>
          <p className="text-white/50 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',company:'',service:'',budget:'',message:'' }); }} className="btn-outline">Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="tag mb-4 block w-fit mx-auto">Contact</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Let's <span className="gradient-text">Talk</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">Have a project in mind? We'd love to hear about it. Tell us about your goals and we'll craft a tailored solution.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: Mail,  label: 'Email Us',     value: 'hello@agency.com' },
                { icon: Phone, label: 'Call Us',      value: '+1 (555) 000-0000' },
                { icon: MapPin,label: 'Visit Us',     value: 'New York, NY 10001' },
                { icon: Clock, label: 'Working Hours',value: 'Mon–Fri, 9am–6pm EST' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3 card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className={`input ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" value={form.name} onChange={set('name')} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input className={`input ${errors.email ? 'border-red-500' : ''}`} placeholder="john@example.com" value={form.email} onChange={set('email')} type="email" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
                  </div>
                  <div>
                    <label className="label">Company</label>
                    <input className="input" placeholder="Your company" value={form.company} onChange={set('company')} />
                  </div>
                  <div>
                    <label className="label">Service Interested In</label>
                    <select className="input" value={form.service} onChange={set('service')}>
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Project Budget</label>
                    <select className="input" value={form.budget} onChange={set('budget')}>
                      <option value="">Select budget range...</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea className={`input resize-none h-32 ${errors.message ? 'border-red-500' : ''}`} placeholder="Tell us about your project, goals, and timeline..." value={form.message} onChange={set('message')} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}