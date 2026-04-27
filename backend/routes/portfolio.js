const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const parse = (p) => ({ ...p, tags: JSON.parse(p.tags || '[]') });

// GET /api/portfolio
router.get('/', (req, res) => {
  const { category, featured } = req.query;
  let query = 'SELECT * FROM portfolio WHERE 1=1';
  const params = [];
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (featured === 'true') { query += ' AND is_featured = 1'; }
  query += ' ORDER BY id DESC';
  const projects = db.prepare(query).all(...params);
  res.json({ success: true, data: projects.map(parse) });
});

// GET /api/portfolio/:id
router.get('/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, data: parse(p) });
});

// POST /api/portfolio — admin
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { title, description, category, image_url='', client_name='', project_url='', tags=[], is_featured=0 } = req.body;
  const result = db.prepare(
    'INSERT INTO portfolio (title, description, category, image_url, client_name, project_url, tags, is_featured) VALUES (?,?,?,?,?,?,?,?)'
  ).run(title, description, category, image_url, client_name, project_url, JSON.stringify(tags), is_featured ? 1 : 0);

  const item = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Project created.', data: parse(item) });
});

// PUT /api/portfolio/:id — admin
router.put('/:id', authenticateToken, (req, res) => {
  const item = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Project not found.' });

  const { title, description, category, image_url, client_name, project_url, tags, is_featured } = req.body;
  db.prepare(`
    UPDATE portfolio SET title=?,description=?,category=?,image_url=?,client_name=?,project_url=?,tags=?,is_featured=?,updated_at=datetime('now')
    WHERE id=?
  `).run(
    title ?? item.title, description ?? item.description, category ?? item.category,
    image_url ?? item.image_url, client_name ?? item.client_name, project_url ?? item.project_url,
    JSON.stringify(tags ?? JSON.parse(item.tags)), is_featured !== undefined ? (is_featured ? 1 : 0) : item.is_featured,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Project updated.', data: parse(updated) });
});

// DELETE /api/portfolio/:id — admin
router.delete('/:id', authenticateToken, (req, res) => {
  const item = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Project not found.' });
  db.prepare('DELETE FROM portfolio WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Project deleted.' });
});

module.exports = router;