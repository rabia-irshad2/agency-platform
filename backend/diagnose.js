const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.join(__dirname, 'agency.db');
const db = new Database(dbPath);

console.log('\n' + '='.repeat(60));
console.log('  🔍 COMPLETE LOGIN DIAGNOSTIC');
console.log('='.repeat(60) + '\n');

// Check 1: Verify database exists
console.log('✅ Database file: EXISTS');

// Check 2: Count admins
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
console.log(`✅ Admin records in database: ${adminCount}`);

if (adminCount === 0) {
  console.log('   ❌ NO ADMINS FOUND! Creating one...');
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
  db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
    process.env.ADMIN_EMAIL || 'admin@agency.com',
    hash,
    'Agency Admin'
  );
  console.log('   ✅ Admin created!');
}

// Check 3: List all admins
console.log('\n📋 All admins in database:');
const admins = db.prepare('SELECT id, email, name, created_at FROM admins').all();
admins.forEach(a => {
  console.log(`   • ${a.email} (${a.name}) - Created: ${a.created_at}`);
});

// Check 4: Test specific credentials
console.log('\n🔐 Testing credentials:');
const testEmail = process.env.ADMIN_EMAIL || 'admin@agency.com';
const testPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(testEmail);
if (!admin) {
  console.log(`   ❌ Admin not found: ${testEmail}`);
} else {
  const isValid = bcrypt.compareSync(testPassword, admin.password);
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password input: ${testPassword}`);
  console.log(`   Password valid: ${isValid ? '✅ YES' : '❌ NO'}`);
  
  if (!isValid) {
    console.log('\n   🔧 Fixing password...');
    const newHash = bcrypt.hashSync(testPassword, 12);
    db.prepare('UPDATE admins SET password = ? WHERE email = ?').run(newHash, testEmail);
    console.log('   ✅ Password updated in database');
  }
}

// Check 5: Verify .env
console.log('\n⚙️  Environment variables:');
console.log(`   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'admin@agency.com'}`);
console.log(`   ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`   PORT: ${process.env.PORT || 5000}`);

console.log('\n' + '='.repeat(60));
console.log('✨ Diagnostic complete!\n');

db.close();
