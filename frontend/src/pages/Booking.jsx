import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const SERVICES = ['Web Development', 'UI/UX Design', 'Digital Marketing', 'Mobile Development', 'Brand Identity', 'Cloud & DevOps'];
const TIME_SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'];

export default function Booking() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', date:'', time:'', message:'' });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [errors, setErrors]           = useState({});

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (form.date) {
      api.get(`/appointments/booked-slots?date=${form.date}`)
        .then(r => setBookedSlots(r.data.data || []))
        .catch(() => {});
    }
  }, [form.date]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.service)       e.service = 'Please select a service';
    if (!form.date)          e.date    = 'Please select a date';
    if (!form.time)          e.time    = 'Please select a time';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/appointments', form);
      setSubmitted(true);
      toast.success('Meeting scheduled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const set = (k) => (v) => { setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value })); setErrors(e => ({ ...e, [k]: '' })); };

  if (submitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Meeting Scheduled!</h2>
          <p className="text-white/50 mb-2">Your meeting has been booked for:</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <p className="text-white font-medium">{form.service}</p>
            <p className="text-brand-400">{form.date} at {form.time}</p>
          </div>
          <p className="text-white/40 text-sm">We'll send a confirmation and meeting link to {form.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="section">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="tag mb-4 block w-fit mx-auto">Book a Meeting</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Schedule a <span className="gradient-text">Free Consultation</span>
            </h1>
            <p className="text-white/50">Pick a time that works for you and let's discuss your project.</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input className={`input ${errors.name?'border-red-500':''}`} placeholder="John Doe" value={form.name} onChange={set('name')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input className={`input ${errors.email?'border-red-500':''}`} placeholder="john@example.com" type="email" value={form.email} onChange={set('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
              </div>

              <div>
                <label className="label">Service *</label>
                <select className={`input ${errors.service?'border-red-500':''}`} value={form.service} onChange={set('service')}>
                  <option value="">Select a service...</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service}</p>}
              </div>

              <div>
                <label className="label"><Calendar size={14} className="inline mr-1" />Select Date *</label>
                <input type="date" className={`input ${errors.date?'border-red-500':''}`} min={today} value={form.date} onChange={set('date')} />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>

              {form.date && (
                <div>
                  <label className="label"><Clock size={14} className="inline mr-1" />Select Time *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(t => {
                      const isBooked = bookedSlots.includes(t);
                      return (
                        <button
                          key={t} type="button" disabled={isBooked}
                          onClick={() => !isBooked && set('time')(t)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                            isBooked ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through' :
                            form.time === t ? 'bg-brand-500 border-brand-500 text-white' :
                            'bg-white/5 border-white/10 text-white/60 hover:border-brand-500/50 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                </div>
              )}

              <div>
                <label className="label">Additional Notes</label>
                <textarea className="input resize-none h-24" placeholder="What would you like to discuss?" value={form.message} onChange={set('message')} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}