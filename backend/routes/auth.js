const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Debug logs — remove these after login is working
    console.log('─── Login Attempt ───────────────────────────────');
    console.log('Email received  :', email);
    console.log('Password received:', password);
    console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

    // Find admin in database
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    console.log('Admin found in DB:', !!admin);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, admin.password);
    console.log('Password match  :', isMatch);
    console.log('─────────────────────────────────────────────────');

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'fallback_secret_dev_only',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticateToken, (req, res) => {
  const admin = db
    .prepare('SELECT id, email, name, created_at FROM admins WHERE id = ?')
    .get(req.admin.id);

  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found.' });
  }

  return res.json({ success: true, admin });
});

// ─── POST /api/auth/change-password ──────────────────────────────────────────
router.post(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);

    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashed = bcrypt.hashSync(newPassword, 12);
    db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashed, req.admin.id);

    return res.json({ success: true, message: 'Password changed successfully.' });
  }
);

module.exports = router;