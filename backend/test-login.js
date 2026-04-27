#!/usr/bin/env node

/**
 * 🔐 Direct Login Test
 * Tests if authentication works with exact credentials
 */

require('dotenv').config();
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'agency.db');
const db = new Database(dbPath);

const testEmail = 'admin@agency.com';
const testPassword = 'Admin@123';

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  🔐 DIRECT LOGIN TEST');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// List all admins
console.log('📋 All admins in database:');
const allAdmins = db.prepare('SELECT id, email, name, created_at FROM admins').all();
if (allAdmins.length === 0) {
  console.log('   ❌ NO ADMINS FOUND!');
} else {
  allAdmins.forEach(a => {
    console.log(`   • ${a.email} (${a.name})`);
  });
}

console.log(`\n🔐 Testing login with:`);
console.log(`   Email:    ${testEmail}`);
console.log(`   Password: ${testPassword}\n`);

// Test 1: Find admin
console.log('📍 Step 1: Finding admin...');
const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(testEmail);
if (!admin) {
  console.log(`   ❌ FAIL: Admin not found for email "${testEmail}"`);
  db.close();
  process.exit(1);
}
console.log(`   ✅ PASS: Admin found`);
console.log(`      ID: ${admin.id}`);
console.log(`      Email: ${admin.email}`);
console.log(`      Name: ${admin.name}`);
console.log(`      Hash: ${admin.password.substring(0, 30)}...`);

// Test 2: Compare password
console.log('\n📍 Step 2: Comparing password...');
const isMatch = bcrypt.compareSync(testPassword, admin.password);
if (!isMatch) {
  console.log(`   ❌ FAIL: Password does not match`);
  console.log(`      Input: "${testPassword}"`);
  console.log(`      Hash: ${admin.password}`);
  
  // Try to help debug
  console.log('\n   🔍 Debugging:');
  const newHash = bcrypt.hashSync(testPassword, 12);
  console.log(`      New hash: ${newHash}`);
  console.log(`      Match with new? ${bcrypt.compareSync(testPassword, newHash)}`);
  
  db.close();
  process.exit(1);
}
console.log(`   ✅ PASS: Password matches!`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  ✨ LOGIN TEST SUCCESSFUL!');
console.log('\n  The database credentials are correct.');
console.log('  If login still fails in the app, the issue is:');
console.log('  • Network connectivity (check backend is running)');
console.log('  • Browser cache (clear localStorage)');
console.log('  • Frontend code issue\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

db.close();
process.exit(0);
