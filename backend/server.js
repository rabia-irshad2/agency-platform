require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/portfolio',    require('./routes/portfolio'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/inquiries',    require('./routes/inquiries'));
app.use('/api/appointments', require('./routes/appointments'));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Agency API is running 🚀', timestamp: new Date().toISOString() });
});

// ─── STATS (for admin dashboard) ─────────────────────────────────────────────
const db = require('./config/database');
app.get('/api/stats', (req, res) => {
  const stats = {
    services:     db.prepare('SELECT COUNT(*) as count FROM services').get().count,
    portfolio:    db.prepare('SELECT COUNT(*) as count FROM portfolio').get().count,
    blog_posts:   db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE is_published=1').get().count,
    inquiries:    db.prepare('SELECT COUNT(*) as count FROM inquiries').get().count,
    new_inquiries:db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status='new'").get().count,
    appointments: db.prepare('SELECT COUNT(*) as count FROM appointments').get().count,
    pending_appts:db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status='pending'").get().count,
  };
  res.json({ success: true, data: stats });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Agency API running on http://localhost:${PORT}`);
  console.log(`📊 Admin: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}\n`);
});