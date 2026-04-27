const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const parse = (p) => ({ ...p, tags: JSON.parse(p.tags || '[]') });

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

// GET /api/blog — public (only published)
router.get('/', (req, res) => {
  const { category, limit = 20, offset = 0 } = req.query;
  let q = 'SELECT * FROM blog_posts WHERE is_published = 1';
  const params = [];
  if (category) { q += ' AND category = ?'; params.push(category); }
  q += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  const posts = db.prepare(q).all(...params);
  const total = db.prepare('SELECT COUNT(*) as c FROM blog_posts WHERE is_published = 1').get().c;
  res.json({ success: true, data: posts.map(parse), total });
});

// GET /api/blog/all — admin (all posts)
router.get('/all', authenticateToken, (req, res) => {
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  res.json({ success: true, data: posts.map(parse) });
});

// GET /api/blog/:slug — public
router.get('/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').get(req.params.slug);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  db.prepare('UPDATE blog_posts SET views = views + 1 WHERE id = ?').run(post.id);
  res.json({ success: true, data: parse(post) });
});

// POST /api/blog — admin
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { title, excerpt, content, category='General', tags=[], cover_image='', is_published=0, author='Admin' } = req.body;
  const slug = slugify(title) + '-' + Date.now();

  const result = db.prepare(
    'INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, cover_image, is_published, author) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(title, slug, excerpt, content, category, JSON.stringify(tags), cover_image, is_published ? 1 : 0, author);

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Post created.', data: parse(post) });
});

// PUT /api/blog/:id — admin
router.put('/:id', authenticateToken, (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  const { title, excerpt, content, category, tags, cover_image, is_published, author } = req.body;
  db.prepare(`
    UPDATE blog_posts SET title=?,excerpt=?,content=?,category=?,tags=?,cover_image=?,is_published=?,author=?,updated_at=datetime('now')
    WHERE id=?
  `).run(
    title ?? post.title, excerpt ?? post.excerpt, content ?? post.content,
    category ?? post.category, JSON.stringify(tags ?? JSON.parse(post.tags)),
    cover_image ?? post.cover_image, is_published !== undefined ? (is_published ? 1 : 0) : post.is_published,
    author ?? post.author, req.params.id
  );
  const updated = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Post updated.', data: parse(updated) });
});

// DELETE /api/blog/:id — admin
router.delete('/:id', authenticateToken, (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Post deleted.' });
});

module.exports = router;