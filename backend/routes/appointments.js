const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/appointments — public (booking form)
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, phone='', service, date, time, message='' } = req.body;

  // Check for existing appointment at same date/time
  const conflict = db.prepare(
    "SELECT id FROM appointments WHERE date = ? AND time = ? AND status != 'cancelled'"
  ).get(date, time);

  if (conflict) {
    return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
  }

  const result = db.prepare(
    'INSERT INTO appointments (name, email, phone, service, date, time, message) VALUES (?,?,?,?,?,?,?)'
  ).run(name, email, phone, service, date, time, message);

  res.status(201).json({ success: true, message: 'Meeting scheduled! We will send you a confirmation shortly.', id: result.lastInsertRowid });
});

// GET /api/appointments — admin
router.get('/', authenticateToken, (req, res) => {
  const { status, date } = req.query;
  let q = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];
  if (status) { q += ' AND status = ?'; params.push(status); }
  if (date) { q += ' AND date = ?'; params.push(date); }
  q += ' ORDER BY date ASC, time ASC';
  const appointments = db.prepare(q).all(...params);
  res.json({ success: true, data: appointments });
});

// GET /api/appointments/booked-slots — public (to disable taken slots)
router.get('/booked-slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: 'Date is required.' });
  const slots = db.prepare(
    "SELECT time FROM appointments WHERE date = ? AND status != 'cancelled'"
  ).all(date);
  res.json({ success: true, data: slots.map(s => s.time) });
});

// PUT /api/appointments/:id — admin
router.put('/:id', authenticateToken, (req, res) => {
  const appt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });

  const { status, meeting_link, notes } = req.body;
  db.prepare('UPDATE appointments SET status=?, meeting_link=?, notes=? WHERE id=?').run(
    status ?? appt.status, meeting_link ?? appt.meeting_link, notes ?? appt.notes, req.params.id
  );
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Appointment updated.', data: updated });
});

// DELETE /api/appointments/:id — admin
router.delete('/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Appointment deleted.' });
});

module.exports = router;