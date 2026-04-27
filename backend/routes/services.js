const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/services — public
router.get('/', (req, res) => {
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY id DESC').all();
  const parsed = services.map(s => ({ ...s, features: JSON.parse(s.features || '[]') }));
  res.json({ success: true, data: parsed });
});

// GET /api/services/all — admin
router.get('/all', authenticateToken, (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY id DESC').all();
  const parsed = services.map(s => ({ ...s, features: JSON.parse(s.features || '[]') }));
  res.json({ success: true, data: parsed });
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, data: { ...service, features: JSON.parse(service.features || '[]') } });
});

// POST /api/services — admin
router.post('/', authenticateToken, [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { title, description, icon = '⚡', price = 'Custom', features = [], is_active = 1 } = req.body;
  const result = db.prepare(
    'INSERT INTO services (title, description, icon, price, features, is_active) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, description, icon, price, JSON.stringify(features), is_active ? 1 : 0);

  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Service created.', data: { ...service, features: JSON.parse(service.features) } });
});

// PUT /api/services/:id — admin
router.put('/:id', authenticateToken, (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  const { title, description, icon, price, features, is_active } = req.body;
  db.prepare(`
    UPDATE services SET title=?, description=?, icon=?, price=?, features=?, is_active=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    title ?? service.title,
    description ?? service.description,
    icon ?? service.icon,
    price ?? service.price,
    JSON.stringify(features ?? JSON.parse(service.features)),
    is_active !== undefined ? (is_active ? 1 : 0) : service.is_active,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Service updated.', data: { ...updated, features: JSON.parse(updated.features) } });
});

// DELETE /api/services/:id — admin
router.delete('/:id', authenticateToken, (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Service deleted.' });
});

module.exports = router;