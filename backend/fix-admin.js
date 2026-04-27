const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Load .env variables
require('dotenv').config();

const dbPath = path.join(__dirname, 'agency.db');

// Delete old database files to reset
console.log('🔄 Resetting database...');
try {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  if (fs.existsSync(dbPath + '-shm')) fs.unlinkSync(dbPath + '-shm');
  if (fs.existsSync(dbPath + '-wal')) fs.unlinkSync(dbPath + '-wal');
  console.log('✅ Old database removed\n');
} catch (e) {
  console.error('Error removing DB:', e.message);
}

// Create fresh database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    name       TEXT    NOT NULL DEFAULT 'Admin',
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT DEFAULT '⚡',
    price       TEXT DEFAULT 'Custom',
    features    TEXT DEFAULT '[]',
    is_active   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    category    TEXT NOT NULL,
    image_url   TEXT DEFAULT '',
    client_name TEXT DEFAULT '',
    project_url TEXT DEFAULT '',
    tags        TEXT DEFAULT '[]',
    is_featured INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    excerpt     TEXT NOT NULL,
    content     TEXT NOT NULL,
    author      TEXT DEFAULT 'Admin',
    category    TEXT DEFAULT 'General',
    tags        TEXT DEFAULT '[]',
    cover_image TEXT DEFAULT '',
    is_published INTEGER DEFAULT 0,
    views       INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT DEFAULT '',
    company    TEXT DEFAULT '',
    service    TEXT DEFAULT '',
    budget     TEXT DEFAULT '',
    message    TEXT NOT NULL,
    status     TEXT DEFAULT 'new',
    notes      TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT DEFAULT '',
    service      TEXT NOT NULL,
    date         TEXT NOT NULL,
    time         TEXT NOT NULL,
    message      TEXT DEFAULT '',
    status       TEXT DEFAULT 'pending',
    meeting_link TEXT DEFAULT '',
    notes        TEXT DEFAULT '',
    created_at   TEXT DEFAULT (datetime('now'))
  );
`);

// Create admin user with credentials from .env
const adminEmail = process.env.ADMIN_EMAIL || 'admin@agency.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
const passwordHash = bcrypt.hashSync(adminPassword, 12);

db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
  adminEmail,
  passwordHash,
  'Agency Admin'
);

console.log('✅ Admin user created:');
console.log(`   Email: ${adminEmail}`);
console.log(`   Password: ${adminPassword}`);
console.log(`   Hash: ${passwordHash.substring(0, 20)}...`);

// Verify
const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(adminEmail);
const isValid = bcrypt.compareSync(adminPassword, admin.password);
console.log(`\n🔐 Password verification: ${isValid ? '✅ PASS' : '❌ FAIL'}`);

db.close();
console.log('\n✨ Database reset complete! Restart your backend server.');
