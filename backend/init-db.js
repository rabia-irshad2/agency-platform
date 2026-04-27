#!/usr/bin/env node

/**
 * 🔧 Database Initialization Script
 * Run this to reset the database and create admin user
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import after loading .env
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'agency.db');
const dbShmPath = dbPath + '-shm';
const dbWalPath = dbPath + '-wal';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  🔧 DATABASE INITIALIZATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Step 1: Delete old database
console.log('📋 Step 1: Removing old database files...');
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('   ✅ Deleted agency.db');
  }
  if (fs.existsSync(dbShmPath)) {
    fs.unlinkSync(dbShmPath);
    console.log('   ✅ Deleted agency.db-shm');
  }
  if (fs.existsSync(dbWalPath)) {
    fs.unlinkSync(dbWalPath);
    console.log('   ✅ Deleted agency.db-wal');
  }
} catch (err) {
  console.error('   ❌ Error:', err.message);
  process.exit(1);
}

// Step 2: Create new database
console.log('\n📋 Step 2: Creating fresh database...');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
console.log('   ✅ Database created and configured');

// Step 3: Create tables
console.log('\n📋 Step 3: Creating tables...');
db.exec(`
  CREATE TABLE admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    name       TEXT    NOT NULL DEFAULT 'Admin',
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE services (
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

  CREATE TABLE portfolio (
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

  CREATE TABLE blog_posts (
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

  CREATE TABLE inquiries (
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

  CREATE TABLE appointments (
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
console.log('   ✅ All tables created');

// Step 4: Create admin user
console.log('\n📋 Step 4: Creating admin user...');
const adminEmail = process.env.ADMIN_EMAIL || 'admin@agency.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
const passwordHash = bcrypt.hashSync(adminPassword, 12);

db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
  adminEmail,
  passwordHash,
  'Agency Admin'
);
console.log(`   ✅ Admin created with email: ${adminEmail}`);

// Step 5: Verify
console.log('\n📋 Step 5: Verifying credentials...');
const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(adminEmail);
const isPasswordCorrect = bcrypt.compareSync(adminPassword, admin.password);

if (isPasswordCorrect) {
  console.log('   ✅ Password verification: PASS');
} else {
  console.log('   ❌ Password verification: FAIL');
  process.exit(1);
}

// Step 6: Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  ✨ DATABASE INITIALIZATION COMPLETE!\n');
console.log('  📝 Login Credentials:');
console.log(`     Email:    ${adminEmail}`);
console.log(`     Password: ${adminPassword}\n`);
console.log('  🚀 Next steps:');
console.log('     1. Restart your backend server (npm start)');
console.log('     2. Go to http://localhost:5173/admin/login');
console.log('     3. Enter the credentials above\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

db.close();
process.exit(0);
