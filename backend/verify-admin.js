const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.join(__dirname, 'agency.db');
const db = new Database(dbPath);

console.log('📋 Checking admin credentials...\n');

const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@agency.com');

if (admin) {
  console.log(`✅ Admin found:`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Created: ${admin.created_at}`);
  console.log(`\n📝 To login use:`);
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@agency.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
} else {
  console.log(`❌ Admin not found. Creating admin user...`);
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
  db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
    process.env.ADMIN_EMAIL || 'admin@agency.com',
    hash,
    'Agency Admin'
  );
  console.log(`\n✅ Admin user created successfully!`);
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@agency.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
}

// Verify password by testing login
if (admin || db.prepare('SELECT * FROM admins WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@agency.com')) {
  const adminRecord = db.prepare('SELECT * FROM admins WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@agency.com');
  const isPasswordCorrect = bcrypt.compareSync(process.env.ADMIN_PASSWORD || 'Admin@123', adminRecord.password);
  console.log(`\n🔐 Password verification: ${isPasswordCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
}

db.close();
console.log('\n✨ Done!');
