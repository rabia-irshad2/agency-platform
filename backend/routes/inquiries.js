const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/inquiries — public (contact form)
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, phone='', company='', service='', budget='', message } = req.body;
  const result = db.prepare(
    'INSERT INTO inquiries (name, email, phone, company, service, budget, message) VALUES (?,?,?,?,?,?,?)'
  ).run(name, email, phone, company, service, budget, message);

  res.status(201).json({ success: true, message: 'Thank you! We\'ll get back to you within 24 hours.', id: result.lastInsertRowid });
});

// GET /api/inquiries — admin
router.get('/', authenticateToken, (req, res) => {
  const { status } = req.query;
  let q = 'SELECT * FROM inquiries WHERE 1=1';
  const params = [];
  if (status) { q += ' AND status = ?'; params.push(status); }
  q += ' ORDER BY created_at DESC';
  const inquiries = db.prepare(q).all(...params);
  res.json({ success: true, data: inquiries });
});

// PUT /api/inquiries/:id — admin (update status/notes)
router.put('/:id', authenticateToken, (req, res) => {
  const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
  if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

  const { status, notes } = req.body;
  db.prepare('UPDATE inquiries SET status=?, notes=? WHERE id=?').run(
    status ?? inquiry.status, notes ?? inquiry.notes, req.params.id
  );
  const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Inquiry updated.', data: updated });
});

// DELETE /api/inquiries/:id — admin
router.delete('/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Inquiry deleted.' });
});

module.exports = router;